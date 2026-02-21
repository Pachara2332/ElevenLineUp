import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth-helper";
import { startOfDay } from "date-fns";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const difficultyParam = searchParams.get("difficulty");
    
    // Map string to enum
    const validDifficulties = ['CASUAL', 'COMPETITIVE', 'HARDCORE'];
    const difficultyConfig = validDifficulties.includes(difficultyParam?.toUpperCase() || '') 
        ? difficultyParam?.toUpperCase() as 'CASUAL' | 'COMPETITIVE' | 'HARDCORE'
        : 'CASUAL';

    const todayStart = startOfDay(new Date());

    // In a real app, we'd find the quiz where `date` is today. 
    // Since our Quiz schema relies on `createdAt` or random selection for now, let's fetch the latest quiz per type.
    const quizzes = await prisma.quiz.findMany({
      where: {
        difficulty: difficultyConfig,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10, // Limit to recent to not expose entire DB
    });

    if (quizzes.length === 0) {
       return NextResponse.json({ data: [] });
    }

    // Get attempts for this user today to establish the daily limit per quiz type
    const attemptsToday = await prisma.quizAttempt.findMany({
      where: {
        userId: user.userId,
        createdAt: {
          gte: todayStart
        }
      },
      select: {
          quizId: true
      }
    });

    const attemptedQuizIds = new Set(attemptsToday.map(a => a.quizId));

    // Filter out quizzes they've already played today
    const availableQuizzes = quizzes.filter(q => !attemptedQuizIds.has(q.id));

    // Prepare response, stripping out the 'answer' field
    const safeData = availableQuizzes.map(quiz => ({
        id: quiz.id,
        type: quiz.type,
        difficulty: quiz.difficulty,
        question: quiz.question,
        imageUrl: quiz.imageUrl,
        options: quiz.options,
        isCompletedToday: false, 
    }));

    return NextResponse.json({ data: safeData });

  } catch (error: any) {
    console.error("Quiz Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch quizzes" }, { status: 500 });
  }
}
