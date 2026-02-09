
'use client';

import { useAuth } from '@/features/auth/hooks/useAuth';
import CreatePostBox from '@/features/community/components/CreatePostBox';
import FeedList from '@/features/community/components/FeedList';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import LogoutButton from '@/components/LogoutButton';

export default function CommunityPage() {
    const { user } = useAuth();

    if (!user) return null; // Will redirect via auth hook or middleware if setup

    return (
        <div className="min-h-screen p-4 md:p-8">
            <header className="flex justify-between items-center mb-8 max-w-4xl mx-auto">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                        <ArrowLeftIcon className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text drop-shadow-md">
                            Community <span className="text-emerald-300">Hub</span>
                        </h1>
                        <p className="text-white/80">Share your squads and discuss with others</p>
                    </div>
                </div>
                <LogoutButton />
            </header>

            <main className="max-w-2xl mx-auto">
                <CreatePostBox />
                <FeedList />
            </main>
        </div>
    );
}
