
import { ApiHandler } from '@/lib/api-handler';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const GET = ApiHandler.handle(async (req, ctx) => {
  const { teamId } = ctx.params;

  // In a real app with separate Player model, we would query prisma.player.findMany({ where: { teamId } })
  // For this MVP, players are stored as JSON on the team model, so we fetch the team and return its players.
  
  const team = await prisma.premierTeam.findUnique({
    where: { id: teamId },
    select: { players: true },
  });

  if (!team) {
      return ApiHandler.error('Team not found', 404, 'NOT_FOUND');
  }
  
  return NextResponse.json({ data: team.players });
});
