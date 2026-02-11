
import { ApiHandler } from '@/lib/api-handler';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { config } from '@/config/unifiedConfig';
import jwt from 'jsonwebtoken';

const createPollSchema = z.object({
  question: z.string().min(3).max(200),
  options: z.array(z.string().min(1).max(100)).min(2).max(10),
  durationDays: z.number().min(1).max(30).optional().default(7),
});

async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(config.auth.cookieName)?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, config.auth.jwtSecret) as { userId: string };
    return decoded.userId;
  } catch (error) {
    return null;
  }
}

export const GET = ApiHandler.handle(async (req) => {
  const url = new URL(req.url);
  const limit = parseInt(url.searchParams.get('limit') || '5');
  
  // Fetch active polls
  const polls = await prisma.poll.findMany({
    where: {
      expiresAt: {
        gt: new Date(),
      },
    },
    take: limit,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      options: {
        include: {
          _count: {
            select: { votes: true },
          }
        }
      },
      creator: {
        select: {
          name: true,
          avatar: true,
        }
      },
      _count: {
        select: { votes: true }
      }
    }
  });

  return ApiHandler.success(polls);
});

export const POST = ApiHandler.handle(async (req) => {
  const userId = await getAuthenticatedUser();
  if (!userId) {
    return ApiHandler.error('Unauthorized', 401, 'UNAUTHORIZED');
  }

  const body = await req.json();
  const { question, options, durationDays } = createPollSchema.parse(body);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + durationDays);

  const poll = await prisma.poll.create({
    data: {
      question,
      userId,
      expiresAt,
      options: {
        create: options.map(opt => ({ text: opt })),
      },
    },
    include: {
      options: true,
    }
  });

  return ApiHandler.success(poll);
});
