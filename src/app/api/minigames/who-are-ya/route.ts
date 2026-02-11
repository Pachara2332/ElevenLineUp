import { NextResponse } from "next/server";

export async function GET() {
  // Mock Data: Kylian Mbappe
  // In a real app, image_url would be a pre-blurred image or we blur it on frontend.
  // Here we send the clear image and let frontend blur it.
  const mockGame = {
    id: "mock-whoareya-1",
    player_id: 798, // Mock ID
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/2019-07-17_SG_Dynamo_Dresden_vs._Paris_Saint-Germain_by_Sandro_Halank%E2%80%93129_%28Kylian_Mbapp%C3%A9%29.jpg/600px-2019-07-17_SG_Dynamo_Dresden_vs._Paris_Saint-Germain_by_Sandro_Halank%E2%80%93129_%28Kylian_Mbapp%C3%A9%29.jpg",
    hints: {
      nationality: "France",
      position: "ST",
      club: "Real Madrid", // Updated for 2025 lol, or stick to PSG if old data
    },
  };

  return NextResponse.json({
    data: mockGame,
  });
}

export async function POST(req: Request) {
  try {
    const { guess } = await req.json();

    // Mock check logic
    const correctAnswers = ["kylian mbappe", "mbappe", "kylian"];
    const guessLower = guess.toLowerCase();

    const isCorrect = correctAnswers.some((ans) => guessLower.includes(ans));

    if (isCorrect) {
      return NextResponse.json({
        correct: true,
        real_name: "Kylian Mbappé",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/2019-07-17_SG_Dynamo_Dresden_vs._Paris_Saint-Germain_by_Sandro_Halank%E2%80%93129_%28Kylian_Mbapp%C3%A9%29.jpg/600px-2019-07-17_SG_Dynamo_Dresden_vs._Paris_Saint-Germain_by_Sandro_Halank%E2%80%93129_%28Kylian_Mbapp%C3%A9%29.jpg",
      });
    }

    return NextResponse.json({ correct: false });
  } catch (error) {
    return NextResponse.json({ error: "Validation failed" }, { status: 500 });
  }
}
