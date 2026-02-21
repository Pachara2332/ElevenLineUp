
'use client';

import { useAuth } from '@/features/auth/hooks/useAuth';
import CreatePostBox from '@/features/community/components/CreatePostBox';
import FeedList from '@/features/community/components/FeedList';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import LogoutButton from '@/components/LogoutButton';
import SuggestedTeams from '@/features/community/components/SuggestedTeams';
import WeeklyChallenge from '@/features/community/components/WeeklyChallenge';

export default function CommunityPage() {
    const { user } = useAuth();

    if (!user) return null; // Will redirect via auth hook or middleware if setup

    return (
        <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <main className="lg:col-span-3 max-w-2xl mx-auto w-full space-y-8">
                    <WeeklyChallenge />
                    <CreatePostBox />
                    <FeedList />
                </main>
                <aside className="hidden lg:block">
                    <SuggestedTeams />
                </aside>
            </div>
        </div>
    );
}
