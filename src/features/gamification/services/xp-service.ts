import prisma from "@/lib/prisma";

export const BADGES = {
  TACTICAL_GENIUS: "Tactical Genius", // E.g., creating lineups or making accurate predictions
  PREDICTION_KING: "Prediction King", // 5 prediction wins
  COMMUNITY_STAR: "Community Star",   // 10 posts or high XP
  FOOTBALL_SCHOLAR: "Football Scholar", // Correct quizzes
  PREMIER_LEAGUE_BRAIN: "Premier League Brain" // High quiz streak
};

/**
 * Awards XP to a user and updates their stats/badges.
 * Ensure to call this within try/catch blocks in API routes to prevent main flow errors.
 */
export async function awardXP(userId: string, amount: number) {
  try {
    // Upsert to ensure UserStats exists for the user
    let stats = await prisma.userStats.upsert({
      where: { userId },
      update: { xp: { increment: amount } },
      create: {
        userId,
        xp: amount,
      },
    });

    // Check for badge unlocks based on XP and generic criteria
    const newlyUnlockedBadges: string[] = [];
    const currentBadges = stats.badges || [];

    // COMMUNITY STAR Logic: Example condition (XP >= 100 or postsCount >= 10)
    // Here we just use XP as a fallback, caller functions should ideally pass specific triggers.
    if (stats.xp >= 100 && !currentBadges.includes(BADGES.COMMUNITY_STAR)) {
      newlyUnlockedBadges.push(BADGES.COMMUNITY_STAR);
    }

    if (newlyUnlockedBadges.length > 0) {
      stats = await prisma.userStats.update({
        where: { userId },
        data: {
          badges: {
            push: newlyUnlockedBadges,
          },
        },
      });
    }

    return stats;
  } catch (error) {
    console.error("Failed to award XP:", error);
    // Silent fail to avoid disrupting the main action (like posting/commenting)
    return null;
  }
}

/**
 * Increments post count and awards XP. Checks for Community Star badge.
 */
export async function awardPostXP(userId: string) {
  try {
    let stats = await prisma.userStats.upsert({
      where: { userId },
      update: { 
        xp: { increment: 5 },
        postsCount: { increment: 1 }
      },
      create: {
        userId,
        xp: 5,
        postsCount: 1
      },
    });

    if (stats.postsCount >= 10 && !stats.badges.includes(BADGES.COMMUNITY_STAR)) {
      stats = await prisma.userStats.update({
        where: { userId },
        data: { badges: { push: BADGES.COMMUNITY_STAR } }
      });
    }
    return stats;
  } catch (error) {
    console.error("Failed to award Post XP:", error);
    return null;
  }
}

/**
 * Increments prediction wins and awards XP. Checks for Prediction King badge.
 */
export async function awardPredictionWin(userId: string) {
  try {
    let stats = await prisma.userStats.upsert({
      where: { userId },
      update: { 
        xp: { increment: 10 },
        predictionWins: { increment: 1 }
      },
      create: {
        userId,
        xp: 10,
        predictionWins: 1
      },
    });

    if (stats.predictionWins >= 5 && !stats.badges.includes(BADGES.PREDICTION_KING)) {
      stats = await prisma.userStats.update({
        where: { userId },
        data: { badges: { push: BADGES.PREDICTION_KING } }
      });
    }
    return stats;
  } catch (error) {
    console.error("Failed to award Prediction XP:", error);
    return null;
  }
}

/**
 * Awards XP for completing a Quiz.
 * Dynamic rules: Hardcore gives more base XP. Fast answers give speed bonus. Hints reduce XP.
 */
export async function awardQuizXP(userId: string, isCorrect: boolean, timeTaken: number, hintsUsed: number, difficulty: 'CASUAL' | 'COMPETITIVE' | 'HARDCORE') {
  if (!isCorrect) return { xpEarned: 0 };

  let baseXP = 20;
  if (difficulty === 'COMPETITIVE') baseXP = 30;
  if (difficulty === 'HARDCORE') baseXP = 50;

  let speedBonus = 0;
  if (timeTaken <= 5) speedBonus = 10;
  else if (timeTaken <= 15) speedBonus = 5;

  let hintPenalty = hintsUsed * 5;

  let totalXP = baseXP + speedBonus - hintPenalty;
  if (totalXP < 5) totalXP = 5; // Minimum 5 XP for a correct answer

  try {
    let stats = await prisma.userStats.upsert({
      where: { userId },
      update: { xp: { increment: totalXP } },
      create: { userId, xp: totalXP }
    });

    // Example Badge Check: Football Scholar if XP reaches 500 (can be refined later)
    if (stats.xp >= 500 && !stats.badges.includes(BADGES.FOOTBALL_SCHOLAR)) {
      stats = await prisma.userStats.update({
        where: { userId },
        data: { badges: { push: BADGES.FOOTBALL_SCHOLAR } }
      });
    }

    return { xpEarned: totalXP, stats };
  } catch (error) {
    console.error("Failed to award Quiz XP:", error);
    return { xpEarned: totalXP }; // Return calculated XP even if DB fails, for UI
  }
}
