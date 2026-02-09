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
            <header className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
                <div>
                    <h1 className="text-3xl font-black text drop-shadow-md">
                        Dashboard <span className="text-emerald-300">Overview</span>
                    </h1>
                    <p className="text-white/80">Welcome back, {user.name}</p>
                </div>
                <LogoutButton />
            </header>

            <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Actions & Stats */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Create Lineup Card */}
                    <div className="glass-panel p-8 rounded-[2rem] text-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        <h2 className="text-3xl font-black text-emerald-900 mb-2 relative z-10">Create Lineup</h2>
                        <p className="text-emerald-800 mb-8 font-medium relative z-10">Build your dream team now</p>

                        <div className="grid grid-cols-1 gap-3 relative z-10">
                            <button
                                onClick={() => router.push('/dashboard/create')}
                                className="w-full py-4 rounded-xl bg-emerald-600 text-white font-bold text-lg uppercase tracking-widest shadow-lg hover:bg-emerald-500 hover:scale-105 transition-all"
                            >
                                Start Building
                            </button>
                            <button
                                onClick={() => router.push('/community')}
                                className="w-full py-3 rounded-xl bg-white/40 text-emerald-900 font-bold text-lg uppercase tracking-widest hover:bg-white/60 transition-all border border-white/20"
                            >
                                Community Hub
                            </button>
                        </div>
                    </div>

                    {/* Placeholder for My Lineups or Other stats */}
                    <div className="glass-panel p-6 rounded-3xl">
                        <h3 className="font-bold text-emerald-900 mb-2">Your Stats</h3>
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="bg-white/20 rounded-xl p-4">
                                <div className="text-2xl font-black text-emerald-800">0</div>
                                <div className="text-xs font-bold text-emerald-900/60 uppercase">Lineups</div>
                            </div>
                            <div className="bg-white/20 rounded-xl p-4">
                                <div className="text-2xl font-black text-emerald-800">-</div>
                                <div className="text-xs font-bold text-emerald-900/60 uppercase">Win Rate</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Information Hub */}
                <div className="lg:col-span-8">
                    <DashboardStandings />
                    <DashboardFixtures />
                </div>
            </main>
        </div>
    );
}

// Minimal placeholder for the sub-components to avoid build errors if not imported yet
import DashboardStandings from '@/components/dashboard/DashboardStandings';
import DashboardFixtures from '@/components/dashboard/DashboardFixtures';
