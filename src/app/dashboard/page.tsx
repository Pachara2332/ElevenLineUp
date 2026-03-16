'use client';
import { useState, useEffect } from 'react'
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';
import DashboardStandings from '@/components/dashboard/DashboardStandings';
import DashboardFixtures from '@/components/dashboard/DashboardFixtures';
import { 
  PuzzlePieceIcon, 
  UserGroupIcon, 
  TrophyIcon,
  BoltIcon,
  RectangleGroupIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
    const { user, isLoading, isAuthenticated } = useAuth();
    const router = useRouter();
    const [userStats, setUserStats] = useState({
        lineupsCount: 0,
        winRate: 0,
        xp: 0,
        badges: [] as string[]
    })

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isLoading, isAuthenticated, router]);

    const fetchUserStats = async () => {
        try {
            const res = await fetch('/api/user/stats')
            if (res.ok) {
                const data = await res.json()
                setUserStats({
                    lineupsCount: data.data.lineupsCount || 0,
                    winRate: calculateWinRate(data.data.gameStats) || 0,
                    xp: data.data.xp || 0,
                    badges: data.data.badges || []
                })
            }
        } catch (error) {
            console.error('Failed to fetch user stats:', error)
        }
    }

    const calculateWinRate = (gameStats: Record<string, { totalPlayed?: number; totalWins?: number }>) => {
        if (!gameStats || Object.keys(gameStats).length === 0) return 0

        let totalPlayed = 0
        let totalWins = 0

        Object.values(gameStats).forEach((stat) => {
            totalPlayed += stat.totalPlayed || 0
            totalWins += stat.totalWins || 0
        })

        if (totalPlayed === 0) return 0
        return Math.round((totalWins / totalPlayed) * 100)
    }

    useEffect(() => {
        if (user) {
            fetchUserStats()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    if (isLoading) {
        return <div className="text-emerald-900 text-2xl font-bold animate-pulse text-center mt-20">Loading Dashboard...</div>;
    }

    if (!user) return null;

    return (
        <div className="p-4 md:p-8">
            <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Actions & Stats */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Create Lineup Card */}
                    <div className="glass-panel p-8 text-center relative overflow-hidden group rounded-xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                        
                        <h2 className="text-2xl font-bold text-slate-900 mb-2 relative z-10">Manager Center</h2>
                        <p className="text-slate-500 mb-8 text-sm font-medium relative z-10">Command your squad and lead them to glory.</p>

                        <div className="flex flex-col gap-3 relative z-10">
                            <button
                                onClick={() => router.push('/dashboard/create')}
                                className="w-full py-4 rounded-xl bg-emerald-600 text-white font-bold text-sm uppercase tracking-widest shadow-lg hover:bg-emerald-700 hover:-translate-y-0.5 transition-all outline-none ring-offset-2 focus:ring-2 focus:ring-emerald-500"
                            >
                                Start Building
                            </button>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => router.push('/community')}
                                    className="py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider hover:bg-slate-200 transition-all border border-slate-200 flex items-center justify-center gap-2"
                                >
                                    <UserGroupIcon className="w-4 h-4" /> Community
                                </button>
                                <button
                                    onClick={() => router.push('/minigames/quiz-hub')}
                                    className="py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider hover:bg-slate-200 transition-all border border-slate-200 flex items-center justify-center gap-2"
                                >
                                    <PuzzlePieceIcon className="w-4 h-4 text-emerald-600" /> Games
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Your Stats */}
                    <div className="glass-panel p-6 rounded-xl">
                        <div className="flex justify-between items-center mb-6">
                           <h3 className="font-bold text-slate-900 uppercase tracking-widest text-[10px] flex items-center gap-2">
                               <TrophyIcon className="w-3 h-3 text-emerald-600" /> Your Stats
                           </h3>
                           <div className="px-2 py-1 rounded bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase">
                               Lvl {Math.floor(userStats.xp / 100) + 1}
                           </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100 shadow-sm transition hover:shadow-md flex flex-col items-center">
                                <div className="p-1.5 bg-blue-50 rounded-lg mb-2">
                                    <BoltIcon className="w-4 h-4 text-blue-600" />
                                </div>
                                <div className="text-base font-black text-slate-900">
                                    {userStats.xp}
                                </div>
                                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">XP</div>
                            </div>
                            <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100 shadow-sm transition hover:shadow-md flex flex-col items-center">
                                <div className="p-1.5 bg-emerald-50 rounded-lg mb-2">
                                    <RectangleGroupIcon className="w-4 h-4 text-emerald-600" />
                                </div>
                                <div className="text-base font-black text-slate-900">
                                    {userStats.lineupsCount}
                                </div>
                                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Squads</div>
                            </div>
                            <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100 shadow-sm transition hover:shadow-md flex flex-col items-center">
                                <div className="p-1.5 bg-orange-50 rounded-lg mb-2">
                                    <ChartBarIcon className="w-4 h-4 text-orange-600" />
                                </div>
                                <div className="text-base font-black text-slate-900">
                                    {userStats.winRate}%
                                </div>
                                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Wins</div>
                            </div>
                        </div>

                        {userStats.badges && userStats.badges.length > 0 && (
                            <div className="mt-6 pt-6 border-t border-slate-100">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Recent Badges</div>
                                <div className="flex flex-wrap gap-2">
                                    {userStats.badges.slice(0, 3).map((badge, idx) => (
                                        <div key={idx} className="bg-white text-slate-700 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm flex items-center gap-1.5">
                                            <span className="text-xs">🎖️</span> {badge}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Information Hub */}
                <div className="lg:col-span-8 space-y-8">
                    <DashboardStandings />
                    <DashboardFixtures />
                </div>
            </main>
        </div>
    );
}