
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const revalidate = 300; // Cache for 5 minutes

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
