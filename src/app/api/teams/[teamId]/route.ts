import { NextRequest, NextResponse } from "next/server";

const EXTERNAL_API = process.env.EXTERNAL_API_URL || "http://localhost:8000";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ teamId: string }> },
) {
  const { teamId } = await params;

  try {
    const res = await fetch(`${EXTERNAL_API}/api/teams/${teamId}`);

    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: "Team not found" },
        { status: 404 },
      );
    }

    const json = await res.json();

    // Transform to frontend format
    const team = {
      teamId: json.club_id || teamId,
      name: json.club_name?.replace(/\s*\(\d+\)$/, "").trim(),
      logo: json.logo_url,
      league: json.competition_name || json.league,
    };

    return NextResponse.json({ success: true, data: team });
  } catch (error) {
    console.error("Error fetching team:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch team" },
      { status: 500 },
    );
  }
}
