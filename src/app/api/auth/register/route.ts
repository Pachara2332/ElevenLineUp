
import { NextResponse } from 'next/server';
import { ApiHandler } from '@/lib/api-handler';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { config } from '@/config/unifiedConfig';

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export const POST = ApiHandler.handle(async (req) => {
  const body = await req.json();
  const { name, email, password } = registerSchema.parse(body);

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // Auto-login
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

  return ApiHandler.success({ user: { id: user.id, name: user.name, email: user.email } }, 201);
});
