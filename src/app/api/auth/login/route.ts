
import { NextResponse } from 'next/server';
import { ApiHandler } from '@/lib/api-handler';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { cookies } from 'next/headers';
import { config } from '@/config/unifiedConfig';
import { AuthService } from '@/lib/auth-service';
import { checkRateLimit, recordLoginAttempt } from '@/lib/rate-limit';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const POST = ApiHandler.handle(async (req) => {
  const body = await req.json();
  const { email, password } = loginSchema.parse(body);

  // 1. Check Rate Limit
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  const limit = await checkRateLimit(ip); // Check IP
  const limitEmail = await checkRateLimit(email); // Check Email

  if (!limit.success || !limitEmail.success) {
    return ApiHandler.error('Too many login attempts. Please try again later.', 429, 'RATE_LIMIT_EXCEEDED');
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    await recordLoginAttempt(email, ip, false);
    return ApiHandler.error('Invalid credentials', 401, 'INVALID_CREDENTIALS');
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    await recordLoginAttempt(email, ip, false);
    return ApiHandler.error('Invalid credentials', 401, 'INVALID_CREDENTIALS');
  }

  // 2. Generate Tokens
  const { accessToken, refreshToken } = AuthService.generateTokens(user);
  
  // 3. Store Refresh Token
  await AuthService.createRefreshToken(user.userId, refreshToken);
  await recordLoginAttempt(email, ip, true);

  // 4. Set Cookies
  const cookieStore = await cookies();
  
  // Access Token
  cookieStore.set(config.auth.cookieName, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60, // 15 minutes
    path: '/',
  });

  // Refresh Token
  cookieStore.set('refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });

  return ApiHandler.success({ user: { userId: user.userId, name: user.name, username: user.username, email: user.email, role: user.role } });
});
