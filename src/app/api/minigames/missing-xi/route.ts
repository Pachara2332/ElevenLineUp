
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const game = await prisma.dailyMissingXI.findFirst({
             where: { date: { lte: new Date() } },
             orderBy: { date: 'desc' }
        });

        if (!game) return NextResponse.json({ error: "No game found" }, { status: 404 });

        // Transform players to hide the names of missing ones
        const players = (game.players as any[]).map(p => ({
            ...p,
            name: p.isMissing ? '???' : p.name, // Hide name if missing
            isRevealed: !p.isMissing
        }));

        return NextResponse.json({
            data: {
                id: game.id,
                date: game.date,
                teamName: game.teamName,
                formation: game.formation,
                players
            }
        });

    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
export async function POST(req: Request) {
    try {
        const { gameId, guess } = await req.json(); // guess is a player name string
        
        const game = await prisma.dailyMissingXI.findUnique({ where: { id: gameId } });
        if (!game) return NextResponse.json({ error: "Game not found" }, { status: 404 });

        // Check if guess matches ANY missing player
        const players = game.players as any[];
        const matchIndex = players.findIndex(p => 
            p.isMissing && p.name.toLowerCase() === guess.toLowerCase()
        );

        if (matchIndex !== -1) {
            return NextResponse.json({
                correct: true,
                player: players[matchIndex],
                index: matchIndex
            });
        }

        return NextResponse.json({ correct: false });

    } catch (error) {
        return NextResponse.json({ error: "Validation failed" }, { status: 500 });
    }
}
