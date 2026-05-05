
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export const revalidate = 300; // Cache for 5 minutes

const LEAGUE_NAME_BY_ID: Record<string, string> = {
  PL: 'Premier League',
  PD: 'La Liga',
  BL1: 'Bundesliga',
  SA: 'Serie A',
  FL1: 'Ligue 1',
  ELC: 'Championship',
  DED: 'Eredivisie',
  PPL: 'Primeira Liga',
  BSA: 'Brasileirao',
  'premier-league': 'Premier League',
  'la-liga': 'La Liga',
  bundesliga: 'Bundesliga',
  'serie-a': 'Serie A',
  'ligue-1': 'Ligue 1',
  championship: 'Championship',
  eredvisie: 'Eredivisie',
  'primeira-liga': 'Primeira Liga',
  brasileirao: 'Brasileirao',
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const leagueId = searchParams.get('leagueId');
    const resolvedLeague = leagueId
      ? LEAGUE_NAME_BY_ID[leagueId] || leagueId
      : null;

    let fixtures: any[] = [];
    const apiKey = process.env.FOOTBALL_API_KEY;

    // Prefer live external fixtures to avoid stale local schedule data.
    if (leagueId && apiKey) {
      const externalRes = await fetch(
        `https://api.football-data.org/v4/competitions/${leagueId}/matches?status=SCHEDULED`,
        {
          headers: { 'X-Auth-Token': apiKey },
          next: { revalidate: 300 },
        },
      );

      if (externalRes.ok) {
        const externalJson = await externalRes.json();
        const externalMatches = Array.isArray(externalJson?.matches)
          ? externalJson.matches
          : [];

        fixtures = externalMatches.slice(0, 100).map((m: any) => ({
          id: String(m.id),
          league: m.competition?.name || resolvedLeague || leagueId,
          season: String(m.season?.startDate || ''),
          homeTeam: m.homeTeam?.name || 'Home',
          awayTeam: m.awayTeam?.name || 'Away',
          kickoff: m.utcDate ? new Date(m.utcDate) : new Date(),
          status: 'scheduled',
          homeScore: null,
          awayScore: null,
        }));
      }
    }

    // Fallback to local fixtures only when external data is unavailable.
    if (fixtures.length === 0) {
      fixtures = await prisma.fixture.findMany({
        where: {
          status: 'scheduled',
          ...(resolvedLeague ? { league: resolvedLeague } : {}),
        },
        orderBy: {
          kickoff: 'asc',
        },
        take: 100,
      });
    }

    return NextResponse.json({ data: fixtures });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch fixtures' }, { status: 500 });
  }
}
