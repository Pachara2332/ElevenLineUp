'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlusIcon, UserMinusIcon } from '@heroicons/react/24/solid';

interface FollowButtonProps {
    targetUserId: string;
    initialIsFollowing: boolean;
    onToggle?: (isFollowing: boolean) => void;
}

export default function FollowButton({ targetUserId, initialIsFollowing, onToggle }: FollowButtonProps) {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleFollow = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/community/follow', {
                method: isFollowing ? 'DELETE' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ targetUserId }),
            });

            if (res.ok) {
                const newState = !isFollowing;
                setIsFollowing(newState);
                router.refresh(); // Refresh to update feed or counts
                if (onToggle) onToggle(newState);
            } else {
                console.error('Failed to toggle follow');
            }
        } catch (error) {
            console.error('Error following user:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleFollow}
            disabled={isLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all duration-300 ${isFollowing
                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                    : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-md hover:shadow-lg'
                }`}
        >
            {isLoading ? (
                <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : isFollowing ? (
                <>
                    <UserMinusIcon className="w-5 h-5" />
                    <span>Following</span>
                </>
            ) : (
                <>
                    <UserPlusIcon className="w-5 h-5" />
                    <span>Follow</span>
                </>
            )}
        </button>
    );
}
