import { NextResponse } from "next/server";

export async function GET() {
  // Mock Data: Real Madrid 2016/17 UCL Final
  const mockGame = {
    id: "mock-missing-xi-1",
    team: {
      name: "Real Madrid",
      logo: "/teams/realmd.png", // Mock path
    },
    season: "2016/17",
    formation: "4-3-3",
    lineup: [
      { name: "Navas", position: "GK", x: 50, y: 90, is_masked: false },
      { name: "Carvajal", position: "RB", x: 90, y: 70, is_masked: false },
      { name: "Varane", position: "CB", x: 65, y: 75, is_masked: false },
      { name: "Ramos", position: "CB", x: 35, y: 75, is_masked: true }, // MISSING
      { name: "Marcelo", position: "LB", x: 10, y: 70, is_masked: false },
      { name: "Casemiro", position: "CDM", x: 50, y: 60, is_masked: true }, // MISSING
      { name: "Modric", position: "CM", x: 70, y: 55, is_masked: false },
      { name: "Kroos", position: "CM", x: 30, y: 55, is_masked: false },
      { name: "Isco", position: "CAM", x: 50, y: 40, is_masked: false },
      { name: "Benzema", position: "ST", x: 50, y: 15, is_masked: true }, // MISSING
      { name: "Ronaldo", position: "LW", x: 20, y: 25, is_masked: false },
    ],
  };

  return NextResponse.json({
    data: mockGame,
  });
}

export async function POST(req: Request) {
  try {
    const { guess } = await req.json();

    // Mock check logic
    const correctAnswers: Record<string, string> = {
      ramos: "Sergio Ramos",
      casemiro: "Casemiro",
      benzema: "Karim Benzema",
    };

    const guessLower = guess.toLowerCase();

    // Check if guess matches any partial key
    const match = Object.keys(correctAnswers).find((k) =>
      guessLower.includes(k),
    );

    if (match) {
      return NextResponse.json({
        correct: true,
        real_name: correctAnswers[match],
      });
    }

    return NextResponse.json({ correct: false });
  } catch (error) {
    return NextResponse.json({ error: "Validation failed" }, { status: 500 });
  }
}
