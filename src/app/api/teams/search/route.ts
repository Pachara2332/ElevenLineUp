import { NextRequest, NextResponse } from "next/server";

const EXTERNAL_API = process.env.EXTERNAL_API_URL || "http://localhost:8000";

// All league competition IDs
const ALL_LEAGUES = ["GB1", "ES1", "IT1", "L1", "FR1"];

// Clean team name by removing (xxx) suffix
function cleanTeamName(name: string): string {
  return name.replace(/\s*\(\d+\)$/, "").trim();
}

// Transform API team to frontend format
function transformTeam(team: any) {
  return {
    teamId: team.club_id,
    name: cleanTeamName(team.club_name),
    logo: team.logo_url,
    league: team.competition_name,
  };
}

// Fetch teams from a single competition
async function fetchTeamsByCompetition(competitionId: string, search: string) {
  const params = new URLSearchParams();
  params.set("competition_id", competitionId);
  if (search) params.set("q", search);
  params.set("limit", "100");

  const res = await fetch(
    `${EXTERNAL_API}/api/teams/search?${params.toString()}`,
  );

  if (!res.ok) return [];

  const json = await res.json();
  return json.teams?.map(transformTeam) || [];
}

export async function GET(req: NextRequest) {
  const competitionId = req.nextUrl.searchParams.get("competition_id") || "";
  const search = req.nextUrl.searchParams.get("q") || "";

  try {
    let teams: any[] = [];

    if (competitionId) {
      // Fetch single league
      teams = await fetchTeamsByCompetition(competitionId, search);
    } else {
      // Fetch ALL leagues in parallel
      const results = await Promise.all(
        ALL_LEAGUES.map((id) => fetchTeamsByCompetition(id, search)),
      );
      teams = results.flat();
    }

    return NextResponse.json({ data: teams });
  } catch (error) {
    console.error("Error fetching teams:", error);
    return NextResponse.json(
      { data: [], error: "Failed to fetch teams" },
      { status: 500 },
    );
  }
}
