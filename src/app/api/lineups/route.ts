// app/api/lineups/route.ts - เวอร์ชัน Debug

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { config } from '@/config/unifiedConfig';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, teamId, formation, slots } = body;

    // 🔍 LOG 1: ดูข้อมูลที่ได้รับ
    console.log('📥 Received data:', {
      name,
      teamId,
      formation,
      slotsCount: slots?.length,
      firstSlot: slots?.[0]
    });

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

    const user = await prisma.user.findUnique({ where: { userId } });
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 🔍 LOG 2: ตรวจสอบว่า user และ team มีอยู่จริง
    console.log('✅ User found:', user.userId);
    
    let teamExists = await prisma.team.findUnique({ where: { teamId } });
    if (!teamExists) {
      console.log('⚠️ Team not found, creating a new dummy team for ID:', teamId);
      teamExists = await prisma.team.create({
        data: {
          teamId,
          name: 'Unknown Team',
          league: 'Unknown League',
          logo: '/default-team.png',
          players: [],
        }
      });
    }
    console.log('✅ Team found / created:', teamExists.name);

    function generateSlug(name: string, formation: string): string {
      const base = `${name}-${formation}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const uniqueId = Math.random().toString(36).substring(2, 8);
      return `${base}-${uniqueId}`;
    }

    const slug = generateSlug(name, formation || '4-3-3');

    // 🔍 LOG 3: ดูข้อมูลที่จะส่งเข้า database
    const lineupData = {
      name,
      slug,
      formation: formation || '4-3-3',
      userId: user.userId,
      teamId: teamId,
      slots: {
        create: slots.map((slot: any) => {
          const slotData = {
            position: slot.position,
            x: slot.x,
            y: slot.y,
            playerId: slot.player?.id ? String(slot.player.id) : null,
            playerName: slot.player?.name || null,
            playerImage: slot.player?.image || null,
          };
          console.log('🎯 Creating slot:', slotData);
          return slotData;
        }),
      },
    };

    console.log('💾 Attempting to create lineup with data:', {
      name: lineupData.name,
      formation: lineupData.formation,
      userId: lineupData.userId,
      teamId: lineupData.teamId,
      slotsToCreate: lineupData.slots.create.length
    });

    const newLineup = await prisma.lineup.create({
      data: lineupData,
      include: {
        slots: true,
      },
    });

    console.log('✅ Lineup created successfully:', newLineup.lineupId);

    return NextResponse.json({ data: newLineup }, { status: 201 });
    
  } catch (error: any) {
    // 🔍 LOG 4: แสดง error แบบละเอียด
    console.error('❌ Error creating lineup:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error meta:', error.meta);
    console.error('Full error:', error);
    
    return NextResponse.json({ 
      error: 'Failed to create lineup',
      details: error.message,
      code: error.code
    }, { status: 500 });
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
        team: true,
        slots: true,
      }
    });

    return NextResponse.json({ data: lineups });
  } catch (error) {
    console.error('Error fetching lineups:', error);
    return NextResponse.json({ error: 'Failed to fetch lineups' }, { status: 500 });
  }
}