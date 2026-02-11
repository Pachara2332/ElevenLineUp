
import { ApiHandler } from '@/lib/api-handler';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { config } from '@/config/unifiedConfig';
import jwt from 'jsonwebtoken';

const followSchema = z.object({
  targetUserId: z.string(),
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

export const POST = ApiHandler.handle(async (req) => {
  const userId = await getAuthenticatedUser();
  if (!userId) {
    return ApiHandler.error('Unauthorized', 401, 'UNAUTHORIZED');
  }

  const body = await req.json();
  const { targetUserId } = followSchema.parse(body);

  if (userId === targetUserId) {
    return ApiHandler.error('Cannot follow yourself', 400, 'INVALID_OPERATION');
  }

  // Check if already following
  const existingFollow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: userId,
        followingId: targetUserId,
      },
    },
  });

  if (existingFollow) {
    return ApiHandler.success({ message: 'Already following' });
  }

  await prisma.follow.create({
    data: {
      followerId: userId,
      followingId: targetUserId,
    },
  });

  return ApiHandler.success({ message: 'Followed successfully' });
});

export const DELETE = ApiHandler.handle(async (req) => {
  const userId = await getAuthenticatedUser();
  if (!userId) {
    return ApiHandler.error('Unauthorized', 401, 'UNAUTHORIZED');
  }

  const body = await req.json();
  const { targetUserId } = followSchema.parse(body);

  await prisma.follow.delete({
    where: {
      followerId_followingId: {
        followerId: userId,
        followingId: targetUserId,
      },
    },
  });

  return ApiHandler.success({ message: 'Unfollowed successfully' });
});
