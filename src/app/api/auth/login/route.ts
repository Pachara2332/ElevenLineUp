
import { NextResponse } from 'next/server';
import { ApiHandler } from '@/lib/api-handler';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { config } from '@/config/unifiedConfig';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const POST = ApiHandler.handle(async (req) => {
  const body = await req.json();
  const { email, password } = loginSchema.parse(body);

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return ApiHandler.error('Invalid credentials', 401, 'INVALID_CREDENTIALS');
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return ApiHandler.error('Invalid credentials', 401, 'INVALID_CREDENTIALS');
  }

  const token = jwt.sign({ userId: user.id, email: user.email }, config.auth.jwtSecret, {
    expiresIn: '7d',
  });

  (await cookies()).set(config.auth.cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });

  return ApiHandler.success({ user: { id: user.id, name: user.name, email: user.email } });
});
