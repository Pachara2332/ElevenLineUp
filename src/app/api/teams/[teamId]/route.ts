import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  const { teamId } = await params; // ⭐ สำคัญมาก

  const team = await prisma.team.findUnique({
    where: { teamId },
    select: {
      teamId: true,
      name: true,
      logo: true,
      league: true,
    },
  });

  if (!team) {
    return NextResponse.json(
      { success: false, message: 'Team not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: team });
}
