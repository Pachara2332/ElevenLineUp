
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Fetch today's game OR the most recent one if today's doesn't exist (fallback for demo)
        const game = await prisma.dailyTicTacToe.findFirst({
            where: {
                date: { lte: new Date() } // Get most recent including today
            },
            orderBy: {
                date: 'desc'
            }
        });

        if (!game) {
            return NextResponse.json({ error: "No game found" }, { status: 404 });
        }

        // Return only the grid structure, NOT the solutions!
        return NextResponse.json({
            data: {
                id: game.id,
                date: game.date,
                rows: game.rows,
                cols: game.cols
            }
        });

    } catch (error) {
        console.error("Failed to fetch tictactoe:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { gameId, row, col, playerId } = await req.json();

        const game = await prisma.dailyTicTacToe.findUnique({
            where: { id: gameId }
        });

        if (!game) return NextResponse.json({ error: "Game not found" }, { status: 404 });

        const solutions = game.solutions as any;
        const key = `${row}-${col}`;
        const validPlayers = solutions[key] || [];

        // In a real app, we might also want to search the player by ID in the Team/Player database to double check names,
        // but for this MVP, we rely on the solutions JSON having the player name/ID.
        // Assuming the user sends a player Name for now, or match ID.
        // The frontend will search for a player and send their ID or Name.
        // The Solutions JSON in seed data uses NAMES ("Bukayo Saka").
        
        // Let's assume the frontend sends the Player Name selected from a search.
        const isValid = validPlayers.includes(playerId); // playerId here is actually Name in our seed data

        return NextResponse.json({
            correct: isValid
        });

    } catch (error) {
        return NextResponse.json({ error: "Validation failed" }, { status: 500 });
    }
}
