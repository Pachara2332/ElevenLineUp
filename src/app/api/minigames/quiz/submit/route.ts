import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth-helper";
import { awardQuizXP } from "@/features/gamification/services/xp-service";

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { quizId, userAnswer, timeTaken, hintsUsed } = body;

    if (!quizId || !userAnswer || timeTaken === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Fetch the ground truth
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId }
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // Very simple string matching (case-insensitive for now)
    const isCorrect = quiz.answer.toLowerCase() === (userAnswer as string).toLowerCase();
    
    // Award XP
    let xpEarned = 0;
    if (isCorrect) {
        const result = await awardQuizXP(user.userId, isCorrect, timeTaken, hintsUsed || 0, quiz.difficulty);
        xpEarned = result?.xpEarned || 0;
    }

    // Save Attempt
    await prisma.quizAttempt.create({
      data: {
        quizId: quiz.id,
        userId: user.userId,
        isCorrect,
        timeTaken,
        hintsUsed: hintsUsed || 0,
        xpEarned
      }
    });

    // Return the response, exposing the correct answer so the frontend can display it if they got it wrong
    return NextResponse.json({ 
        isCorrect, 
        xpEarned, 
        correctAnswer: quiz.answer 
    });

  } catch (error: any) {
    console.error("Quiz Submit Error:", error);
    return NextResponse.json({ error: "Failed to submit answer" }, { status: 500 });
  }
}
