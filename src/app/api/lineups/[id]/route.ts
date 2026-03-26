
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const lineup = await prisma.lineup.findUnique({
      where: { lineupId: id },
      include: {
        slots: true,
        team: true,
      },
    });

    if (!lineup) {
      return NextResponse.json({ error: 'Lineup not found' }, { status: 404 });
    }

    return NextResponse.json({ data: lineup });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch lineup' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, formation, isPublic, slots } = body;

    // Update basic info
    await prisma.lineup.update({
      where: { lineupId: id },
      data: {
        name,
        formation,
        isPublic,
      },
    });

    // Update slots if provided
    if (slots && Array.isArray(slots)) {
      // Transaction to update slots efficiently
      // Strategy: Upsert or delete/create? 
      // Simplest for now: Delete all slots for this lineup and recreate them (snapshot approach)
      // Limitation: Might be heavy for frequent updates, but safe for consistency
      
      await prisma.$transaction([
        prisma.lineupSlot.deleteMany({ where: { lineupId: id } }),
        prisma.lineupSlot.createMany({
          data: slots.map((slot: any) => ({
            lineupId: id,
            slotId: slot.id, 
            position: slot.position,
            x: slot.x,
            y: slot.y,
            playerId: slot.player?.id ? String(slot.player.id) : null,
            playerName: slot.player?.name || null,
            playerImage: slot.player?.image || null,
          })),
        }),
      ]);
    }

    const updatedLineup = await prisma.lineup.findUnique({
        where: { lineupId: id },
        include: { slots: true }
    });

    return NextResponse.json({ data: updatedLineup });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: 'Failed to update lineup' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.lineup.delete({
      where: { lineupId: id },
    });

    return NextResponse.json({ message: 'Lineup deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete lineup' }, { status: 500 });
  }
}
