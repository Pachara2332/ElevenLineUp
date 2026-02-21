import { NextResponse } from 'next/server';
import { ApiHandler } from '@/lib/api-handler';
import prisma from '@/lib/prisma';
import { checkAdmin } from '@/lib/admin-auth';

export const GET = ApiHandler.handle(async (req) => {
  const isAdmin = await checkAdmin();
  if (!isAdmin) return ApiHandler.error('Unauthorized', 403, 'FORBIDDEN');
  
  const users = await prisma.user.findMany({
    select: {
      userId: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          posts: true,
          comments: true,
          lineups: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  
  return ApiHandler.success({ users });
});

export const PUT = ApiHandler.handle(async (req) => {
  const isAdmin = await checkAdmin();
  if (!isAdmin) return ApiHandler.error('Unauthorized', 403, 'FORBIDDEN');

  const { userId, role } = await req.json();
  
  const updatedUser = await prisma.user.update({
    where: { userId },
    data: { role },
  });

  return ApiHandler.success({ user: updatedUser });
});

export const DELETE = ApiHandler.handle(async (req) => {
  const isAdmin = await checkAdmin();
  if (!isAdmin) return ApiHandler.error('Unauthorized', 403, 'FORBIDDEN');

  const url = new URL(req.url);
  const userId = url.searchParams.get('id');

  if (!userId) {
    return ApiHandler.error('User ID is required', 400);
  }

  await prisma.user.delete({
    where: { userId },
  });

  return ApiHandler.success({ message: 'User deleted successfully' });
});
