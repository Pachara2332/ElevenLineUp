
import { ApiHandler } from '@/lib/api-handler';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth-helper';

export const GET = ApiHandler.handle(async (req) => {
  const user = await getAuthUser();
  if (!user) return ApiHandler.error('Unauthorized', 401, 'UNAUTHORIZED');

  const url = new URL(req.url);
  const limit = parseInt(url.searchParams.get('limit') || '10');
  const page = parseInt(url.searchParams.get('page') || '1');
  const skip = (page - 1) * limit;

  // 1. Get IDs of users I follow
  const following = await prisma.follow.findMany({
    where: { followerId: user.userId },
    select: { followingId: true },
  });
  const followingIds = following.map(f => f.followingId);

  // 2. Get IDs of Teams I follow
  const favTeams = await prisma.userFavoriteTeam.findMany({
    where: { userId: user.userId },
    select: { teamId: true }
  });
  const followedTeamIds = favTeams.map(t => t.teamId);

  // 3. Fetch Posts (pool size 100 for ranking algorithm)
  // Fix: If the user doesn't follow anyone/anything, we should just show the latest global posts.
  const whereClause = (followingIds.length > 0 || followedTeamIds.length > 0)
    ? {
        OR: [
          { authorId: { in: followingIds } },
          { teamTeamId: { in: followedTeamIds } }
        ]
      }
    : {}; // Global fallback

  const posts = await prisma.post.findMany({
    where: whereClause,
    take: 100, // Fetch top 100 recent posts to score them
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
        select: { userId: true, name: true, avatar: true, username: true },
      },
      team: {
        select: { name: true, logo: true }
      },
      comments: {
        include: {
          user: {
            select: { name: true, avatar: true, username: true }
          }
        },
        orderBy: { createdAt: 'asc' }
      },
      likes: {
        where: { userId: user.userId },
        select: { id: true }
      }
    },
  });

  // 4. Add currentUserLiked flag
  const postsWithLikeFlag = posts.map(post => {
    return {
      ...post,
      currentUserLiked: post.likes.length > 0
    };
  });

  // Sort by latest post first (createdAt desc)
  postsWithLikeFlag.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Pagination
  const paginatedPosts = postsWithLikeFlag.slice(skip, skip + limit);

  // Clean up data for response
  const feedItems = paginatedPosts.map(p => {
    const { likes, ...rest } = p;
    return rest;
  });

  return ApiHandler.success({
    items: feedItems,
    nextPage: skip + limit < postsWithLikeFlag.length ? page + 1 : null,
  });
});

