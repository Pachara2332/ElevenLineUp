'use client';
import CommentBox from './CommentBox'
import CommentList from './CommentList'
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { HandThumbUpIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { HandThumbUpIcon as HandThumbUpIconSolid } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import clsx from 'clsx';
import Link from 'next/link';
import io from 'socket.io-client';

interface Post {
    id: string;
    content: string;
    imageUrl: string | null;
    createdAt: string;
    likeCount: number;
    commentCount: number;
    currentUserLiked: boolean;
    finalScore: number;
    author: {
        name: string;
        username?: string | null;
        avatar?: string | null;
    };
    team?: {
        name: string;
        logo: string;
    } | null;
    comments?: any[]
}


async function fetchPosts() {
    const res = await fetch('/api/community/feed');
    if (!res.ok) throw new Error('Failed to fetch posts');
    const json = await res.json();
    console.log('API response:', json); // ดูว่าคืนค่าอะไรมา
    const posts = json.data?.items ?? [];
    return Array.isArray(posts) ? (posts as Post[]) : [];
}

export default function FeedList() {
    const { user } = useAuth();
    const { data: posts, isLoading } = useQuery({
        queryKey: ['posts'],
        queryFn: fetchPosts,
    });
    const [realtimePosts, setRealtimePosts] = useState<Post[]>([]);

    // Socket.IO for real-time new posts
    useEffect(() => {
        const socket = io({
            path: '/socket.io',
        });

        socket.on('connect', () => {
            console.log('Feed socket connected:', socket.id);
            // Join global feed room
            socket.emit('join', 'feed');
        });

        // Listen for new posts
        socket.on('new_post', (post: Post) => {
            console.log('Received new post:', post);
            setRealtimePosts(prev => {
                // Avoid duplicates
                if (prev.find(p => p.id === post.id) || posts?.find(p => p.id === post.id)) {
                    return prev;
                }
                return [post, ...prev];
            });
        });

        socket.on('connect_error', (err) => {
            console.error('Feed socket error:', err);
        });

        return () => {
            console.log('Disconnecting feed socket');
            socket.disconnect();
        };
    }, [posts]);

    // Combine fetched posts with real-time posts and deduplicate by ID
    const allPosts = [...(realtimePosts || []), ...(posts || [])];
    const uniquePosts = Array.from(new Map(allPosts.map(p => [p.id, p])).values());

    if (isLoading) {
        return (
            <div className="space-y-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="glass-panel p-6 rounded-3xl animate-pulse">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-emerald-200/50"></div>
                            <div>
                                <div className="h-4 w-32 bg-emerald-200/50 rounded mb-2"></div>
                                <div className="h-3 w-20 bg-emerald-100/50 rounded"></div>
                            </div>
                        </div>
                        <div className="space-y-3 mb-6">
                            <div className="h-4 bg-emerald-100/50 rounded w-full"></div>
                            <div className="h-4 bg-emerald-100/50 rounded w-5/6"></div>
                        </div>
                        <div className="flex items-center gap-6 pt-4 border-t border-emerald-900/10">
                            <div className="h-6 w-12 bg-emerald-100/50 rounded"></div>
                            <div className="h-6 w-24 bg-emerald-100/50 rounded"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!uniquePosts || uniquePosts.length === 0) {
        return (
            <div className="text-center py-16 px-4 glass-panel rounded-3xl border-dashed border-2 border-emerald-200">
                <div className="text-6xl mb-4 opacity-50 relative animate-bounce">🏟️</div>
                <h3 className="text-xl font-bold text-emerald-800 mb-2">The stadium is quiet...</h3>
                <p className="text-emerald-600 font-medium">Be the first to start the conversation!</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {uniquePosts?.map(post => (
                <PostCard key={post.id} post={post} currentUserId={user?.userId} />
            ))}
        </div>
    );
}

function PostCard({ post, currentUserId }: { post: Post, currentUserId?: string }) {
    const [showComments, setShowComments] = useState(false)

    const [liked, setLiked] = useState(post.currentUserLiked);
    const [likesCount, setLikesCount] = useState(post.likeCount);
    const [comments, setComments] = useState(post.comments || [])
    const calculatedCommentCount = Math.max(post.commentCount, comments.length);

    // Sync comments from server when post prop changes
    useEffect(() => {
        setComments(post.comments || []);
    }, [post.comments]);

    // Socket.IO for real-time comments
    useEffect(() => {
        if (!showComments) return;

        const socket = io({
            path: '/socket.io',
        });

        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
            // Join post room once connected
            socket.emit('join', `post-${post.id}`);
        });

        // Listen for new comments
        socket.on('new_comment', (comment: any) => {
            console.log('Received new comment:', comment);
            setComments(prev => {
                // Strict duplicate check
                if (prev.find(c => c.id === comment.id)) {
                    console.log('Duplicate comment ignored:', comment.id);
                    return prev;
                }
                return [...prev, comment];
            });
        });

        socket.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
        });

        return () => {
            console.log('Disconnecting socket');
            socket.disconnect();
        };
    }, [post.id, showComments]);

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
                    <Link href={`/u/${post.author.username || 'unknown'}`} className="font-bold text-emerald-900 hover:text-emerald-700 hover:underline">
                        {post.author.name}
                    </Link>
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
                        "flex items-center gap-2 font-semibold transition-transform active:scale-95 group",
                        liked ? "text-emerald-600" : "text-emerald-900/60 hover:text-emerald-900"
                    )}
                >
                    {liked ? <HandThumbUpIconSolid className="w-6 h-6 animate-in zoom-in spin-in-3 duration-300 drop-shadow-sm" /> : <HandThumbUpIcon className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />}
                    <span>{likesCount}</span>
                </button>

                <button
                    onClick={() => setShowComments(prev => !prev)}
                    className="flex items-center gap-2 text-emerald-900/60 hover:text-emerald-900 font-semibold transition-colors"
                >
                    <ChatBubbleLeftIcon className="w-6 h-6" />
                    <span>{calculatedCommentCount} Comments</span>
                </button>

            </div>

            {/* comments section */}
            {showComments && (
                <div className="mt-4 transition-all duration-300 ease-in-out">
                    <CommentList comments={comments} />

                    <CommentBox
                        postId={post.id}
                        onNewComment={(c) => {
                            // Check for duplicates before adding
                            setComments(prev => {
                                if (prev.find(existing => existing.id === c.id)) return prev;
                                return [...prev, c];
                            });
                        }}
                    />
                </div>
            )}

        </div>
    );

}
