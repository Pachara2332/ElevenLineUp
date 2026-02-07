
import { NextResponse } from 'next/server';
import { ApiHandler } from '@/lib/api-handler';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { config } from '@/config/unifiedConfig';

export const GET = ApiHandler.handle(async (req) => {
  const cookieStore = await cookies();
  const token = cookieStore.get(config.auth.cookieName)?.value;

  if (!token) {
    return ApiHandler.error('Unauthorized', 401, 'UNAUTHORIZED');
  }

  try {
    const decoded = jwt.verify(token, config.auth.jwtSecret) as { userId: string };
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true },
    });

    if (!user) {
      return ApiHandler.error('User not found', 404, 'USER_NOT_FOUND');
    }

    return ApiHandler.success({ user });
  } catch (error) {
    return ApiHandler.error('Invalid token', 401, 'INVALID_TOKEN');
  }
});
