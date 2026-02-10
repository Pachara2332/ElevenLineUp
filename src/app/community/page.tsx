
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


            <main className="max-w-2xl mx-auto">
                <CreatePostBox />
                <FeedList />
            </main>
        </div>
    );
}
