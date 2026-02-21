import { ApiHandler } from '@/lib/api-handler';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth-helper';

export const GET = ApiHandler.handle(async (req, { params }) => {
  const { fixtureId } = await params;
  if (!fixtureId) return ApiHandler.error('Fixture ID required', 400);

  // Auto-create thread if it doesn't exist
  let thread = await prisma.matchThread.findUnique({
    where: { fixtureId }
  });

  if (!thread) {
    thread = await prisma.matchThread.create({
      data: { fixtureId }
    });
  }

  // Fetch recent messages
  const messages = await prisma.matchMessage.findMany({
    where: { threadId: thread.id },
    include: {
      user: {
        select: { name: true, avatar: true }
      }
    },
    orderBy: { createdAt: 'asc' }, // usually UI handles auto-scroll to bottom
    take: 100 // load last 100 by default
  });

  return ApiHandler.success({ thread, messages });
});

export const POST = ApiHandler.handle(async (req, { params }) => {
  const user = await getAuthUser();
  if (!user) return ApiHandler.error('Unauthorized', 401, 'UNAUTHORIZED');

  const { fixtureId } = await params;
  const { content } = await req.json();

  if (!content || !content.trim()) return ApiHandler.error('Content required', 400);

  let thread = await prisma.matchThread.findUnique({
    where: { fixtureId }
  });

  if (!thread) {
    return ApiHandler.error('Thread not found', 404);
  }

  if (!thread.isActive) {
     return ApiHandler.error('Thread is closed', 403);
  }

  // Create message
  const message = await prisma.matchMessage.create({
    data: {
      threadId: thread.id,
      userId: user.userId,
      content: content.trim()
    },
    include: {
      user: { select: { name: true, avatar: true } }
    }
  });

  // Global var hack to emit using our socket.io instance
  if (global.io) {
    global.io.of('/match').to(`match_${fixtureId}`).emit('new_message', message);
  } else {
    console.warn('global.io is not accessible. Make sure you are running via node server.js');
  }

  return ApiHandler.success({ message });
});
