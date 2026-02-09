
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const game = await prisma.dailyWhoAreYa.findFirst({
             where: { date: { lte: new Date() } },
             orderBy: { date: 'desc' }
        });

        if (!game) return NextResponse.json({ error: "No game found" }, { status: 404 });

        return NextResponse.json({
            data: {
                id: game.id,
                date: game.date,
                blurredImage: game.blurredImage,
                pixelateLevel: game.pixelateLevel,
                teamName: game.teamName // Optional hint
            }
        });

    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
     try {
        const { gameId, guess } = await req.json();

        const game = await prisma.dailyWhoAreYa.findUnique({ where: { id: gameId } });
        if (!game) return NextResponse.json({ error: "Game not found" }, { status: 404 });

        const isCorrect = game.playerName.toLowerCase() === guess.toLowerCase();

        return NextResponse.json({
            correct: isCorrect,
            playerName: isCorrect ? game.playerName : undefined // Reveal if correct
        });

    } catch (error) {
        return NextResponse.json({ error: "Validation failed" }, { status: 500 });
    }
}
