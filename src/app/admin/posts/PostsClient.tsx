'use client';

import { useState } from 'react';

type PostData = {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    author: {
        name: string;
        email: string;
    };
    _count: {
        comments: number;
        likes: number;
    };
};

export default function PostsClient({ initialPosts }: { initialPosts: PostData[] }) {
    const [posts, setPosts] = useState(initialPosts);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleDelete = async (postId: string) => {
        if (!confirm('Are you sure you want to delete this post? This will also delete all comments on this post.')) return;

        setIsUpdating(true);
        try {
            const res = await fetch(`/api/admin/posts?id=${postId}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setPosts(posts.filter(p => p.id !== postId));
            } else {
                alert('Failed to delete post.');
            }
        } catch (err) {
            console.error(err);
            alert('Error deleting post');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm whitespace-nowrap">
                    <thead className="uppercase tracking-wider border-b border-gray-200 dark:border-gray-700 font-medium bg-gray-50 dark:bg-gray-800/50">
                        <tr>
                            <th className="px-6 py-4">Title / Content Snippet</th>
                            <th className="px-6 py-4">Author</th>
                            <th className="px-6 py-4">Posted On</th>
                            <th className="px-6 py-4 text-center">Stats</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {posts.map((p) => (
                            <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition whitespace-normal">
                                <td className="px-6 py-4 max-w-xs">
                                    <div className="font-bold text-emerald-900 dark:text-emerald-400 mb-1">{p.title}</div>
                                    <div className="text-gray-500 text-xs truncate">{p.content}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-bold">{p.author.name}</div>
                                    <div className="text-gray-500 text-xs">{p.author.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{new Date(p.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-center whitespace-nowrap">
                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-bold mr-2" title="Likes">👍 {p._count.likes}</span>
                                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-bold" title="Comments">💬 {p._count.comments}</span>
                                </td>
                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                    <button
                                        disabled={isUpdating}
                                        onClick={() => handleDelete(p.id)}
                                        className="text-red-500 hover:text-red-700 font-semibold bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition"
                                    >
                                        Delete Post
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
