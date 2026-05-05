
'use client';

import { useAuth } from '@/features/auth/hooks/useAuth';
import CreatePostBox from '@/features/community/components/CreatePostBox';
import FeedList from '@/features/community/components/FeedList';
import SuggestedTeams from '@/features/community/components/SuggestedTeams';
import WeeklyChallenge from '@/features/community/components/WeeklyChallenge';

export default function CommunityPage() {
    const { user } = useAuth();

    if (!user) return null; // Will redirect via auth hook or middleware if setup

    return (
        <div className="min-h-screen px-4 pb-12 pt-4 sm:px-6 md:pt-8">
            <div className="mx-auto grid w-full max-w-6xl grid-cols-1 justify-center gap-8 lg:grid-cols-[minmax(0,720px)_280px] lg:items-start">
                <main className="mx-auto w-full max-w-[720px] space-y-8">
                    <WeeklyChallenge />
                    <CreatePostBox />
                    <FeedList />
                </main>
                <aside className="hidden lg:block lg:sticky lg:top-28">
                    <SuggestedTeams />
                </aside>
            </div>
        </div>
    );
}
