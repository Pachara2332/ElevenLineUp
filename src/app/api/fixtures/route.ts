
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const revalidate = 300; // Cache for 5 minutes

export async function GET() {
  try {
    const fixtures = await prisma.fixture.findMany({
      where: {
        status: 'scheduled', 
      },
      orderBy: {
        kickoff: 'asc',
      },
      take: 10,
    });

    return NextResponse.json({ data: fixtures });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch fixtures' }, { status: 500 });
  }
}
