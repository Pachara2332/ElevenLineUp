'use client';

import { useAuth } from '@/features/auth/hooks/useAuth';
import TeamSelection from '@/features/team/components/TeamSelection';
import LogoutButton from '@/components/LogoutButton';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
    const { user, isLoading, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) {
        return <div className="text-white text-2xl font-bold animate-pulse text-center mt-20">Loading Dashboard...</div>;
    }

    if (!user) return null; // Will redirect

    return (
        <div className="min-h-screen p-4 md:p-8">
            <header className="flex justify-between items-center mb-8 max-w-6xl mx-auto">
                <div>
                    <h1 className="text-3xl font-black text-white drop-shadow-md">
                        Welcome, <span className="text-emerald-300">{user.name}</span>
                    </h1>
                    <p className="text-white/80">Manage your lineups and teams</p>
                </div>
                <LogoutButton />
            </header>

            <main>
                <TeamSelection />
            </main>
        </div>
    );
}
