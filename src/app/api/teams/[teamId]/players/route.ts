import { NextRequest, NextResponse } from "next/server";

const EXTERNAL_API = process.env.EXTERNAL_API_URL || "http://localhost:8000";

// Position mapping: slot position -> player positions ที่เหมาะสม
const POSITION_MAPPING: Record<string, string[]> = {
  GK: ["Goalkeeper"],
  LB: ["Left-Back", "Left Midfield", "Defensive Midfield"],
  RB: ["Right-Back", "Right Midfield", "Defensive Midfield"],
  CB: ["Centre-Back", "Defensive Midfield"],
  LCB: ["Centre-Back", "Defensive Midfield"],
  RCB: ["Centre-Back", "Defensive Midfield"],
  LWB: ["Left-Back", "Left Midfield", "Left Winger"],
  RWB: ["Right-Back", "Right Midfield", "Right Winger"],
  CDM: ["Defensive Midfield", "Central Midfield"],
  CM: ["Central Midfield", "Defensive Midfield", "Attacking Midfield"],
  CAM: ["Attacking Midfield", "Central Midfield"],
  LM: ["Left Midfield", "Left Winger", "Left-Back"],
  RM: ["Right Midfield", "Right Winger", "Right-Back"],
  LW: ["Left Winger", "Left Midfield", "Centre-Forward", "Second Striker"],
  RW: ["Right Winger", "Right Midfield", "Centre-Forward", "Second Striker"],
  LF: ["Left Winger", "Second Striker", "Centre-Forward"],
  RF: ["Right Winger", "Second Striker", "Centre-Forward"],
  ST: ["Centre-Forward", "Second Striker"],
  CF: ["Centre-Forward", "Second Striker", "Attacking Midfield"],
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ teamId: string }> },
) {
  try {
    const { teamId } = await params;
    const { searchParams } = new URL(request.url);
    const position = searchParams.get("position")?.toUpperCase() || "";
    const limit = parseInt(searchParams.get("limit") || "0", 10);

    // All filter params
    const search = searchParams.get("search") || "";
    const nationality = searchParams.get("nationality") || "";
    const birthYear = searchParams.get("birth_year") || "";
    const minHeight = searchParams.get("min_height") || "";
    const maxHeight = searchParams.get("max_height") || "";
    const foot = searchParams.get("foot") || "";
    const season = searchParams.get("season") || "";
    const currentOnly = searchParams.get("current_only") || "";

    // Fetch from external API with all filter params
    const apiUrl = new URL(`${EXTERNAL_API}/api/teams/${teamId}/players`);
    if (position) apiUrl.searchParams.set("position", position);
    if (search) apiUrl.searchParams.set("search", search);
    if (nationality) apiUrl.searchParams.set("nationality", nationality);
    if (birthYear) apiUrl.searchParams.set("birth_year", birthYear);
    if (minHeight) apiUrl.searchParams.set("min_height", minHeight);
    if (maxHeight) apiUrl.searchParams.set("max_height", maxHeight);
    if (foot) apiUrl.searchParams.set("foot", foot);
    if (season) apiUrl.searchParams.set("season", season);
    if (currentOnly) apiUrl.searchParams.set("current_only", currentOnly);
    apiUrl.searchParams.set("limit", "500"); // Get all players

    const res = await fetch(apiUrl.toString());

    if (!res.ok) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const json = await res.json();
    let players = json.players || [];

    // Transform to frontend format
    players = players.map((p: any) => ({
      id: p.player_id,
      name: p.player_name,
      image: p.player_image_url,
      position: p.position || p.main_position, // FastAPI sends 'position'
      nationality: p.citizenship,
      dateOfBirth: p.date_of_birth,
      height: p.height,
      foot: p.foot,
    }));

    // Filter by position
    if (position && POSITION_MAPPING[position]) {
      const validPositions = POSITION_MAPPING[position];
      players = players.filter((p: any) =>
        validPositions.some((pos) =>
          p.position?.toLowerCase().includes(pos.toLowerCase()),
        ),
      );
    }

    // Apply limit
    if (limit > 0) {
      players = players.slice(0, limit);
    }

    return NextResponse.json({
      team_id: teamId,
      position: position || "ALL",
      total: players.length,
      data: players,
    });
  } catch (error) {
    console.error("Error fetching players:", error);
    return NextResponse.json(
      { error: "Failed to fetch players" },
      { status: 500 },
    );
  }
}
