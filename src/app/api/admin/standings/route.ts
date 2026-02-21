import { NextResponse } from 'next/server';
import { ApiHandler } from '@/lib/api-handler';
import prisma from '@/lib/prisma';
import { checkAdmin } from '@/lib/admin-auth';

export const GET = ApiHandler.handle(async (req) => {
  const isAdmin = await checkAdmin();
  if (!isAdmin) return ApiHandler.error('Unauthorized', 403, 'FORBIDDEN');
  
  const standings = await prisma.leagueStanding.findMany({
    orderBy: { position: 'asc' },
  });
  return ApiHandler.success({ standings });
});

export const PUT = ApiHandler.handle(async (req) => {
  const isAdmin = await checkAdmin();
  if (!isAdmin) return ApiHandler.error('Unauthorized', 403, 'FORBIDDEN');

  const { id, position, won, drawn, lost, played, points, goalsFor, goalsAgainst, form } = await req.json();
  const goalDifference = goalsFor - goalsAgainst;
  
  const updated = await prisma.leagueStanding.update({
    where: { id },
    data: { position, won, drawn, lost, played, points, goalsFor, goalsAgainst, goalDifference, form },
  });

  return ApiHandler.success({ standing: updated });
});
