import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { BADGES } from "@/features/gamification/services/xp-service";
import { Metadata } from 'next';
import dynamic from "next/dynamic";

type Props = {
    params: { username: string };
};

const PublicProfileScene = dynamic(
    () => import("@/components/profile/PublicProfileScene"),
    { ssr: false }
);

// Phase G: SEO & Share Optimization
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const user = await prisma.user.findUnique({
        where: { username: params.username },
        select: { name: true, username: true, avatar: true }
    });

    if (!user) {
        return { title: 'User Not Found | ElevenLineUp' };
    }

    return {
        title: `${user.name} (@${user.username}) | ElevenLineUp`,
        description: `Check out ${user.name}'s football tactical profile, stats, and badges on ElevenLineUp.`,
        openGraph: {
            title: `${user.name} (@${user.username}) | ElevenLineUp`,
            description: `Check out ${user.name}'s football tactical profile, stats, and badges on ElevenLineUp.`,
            // Phase 2 OG Image placeholder
            // images: [`/api/og/profile/${user.username}`] 
        }
    };
}

export default async function PublicProfilePage({ params }: Props) {
    const { username } = params;

    const user = await prisma.user.findUnique({
        where: { username },
        include: {
            userStats: true,
            favoriteTeams: {
                include: { team: true }
            },
            quizAttempts: {
                orderBy: { createdAt: 'desc' },
                take: 3,
                include: { quiz: true }
            }
        }
    });

    if (!user) {
        notFound();
    }

    const stats = user.userStats || { xp: 0, streak: 0, predictionAccuracy: 0, totalQuizzes: 0, badges: [] };
    const highestBadge = stats.badges.length > 0 ? stats.badges[stats.badges.length - 1] : "First Team Squad";

    return (
        <div className="relative max-w-4xl mx-auto py-10 px-4 space-y-8 animate-in fade-in duration-500 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/70 via-white to-slate-100/70 -z-20" />
            <PublicProfileScene />
            {/* Header Section */}
            <div className="bg-white/80 dark:bg-gray-800/80 rounded-[2rem] p-8 shadow-xl backdrop-blur-md border border-emerald-100 dark:border-emerald-900/30 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>

                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-emerald-500 shadow-lg relative shrink-0 bg-slate-200">
                    {user.avatar ? (
                        <Image src={user.avatar} alt={user.name} fill className="object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl font-black text-slate-400">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>

                <div className="flex-1 text-center md:text-left z-10">
                    <h1 className="text-4xl font-black text-slate-800 dark:text-white mb-2">{user.name}</h1>
                    <p className="text-xl text-emerald-600 font-bold mb-4">@{user.username}</p>

                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full font-bold shadow-md">
                        <span>🏆</span> {highestBadge}
                    </div>

                    {stats.badges.length > 0 && (
                        <div className="mt-6 flex flex-wrap gap-2 justify-center md:justify-start">
                            {stats.badges.map((badge, idx) => (
                                <span key={idx} className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                    {badge}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-md border border-gray-100 dark:border-gray-700 text-center hover:-translate-y-1 transition-transform">
                    <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Total XP</div>
                    <div className="text-4xl font-black text-emerald-600">{stats.xp.toLocaleString()}</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-md border border-gray-100 dark:border-gray-700 text-center hover:-translate-y-1 transition-transform">
                    <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Current Streak</div>
                    <div className="text-4xl font-black text-orange-500 flex items-center justify-center gap-2">
                        {stats.streak} <span className="text-2xl">🔥</span>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-md border border-gray-100 dark:border-gray-700 text-center hover:-translate-y-1 transition-transform">
                    <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Prediction Acc.</div>
                    <div className="text-4xl font-black text-blue-500">{stats.predictionAccuracy}%</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Favorite Teams */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-md border border-gray-100 dark:border-gray-700">
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                        <span>🛡️</span> Favorite Teams
                    </h2>
                    {user.favoriteTeams.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4">
                            {user.favoriteTeams.map((ft) => (
                                <div key={ft.teamId} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                    <div className="w-12 h-12 relative rounded-full overflow-hidden bg-white p-1 shrink-0">
                                        <Image src={ft.team.logo} alt={ft.team.name} fill className="object-contain p-1" />
                                    </div>
                                    <span className="font-bold text-sm text-slate-700 dark:text-slate-300 line-clamp-2">{ft.team.name}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-8 bg-slate-50 dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                            <p className="text-slate-500 font-medium">This user hasn't selected any favorite teams yet.</p>
                        </div>
                    )}
                </div>

                {/* Recent Quiz Activity */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-md border border-gray-100 dark:border-gray-700">
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                        <span>🧠</span> Brain Games Activity
                    </h2>
                    {user.quizAttempts.length > 0 ? (
                        <div className="space-y-4">
                            {user.quizAttempts.map((attempt) => (
                                <div key={attempt.id} className="flex justify-between items-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-900">
                                    <div>
                                        <div className="font-bold text-slate-700 dark:text-slate-300">
                                            {attempt.quiz.type.replace('_', ' ')}
                                        </div>
                                        <div className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${attempt.quiz.difficulty === 'HARDCORE' ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                                {attempt.quiz.difficulty}
                                            </span>
                                            {new Date(attempt.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className={`font-black text-lg ${attempt.isCorrect ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        {attempt.isCorrect ? `+${attempt.xpEarned} XP` : 'Failed'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-8 bg-slate-50 dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                            <p className="text-slate-500 font-medium">No recent quiz activity.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
