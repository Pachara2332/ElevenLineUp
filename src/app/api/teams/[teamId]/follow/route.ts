import { NextResponse } from 'next/server';
import { ApiHandler } from '@/lib/api-handler';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth-helper';

export const POST = ApiHandler.handle(async (req, { params }) => {
  const user = await getAuthUser();
  if (!user) return ApiHandler.error('Unauthorized', 401, 'UNAUTHORIZED');

  const { teamId } = await params;

  if (!teamId) return ApiHandler.error('Team ID is required', 400);

  const existing = await prisma.userFavoriteTeam.findUnique({
    where: {
      userId_teamId: {
        userId: user.userId,
        teamId,
      }
    }
  });

  if (existing) {
    await prisma.userFavoriteTeam.delete({
      where: { id: existing.id }
    });
    return ApiHandler.success({ following: false });
  }

  await prisma.userFavoriteTeam.create({
    data: {
      userId: user.userId,
      teamId,
    }
  });

  return ApiHandler.success({ following: true });
});
