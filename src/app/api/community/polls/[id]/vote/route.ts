
import { ApiHandler } from '@/lib/api-handler';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { config } from '@/config/unifiedConfig';
import jwt from 'jsonwebtoken';

const voteSchema = z.object({
  optionId: z.string(),
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const POST = ApiHandler.handle(async (req, ctx) => {
  const pollId = (await (ctx.params as Promise<{id: string}>)).id;
  const userId = await getAuthenticatedUser();

  if (!userId) {
    return ApiHandler.error('Unauthorized', 401, 'UNAUTHORIZED');
  }

  const body = await req.json();
  const { optionId } = voteSchema.parse(body);

  // Check if poll exists and is active
  const poll = await prisma.poll.findUnique({
    where: { id: pollId },
  });

  if (!poll) {
    return ApiHandler.error('Poll not found', 404, 'NOT_FOUND');
  }

  if (poll.expiresAt && new Date() > poll.expiresAt) {
    return ApiHandler.error('Poll has ended', 400, 'POLL_ENDED');
  }

  // Check if already voted
  const existingVote = await prisma.pollVote.findUnique({
    where: {
      userId_pollId: {
        userId,
        pollId,
      },
    },
  });

  if (existingVote) {
    return ApiHandler.error('Already voted on this poll', 400, 'ALREADY_VOTED');
  }

  // Verify option belongs to poll
  const option = await prisma.pollOption.findFirst({
    where: {
      id: optionId,
      pollId: pollId,
    },
  });

  if (!option) {
    return ApiHandler.error('Invalid option for this poll', 400, 'INVALID_OPTION');
  }

  // Cast vote
  await prisma.pollVote.create({
    data: {
      userId,
      pollId,
      optionId,
    },
  });

  return ApiHandler.success({ message: 'Vote cast successfully' });
});
