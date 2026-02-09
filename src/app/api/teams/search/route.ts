import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.get('q') || '';

  const teams = await prisma.team.findMany({
    where: {
      name: {
        contains: search,
        mode: 'insensitive',
      },
    },
    orderBy: {
      name: 'asc',
    },
    take: 50,
  });

  return NextResponse.json({ data: teams });
}
