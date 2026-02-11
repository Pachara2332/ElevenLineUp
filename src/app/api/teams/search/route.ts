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

// Fetch teams from a single competition (or global search if empty)
async function fetchTeamsByCompetition(competitionId: string, search: string) {
  const params = new URLSearchParams();
  if (competitionId) params.set("competition_id", competitionId);
  if (search) params.set("name", search);
  params.set("limit", "100");

  const url = `${EXTERNAL_API}/api/teams/search?${params.toString()}`;

  try {
    const res = await fetch(url);
    if (!res.ok) return [];

    const json = await res.json();
    return json.teams?.map(transformTeam) || [];
  } catch (error) {
    console.error(`[TeamSearch] Fetch Exception:`, error);
    return [];
  }
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
      // If no league selected (ALL button), fetch from all 5 major leagues
      const allTeamsPromises = ALL_LEAGUES.map((leagueId) =>
        fetchTeamsByCompetition(leagueId, search)
      );
      const allTeamsArrays = await Promise.all(allTeamsPromises);
      teams = allTeamsArrays.flat();

      // Remove duplicates by teamId
      const uniqueTeams = new Map();
      teams.forEach((team) => {
        if (!uniqueTeams.has(team.teamId)) {
          uniqueTeams.set(team.teamId, team);
        }
      });
      teams = Array.from(uniqueTeams.values());

      // Sort by name
      teams.sort((a, b) => a.name.localeCompare(b.name));
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
