'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface TrendingItem {
    id: string;
    name: string;
    user?: {
        name: string;
        username?: string | null;
        avatar: string | null;
    };
    _count?: {
        likes: number;
    };
    // For lineups
    formation?: string;
}

export default function TrendingSidebar() {
    const [lineups, setLineups] = useState<TrendingItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchTrending() {
            try {
                const res = await fetch('/api/community/trending?type=lineups&limit=5');
                if (res.ok) {
                    const data = await res.json();
                    setLineups(data);
                }
            } catch (error) {
                console.error('Failed to fetch trending', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchTrending();
    }, []);

    if (isLoading) {
        return <div className="animate-pulse bg-white/5 rounded-xl h-64 w-full"></div>;
    }

    return (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-black text-emerald-100 mb-6 flex items-center gap-2">
                🔥 Trending Lineups
            </h2>

            <div className="space-y-4">
                {lineups.map((item, index) => (
                    <Link
                        key={item.id}
                        href={`/lineups/${item.id}`}
                        className="block group"
                    >
                        <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/10 transition-all border border-transparent hover:border-white/10">
                            <div className="font-black text-2xl text-emerald-500/50 w-6 text-center group-hover:text-emerald-400 transition-colors">
                                {index + 1}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <h3 className="font-bold text-emerald-50 truncate group-hover:text-white transition-colors">
                                    {item.name}
                                </h3>
                                <p className="text-xs text-emerald-200/60 truncate">
                                    by {' '}
                                    {item.user ? (
                                        <Link href={`/u/${item.user.username || 'unknown'}`} className="hover:text-emerald-300 hover:underline z-10 relative" onClick={(e) => e.stopPropagation()}>
                                            {item.user.name}
                                        </Link>
                                    ) : 'Unknown'} • {item.formation}
                                </p>
                            </div>
                            {item._count?.likes !== undefined && (
                                <div className="text-xs font-bold bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-full">
                                    Why is this undefined?
                                    {item._count.likes} 🔥
                                </div>
                            )}
                        </div>
                    </Link>
                ))}

                {lineups.length === 0 && (
                    <div className="text-center text-emerald-200/40 py-8 text-sm">
                        No trending lineups yet.
                    </div>
                )}
            </div>

            <div className="mt-6 pt-6 border-t border-white/10">
                <h3 className="text-sm font-bold text-emerald-200/60 uppercase tracking-widest mb-4">
                    Trending Players
                </h3>
                {/* Placeholder for trending players */}
                <div className="flex flex-wrap gap-2">
                    {['Messi', 'Ronaldo', 'Salah', 'Haaland'].map(player => (
                        <span key={player} className="text-xs font-bold text-emerald-300 bg-emerald-900/30 px-3 py-1 rounded-full border border-emerald-500/20 hover:bg-emerald-500/20 cursor-pointer transition-colors">
                            #{player}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
