
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
// import { getServerSession } from 'next-auth'; // Commented out until next-auth is installed
// If using custom auth, import your session helper
// import { getSession } from '@/lib/auth'; 

// Temporary mock session for development if Auth isn't fully ready
async function getSession() {
  // TODO: Replace with real auth check
  return { user: { id: 'user_1' } }; 
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, teamId, formation, slots } = body;

    // TODO: Get real user ID from session
    // const session = await getServerSession();
    // if (!session || !session.user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    // const userId = session.user.userId;
    
    // Using a placeholder user for now until Auth is fully integrated in this route
    // In a real app, this MUST be the logged-in user's ID
    const userId = 'user_clsd...'; // You might need to fetch a real user ID or use the one from seed

    // For now, let's try to find the first user in DB to attach to
    const user = await prisma.user.findFirst();
    if (!user) {
        return NextResponse.json({ error: 'No users found in DB. Please register first.' }, { status: 400 });
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
    // Get user from session
    const user = await prisma.user.findFirst();
    if (!user) {
       return NextResponse.json({ data: [] }); // Return empty if no user
    }

    const lineups = await prisma.lineup.findMany({
      where: {
        userId: user.userId,
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
