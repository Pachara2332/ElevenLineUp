
import { ApiHandler } from '@/lib/api-handler';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { config } from '@/config/unifiedConfig';
import jwt from 'jsonwebtoken';

async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(config.auth.cookieName)?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, config.auth.jwtSecret) as { userId: string };
    return decoded.userId;
  } catch (error) {
    return null;
  }
}

export const GET = ApiHandler.handle(async (req) => {
  const userId = await getAuthenticatedUser();
  if (!userId) {
    return ApiHandler.error('Unauthorized', 401, 'UNAUTHORIZED');
  }

  const url = new URL(req.url);
  const limit = parseInt(url.searchParams.get('limit') || '10');
  const page = parseInt(url.searchParams.get('page') || '1');
  const skip = (page - 1) * limit;

  // 1. Get IDs of users I follow
  const following = await prisma.follow.findMany({
    where: {
      followerId: userId,
    },
    select: {
      followingId: true,
    },
  });

  const followingIds = following.map(f => f.followingId);

  // 2. Fetch Lineups from these users
  // Note: ideally we mix Posts and Lineups. For now, let's focus on Lineups as the main content.
  const feedItems = await prisma.lineup.findMany({
    where: {
      userId: {
        in: followingIds,
      },
      isPublic: true,
    },
    take: limit,
    skip: skip,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      user: {
        select: {
          name: true,
          avatar: true,
        },
      },
      _count: {
        select: { likes: true }, 
      },
      // Check if current user liked it requires more complex query or separate check
      // For MVP, we just return the lineup
    },
  });

  return ApiHandler.success({
    items: feedItems,
    nextPage: feedItems.length === limit ? page + 1 : null,
  });
});
