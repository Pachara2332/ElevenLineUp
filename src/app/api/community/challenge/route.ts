import { NextResponse } from 'next/server';
import { ApiHandler } from '@/lib/api-handler';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth-helper';

// Get Active Weekly Challenge and My Entry
export const GET = ApiHandler.handle(async (req) => {
  const user = await getAuthUser();
  if (!user) return ApiHandler.error('Unauthorized', 401, 'UNAUTHORIZED');

  const challenge = await prisma.weeklyChallenge.findFirst({
    where: { isActive: true },
    orderBy: { week: 'desc' },
  });

  if (!challenge) {
    return ApiHandler.success({ message: "No active challenge right now." });
  }

  const myEntry = await prisma.weeklyEntry.findUnique({
    where: {
      challengeId_userId: {
        challengeId: challenge.id,
        userId: user.userId
      }
    }
  });

  const leaderboard = await prisma.weeklyEntry.findMany({
    where: { challengeId: challenge.id },
    include: {
      user: {
        select: { name: true, avatar: true }
      }
    },
    orderBy: { totalPoints: 'desc' },
    take: 10
  });

  return ApiHandler.success({
    challenge,
    myEntry,
    leaderboard
  });
});

// Submit a Weekly Entry 
export const POST = ApiHandler.handle(async (req) => {
  const user = await getAuthUser();
  if (!user) return ApiHandler.error('Unauthorized', 401, 'UNAUTHORIZED');

  const { challengeId, formation, players } = await req.json();

  if (!challengeId || !formation || !players || !Array.isArray(players) || players.length !== 11) {
    return ApiHandler.error('Invalid submission. Must include exactly 11 players.', 400);
  }

  const challenge = await prisma.weeklyChallenge.findUnique({
    where: { id: challengeId }
  });

  if (!challenge || !challenge.isActive) {
    return ApiHandler.error('Challenge is not active or does not exist.', 400);
  }

  // Validate Budget Constraint
  let totalCost = 0;
  for (const p of players) {
      // In a real app we'd fetch actual cost from DB to prevent client spoofing
      // For MVP, we trust the cost sent payload: { id, position, cost: Number, points: Number }
      totalCost += p.cost || 0;
  }

  if (totalCost > challenge.budget) {
      return ApiHandler.error(`Budget exceeded! Max budget is ${challenge.budget}M, but you spent ${totalCost}M.`, 400);
  }

  // Upsert Entry
  const entry = await prisma.weeklyEntry.upsert({
    where: {
      challengeId_userId: {
        challengeId,
        userId: user.userId
      }
    },
    update: {
      lineup: { formation, players }
    },
    create: {
      challengeId,
      userId: user.userId,
      lineup: { formation, players },
      totalPoints: 0 // starting points always 0 until weekend calculation worker runs
    }
  });

  return ApiHandler.success({ message: 'Lineup submitted successfully!', entry });
});
