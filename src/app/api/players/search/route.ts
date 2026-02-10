import { NextResponse } from "next/server";

const EXTERNAL_API = process.env.EXTERNAL_API_URL || "http://localhost:8000";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query || query.length < 3) {
    return NextResponse.json({ data: [] });
  }

  try {
    const params = new URLSearchParams();
    params.set("name", query); // Map 'q' to 'name'
    params.set("limit", "20");

    const res = await fetch(
      `${EXTERNAL_API}/api/players/search?${params.toString()}`,
    );

    if (!res.ok) {
      return NextResponse.json({ data: [] });
    }

    const json = await res.json();

    // Backend returns { total: number, players: [...] }
    // Frontend expects { data: [{ name, team, position, image_url }, ...] }
    const results =
      json.players?.map((p: any) => ({
        name: p.player_name,
        team: p.current_club_name,
        position: p.main_position,
        image_url: p.player_image_url,
        id: p.player_id,
      })) || [];

    return NextResponse.json({ data: results });
  } catch (error) {
    console.error("Player search error:", error);
    return NextResponse.json({ data: [] });
  }
}
