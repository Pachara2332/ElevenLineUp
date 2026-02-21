
import { ApiHandler } from '@/lib/api-handler';
import prisma from '@/lib/prisma';

export const GET = ApiHandler.handle(async (req) => {
  const url = new URL(req.url);
  const type = url.searchParams.get('type') || 'lineups'; // lineups, players, posts
  const limit = parseInt(url.searchParams.get('limit') || '5');

  // Logic for Trending Lineups (Most likes in last 7 days)
  if (type === 'lineups') {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // This is a simplified "trending" logic. 
    // Ideally we aggregate Likes. For now, fetch recent public lineups.
    // To do proper trending by likes, we need aggregation, which can be heavy.
    // Let's just fetch public lineups ordered by creation date for "New & Trending" for now
    // until we populate enough Like data.
    
    // Actually, let's try to order by likes count if possible, or just mock it with recent ones.
    // Prisma doesn't support easy "order by relation count" without raw query or aggregation middleware in some versions.
    // We will stick to recent public lineups for MVP efficiency.
    
    const trendingLineups = await prisma.lineup.findMany({
      where: {
        isPublic: true,
      },
      take: limit,
      orderBy: {
        createdAt: 'desc', 
      },
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
            username: true,
          }
        },
        _count: {
          select: { likes: true } // Assuming we added likes to Lineup
        }
      }
    });

    return ApiHandler.success(trendingLineups);
  }
  
  return ApiHandler.success([]);
});
