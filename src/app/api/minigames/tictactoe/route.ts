import { NextResponse } from "next/server";

export async function GET() {
  // Mock Data for UI Development
  const mockGame = {
    id: "mock-tictactoe-1",
    date: new Date().toISOString(),
    rows: [
      { type: "TEAM", label: "Man Utd", value: "985" },
      { type: "NATION", label: "Brazil", value: "Brazil" },
      { type: "TEAM", label: "Real Madrid", value: "541" },
    ],
    cols: [
      { type: "NATION", label: "France", value: "France" },
      { type: "TEAM", label: "Arsenal", value: "19" },
      { type: "NATION", label: "Spain", value: "Spain" },
    ],
  };

  return NextResponse.json({
    data: mockGame,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Mock check - always return true for now to test UI
    return NextResponse.json({
      correct: true,
      player: "Marcus Rashford", // Mock player name
    });
  } catch (error) {
    return NextResponse.json({ error: "Validation failed" }, { status: 500 });
  }
}
