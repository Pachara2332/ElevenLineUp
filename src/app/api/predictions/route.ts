
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth-helper';

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fixtureId, homeScore, awayScore } = await req.json();

    if (!fixtureId || homeScore === undefined || awayScore === undefined) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Check if match has started
    const fixture = await prisma.fixture.findUnique({
        where: { id: fixtureId }
    });

    if (!fixture) {
        return NextResponse.json({ error: "Fixture not found" }, { status: 404 });
    }

    if (new Date() > new Date(fixture.kickoff)) {
        return NextResponse.json({ error: "Match has already started" }, { status: 400 });
    }

    // Upsert prediction
    const prediction = await prisma.matchPrediction.upsert({
        where: {
            userId_fixtureId: {
                userId: user.userId,
                fixtureId
            }
        },
        update: {
            predictedHome: homeScore,
            predictedAway: awayScore
        },
        create: {
            userId: user.userId,
            fixtureId,
            predictedHome: homeScore,
            predictedAway: awayScore
        }
    });

    return NextResponse.json({ data: prediction });

  } catch (error) {
    console.error("Prediction error:", error);
    return NextResponse.json({ error: "Failed to submit prediction" }, { status: 500 });
  }
}

export async function GET(req: Request) {
    try {
        const user = await getAuthUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const predictions = await prisma.matchPrediction.findMany({
            where: {
                userId: user.userId
            },
            include: {
                fixture: {
                    select: {
                        homeTeam: true,
                        awayTeam: true,
                        kickoff: true,
                        status: true,
                        homeScore: true,
                        awayScore: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({ data: predictions });
    } catch (error) {
        console.error("Fetch predictions error:", error);
        return NextResponse.json({ error: "Failed to fetch predictions" }, { status: 500 });
    }
}
