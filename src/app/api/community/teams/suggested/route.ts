import { NextResponse } from 'next/server';
import { ApiHandler } from '@/lib/api-handler';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth-helper';

export const GET = ApiHandler.handle(async (req) => {
  const user = await getAuthUser();
  if (!user) return ApiHandler.error('Unauthorized', 401, 'UNAUTHORIZED');

  // get teams and check if user follows them
  const teams = await prisma.team.findMany({
    select: {
      teamId: true,
      name: true,
      logo: true,
      favoritedBy: {
        where: { userId: user.userId },
        select: { id: true }
      }
    },
    take: 10, // Just suggest 10 teams for now
    orderBy: {
      favoritedBy: {
        _count: 'asc' // Prioritize teams without followers? Or just random.
      }
    }
  });

  const formattedTeams = teams.map(t => ({
    id: t.teamId,
    name: t.name,
    logo: t.logo,
    isFollowing: t.favoritedBy.length > 0
  }));

  // Sort: unfollowed first
  formattedTeams.sort((a, b) => Number(a.isFollowing) - Number(b.isFollowing));

  return ApiHandler.success({ teams: formattedTeams });
});
