
import prisma from '@/lib/prisma';

interface RateLimitConfig {
  windowMs: number;
  maxAttempts: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxAttempts: 5,
};

export async function checkRateLimit(identifier: string, config: RateLimitConfig = DEFAULT_CONFIG): Promise<{ success: boolean; remaining: number }> {
  const windowStart = new Date(Date.now() - config.windowMs);

  const attempts = await prisma.loginAttempt.count({
    where: {
      OR: [
        { email: identifier },
        { ipAddress: identifier }
      ],
      isSuccess: false,
      createdAt: {
        gte: windowStart,
      },
    },
  });

  if (attempts >= config.maxAttempts) {
    return { success: false, remaining: 0 };
  }

  return { success: true, remaining: config.maxAttempts - attempts };
}

export async function recordLoginAttempt(email: string, ipAddress: string, isSuccess: boolean) {
  await prisma.loginAttempt.create({
    data: {
      email,
      ipAddress,
      isSuccess,
    },
  });
}
