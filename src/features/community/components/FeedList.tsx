'use client';
import CommentBox from './CommentBox'
import CommentList from './CommentList'
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { HandThumbUpIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { HandThumbUpIcon as HandThumbUpIconSolid } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import clsx from 'clsx';

interface Post {
    id: string;
    content: string;
    imageUrl: string | null;
    createdAt: string;
    author: {
        name: string;
        avatar?: string | null;
    };
    _count: {
        likes: number;
        comments: number;
    };
    likes: { userId: string }[];
    comments?: any[]
}


async function fetchPosts() {
    const res = await fetch('/api/posts');
    if (!res.ok) throw new Error('Failed to fetch posts');
    const json = await res.json();
    return json.data as Post[];
}

export default function FeedList() {
    const { user } = useAuth();
    const { data: posts, isLoading } = useQuery({
        queryKey: ['posts'],
        queryFn: fetchPosts,
    });

    if (isLoading) return <div className="text-center text-emerald-800 animate-pulse">Loading feed...</div>;

    return (
        <div className="space-y-6">
            {posts?.map(post => (
                <PostCard key={post.id} post={post} currentUserId={user?.userId} />
            ))}
        </div>
    );
}

function PostCard({ post, currentUserId }: { post: Post, currentUserId?: string }) {
    const [showComments, setShowComments] = useState(false)

    const isLiked = post.likes.some(l => l.userId === currentUserId);
    const [liked, setLiked] = useState(isLiked);
    const [likesCount, setLikesCount] = useState(post._count.likes);
    const [comments, setComments] = useState(post.comments || [])

    const toggleLike = async () => {
        if (!currentUserId) return;

        // Optimistic update
        setLiked(!liked);
        setLikesCount(prev => liked ? prev - 1 : prev + 1);

        try {
            await fetch(`/api/posts/${post.id}/like`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (error) {
            // Revert on error
            setLiked(!liked);
            setLikesCount(prev => liked ? prev - 1 : prev + 1);
        }

    };

    return (
        <div className="glass-panel p-6 rounded-3xl">
            <div className="flex items-center gap-3 mb-4">
                {post.author.avatar ? (
                    <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-emerald-200"
                    />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-800 font-bold">
                        {post.author.name.charAt(0)}
                    </div>
                )}
                <div>
                    <div className="font-bold text-emerald-900">{post.author.name}</div>
                    <div className="text-xs text-emerald-900/60">
                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                    </div>
                </div>
            </div>

            <p className="text-emerald-900 mb-4 whitespace-pre-wrap">{post.content}</p>

            {post.imageUrl && (
                <div className="rounded-2xl overflow-hidden mb-4">
                    <img src={post.imageUrl} alt="Post content" className="w-full max-h-[500px] object-cover" />
                </div>
            )}

            <div className="flex items-center gap-6 pt-4 border-t border-emerald-900/10">
                <button
                    onClick={toggleLike}
                    className={clsx(
                        "flex items-center gap-2 font-semibold transition-colors",
                        liked ? "text-emerald-600" : "text-emerald-900/60 hover:text-emerald-900"
                    )}
                >
                    {liked ? <HandThumbUpIconSolid className="w-6 h-6" /> : <HandThumbUpIcon className="w-6 h-6" />}
                    <span>{likesCount}</span>
                </button>

                <button
                    onClick={() => setShowComments(prev => !prev)}
                    className="flex items-center gap-2 text-emerald-900/60 hover:text-emerald-900 font-semibold transition-colors"
                >
                    <ChatBubbleLeftIcon className="w-6 h-6" />
                    <span>{comments.length} Comments</span>
                </button>

            </div>

            {/* comments section */}
            {showComments && (
                <div className="mt-4 transition-all duration-300 ease-in-out">
                    <CommentList comments={comments} />

                    <CommentBox
                        postId={post.id}
                        onNewComment={(c) => setComments(prev => [...prev, c])}
                    />
                </div>
            )}

        </div>
    );

}
