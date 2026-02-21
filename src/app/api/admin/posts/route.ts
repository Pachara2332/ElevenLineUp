import { NextResponse } from 'next/server';
import { ApiHandler } from '@/lib/api-handler';
import prisma from '@/lib/prisma';
import { checkAdmin } from '@/lib/admin-auth';

export const GET = ApiHandler.handle(async (req) => {
  const isAdmin = await checkAdmin();
  if (!isAdmin) return ApiHandler.error('Unauthorized', 403, 'FORBIDDEN');
  
  const posts = await prisma.post.findMany({
    include: {
      author: {
        select: { name: true, email: true }
      },
      _count: {
        select: { comments: true, likes: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  
  return ApiHandler.success({ posts });
});

export const DELETE = ApiHandler.handle(async (req) => {
  const isAdmin = await checkAdmin();
  if (!isAdmin) return ApiHandler.error('Unauthorized', 403, 'FORBIDDEN');

  const url = new URL(req.url);
  const postId = url.searchParams.get('id');

  if (!postId) {
    return ApiHandler.error('Post ID is required', 400);
  }

  // Delete all associated comments and likes first to maintain referential integrity if not set to cascade
  await prisma.comment.deleteMany({ where: { postId } });
  await prisma.like.deleteMany({ where: { postId } });

  await prisma.post.delete({
    where: { id: postId },
  });

  return ApiHandler.success({ message: 'Post deleted successfully' });
});
