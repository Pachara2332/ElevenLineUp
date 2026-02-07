
import { ApiHandler } from '@/lib/api-handler';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const GET = ApiHandler.handle(async () => {
  const teams = await prisma.premierTeam.findMany({
    orderBy: { name: 'asc' },
  });
  
  return NextResponse.json({ data: teams });
});
