import { NextResponse } from 'next/server';
import { ApiHandler } from '@/lib/api-handler';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth-helper';

export const GET = ApiHandler.handle(async (req) => {
  const user = await getAuthUser();
  if (!user) return ApiHandler.error('Unauthorized', 401, 'UNAUTHORIZED');

  // Fetch recent notifications
  const notifications = await prisma.notification.findMany({
    where: { userId: user.userId },
    orderBy: { createdAt: 'desc' },
    take: 15,
    include: {
      actor: {
        select: {
          name: true,
          username: true,
          avatar: true,
        },
      },
    },
  });

  const postIds = notifications
    .filter((notification) => ['LIKE', 'COMMENT'].includes(notification.type) && notification.entityId)
    .map((notification) => notification.entityId as string);

  const relatedPosts = postIds.length
    ? await prisma.post.findMany({
        where: { id: { in: postIds } },
        select: {
          id: true,
          content: true,
          imageUrl: true,
          author: {
            select: {
              name: true,
              username: true,
            },
          },
        },
      })
    : [];

  const postsById = new Map(relatedPosts.map((post) => [post.id, post]));
  const notificationsWithDetails = notifications.map((notification) => ({
    ...notification,
    post: notification.entityId ? postsById.get(notification.entityId) ?? null : null,
  }));

  // Count unread
  const unreadCount = await prisma.notification.count({
    where: { userId: user.userId, isRead: false },
  });

  return ApiHandler.success({ notifications: notificationsWithDetails, unreadCount });
});

export const PUT = ApiHandler.handle(async (req) => {
  const user = await getAuthUser();
  if (!user) return ApiHandler.error('Unauthorized', 401, 'UNAUTHORIZED');

  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');

  if (action === 'markAdmin') {
    // Left for future use
  }

  // Action: Mark all as read
  if (action === 'markAllRead') {
      await prisma.notification.updateMany({
        where: { userId: user.userId, isRead: false },
        data: { isRead: true }
      });
      return ApiHandler.success({ message: 'Marked all as read' });
  }

  // Action: Mark single as read
  const body = await req.json();
  const { notificationId } = body;

  if (!notificationId) return ApiHandler.error('notificationId required', 400);

  const notification = await prisma.notification.updateMany({
    where: { id: notificationId, userId: user.userId },
    data: { isRead: true },
  });

  return ApiHandler.success({ notification });
});
