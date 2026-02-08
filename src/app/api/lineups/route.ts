import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { config } from '@/config/unifiedConfig';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, teamId, formation, slots } = body;

    const cookieStore = await cookies();
    const token = cookieStore.get(config.auth.cookieName)?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let userId: string;
    try {
      const decoded = jwt.verify(token, config.auth.jwtSecret) as { userId: string };
      userId = decoded.userId;
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // specific check for user existence (optional but good)
    const user = await prisma.user.findUnique({ where: { userId } });
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const newLineup = await prisma.lineup.create({
      data: {
        name,
        formation: formation || '4-3-3',
        userId: user.userId,
        teamId: teamId,
        slots: {
          create: slots.map((slot: any) => ({
            position: slot.position,
            x: slot.x,
            y: slot.y,
            // Flexible player data (snapshot)
            playerId: slot.player?.id,
            playerName: slot.player?.name,
            playerImage: slot.player?.image,
          })),
        },
      },
      include: {
        slots: true,
      },
    });

    return NextResponse.json({ data: newLineup }, { status: 201 });
  } catch (error) {
    console.error('Error creating lineup:', error);
    return NextResponse.json({ error: 'Failed to create lineup' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(config.auth.cookieName)?.value;

    if (!token) {
        return NextResponse.json({ data: [] });
    }

    let userId: string;
    try {
        const decoded = jwt.verify(token, config.auth.jwtSecret) as { userId: string };
        userId = decoded.userId;
    } catch (err) {
        return NextResponse.json({ data: [] });
    }

    const lineups = await prisma.lineup.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      include: {
        team: true, // Include team details for display
      }
    });

    return NextResponse.json({ data: lineups });
  } catch (error) {
    console.error('Error fetching lineups:', error);
    return NextResponse.json({ error: 'Failed to fetch lineups' }, { status: 500 });
  }
}
