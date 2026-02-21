import { NextResponse } from 'next/server';
import { ApiHandler } from '@/lib/api-handler';
import prisma from '@/lib/prisma';
import { checkAdmin } from '@/lib/admin-auth';

export const GET = ApiHandler.handle(async (req) => {
  const isAdmin = await checkAdmin();
  if (!isAdmin) return ApiHandler.error('Unauthorized', 403, 'FORBIDDEN');
  
  const fixtures = await prisma.fixture.findMany({
    orderBy: { kickoff: 'desc' },
  });
  return ApiHandler.success({ fixtures });
});

export const PUT = ApiHandler.handle(async (req) => {
  const isAdmin = await checkAdmin();
  if (!isAdmin) return ApiHandler.error('Unauthorized', 403, 'FORBIDDEN');

  const { id, homeScore, awayScore, status, kickoff } = await req.json();
  
  const updated = await prisma.fixture.update({
    where: { id },
    data: { 
        homeScore: homeScore !== null ? Number(homeScore) : null, 
        awayScore: awayScore !== null ? Number(awayScore) : null, 
        status, 
        kickoff: kickoff ? new Date(kickoff) : undefined 
    },
  });

  return ApiHandler.success({ fixture: updated });
});
