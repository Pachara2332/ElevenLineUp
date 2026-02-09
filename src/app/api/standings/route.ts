
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const standings = await prisma.leagueStanding.findMany({
      orderBy: {
        position: 'asc',
      },
    });

    return NextResponse.json({ data: standings });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch standings' }, { status: 500 });
  }
}
