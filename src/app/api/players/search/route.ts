
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query || query.length < 3) {
        return NextResponse.json({ data: [] });
    }

    // This is expensive in a real app (scanning JSON), but fine for MVP with 20 teams.
    const teams = await prisma.team.findMany({
        select: {
            name: true,
            players: true
        }
    });

    const results = [];
    const lowerQuery = query.toLowerCase();

    for (const team of teams) {
        const players = team.players as any[];
        if (!players) continue;

        for (const p of players) {
            if (p.name.toLowerCase().includes(lowerQuery)) {
                results.push({
                    name: p.name,
                    team: team.name,
                    position: p.position,
                    image_url: p.image_url
                });
                if (results.length > 10) break;
            }
        }
    }

    return NextResponse.json({ data: results });
}
