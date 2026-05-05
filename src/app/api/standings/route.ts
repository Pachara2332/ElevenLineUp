import { NextRequest, NextResponse } from 'next/server';

export const revalidate = 3600; // Cache for 1 hour

function buildEmptyStandingsPayload(league: string) {
  return {
    data: {
      competition: { name: league, code: league },
      standings: [{ table: [] }],
    },
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const league = searchParams.get('league') || 'PL';
  const apiKey = process.env.FOOTBALL_API_KEY;

  if (!apiKey) {
    return NextResponse.json(buildEmptyStandingsPayload(league), { status: 200 });
  }

  try {
    const res = await fetch(`https://api.football-data.org/v4/competitions/${league}/standings`, {
      headers: {
        'X-Auth-Token': apiKey,
      },
    });

    if (!res.ok) {
      // Avoid breaking dashboard when API quota is hit or league is unavailable.
      if (res.status === 429 || res.status === 404 || league === 'T1') {
        return NextResponse.json(buildEmptyStandingsPayload(league), { status: 200 });
      }
      throw new Error(`External API responded with ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Standings fetch error:', error);
    return NextResponse.json(buildEmptyStandingsPayload(league), { status: 200 });
  }
}
