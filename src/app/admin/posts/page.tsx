import prisma from '@/lib/prisma';
import PostsClient from './PostsClient';

export default async function AdminPostsPage() {
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

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-red-600">Community Moderation</h1>
            <p className="text-gray-500">Review community posts and delete inappropriate content.</p>

            {/* Serialize dates for Client Component */}
            <PostsClient initialPosts={JSON.parse(JSON.stringify(posts))} />
        </div>
    );
}
