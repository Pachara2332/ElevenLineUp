import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { StaticPitch } from "@/components/lineup/StaticPitch";
import { ShareButton } from "@/components/lineup/ShareButton";
import Link from "next/link";
import { Metadata } from "next";

interface LineupPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: LineupPageProps): Promise<Metadata> {
    const { slug } = await params;

    const lineup = await prisma.lineup.findUnique({
        where: { slug },
        include: {
            team: { select: { name: true } },
            user: { select: { name: true, username: true } },
            slots: true,
        },
    });

    if (!lineup) return {};

    const playerNames = lineup.slots
        .map(s => s.playerName)
        .filter(Boolean)
        .slice(0, 3)
        .join(", ");

    const title = `${lineup.team?.name || lineup.name} ${lineup.formation} Lineup`;
    const description = `Check out this ${lineup.formation} lineup featuring ${playerNames}${playerNames ? " and more" : ""
        }, created by ${lineup.user.name}.`;

    return {
        title,
        description,
        keywords: [`${lineup.team?.name || lineup.name} ${lineup.formation} lineup`, `Best ${lineup.team?.name || 'Football'} XI`, `Premier League ${lineup.formation}`],
        openGraph: {
            title,
            description,
            images: [
                {
                    url: `/api/og/lineup/${lineup.slug}`,
                    width: 1200,
                    height: 630,
                    alt: `${lineup.name} Lineup Image`,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [`/api/og/lineup/${lineup.slug}`],
        },
    };
}

export default async function PublicLineupPage({ params }: LineupPageProps) {
    const { slug } = await params;

    const lineup = await prisma.lineup.findUnique({
        where: { slug },
        include: {
            slots: true,
            team: true,
            user: {
                select: {
                    name: true,
                    username: true,
                    avatar: true,
                    userId: true,
                },
            },
            _count: {
                select: { likes: true },
            },
        },
    });

    if (!lineup) {
        notFound();
    }

    const isPublic = lineup.isPublic;

    if (!isPublic) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
                <div className="text-center space-y-4">
                    <div className="text-4xl">🔒</div>
                    <h1 className="text-2xl font-bold text-white">Private Lineup</h1>
                    <p className="text-slate-400">This lineup is set to private by its creator.</p>
                    <Link href="/" className="inline-block px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-500 transition">
                        Go Home
                    </Link>
                </div>
            </div>
        );
    }

    // Pre-sort slots for consistent rendering
    const sortedSlots = [...lineup.slots].sort((a, b) => {
        // Basic y-axis sort to place GK first, attackers last
        return b.y - a.y;
    });

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            {/* Header section */}
            <div className="bg-slate-900 border-b border-slate-800 pt-20 pb-10 px-4">
                <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-6">

                    <div className="flex items-center gap-4">
                        {lineup.team && (
                            <img
                                src={lineup.team.logo}
                                alt={lineup.team.name}
                                className="w-16 h-16 rounded-full bg-white p-1"
                            />
                        )}
                        <div className="text-left">
                            <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                                {lineup.name}
                            </h1>
                            <div className="flex items-center gap-3 mt-2 text-slate-300">
                                <span className="bg-emerald-500/20 text-emerald-400 font-mono px-3 py-1 rounded-full text-sm font-bold border border-emerald-500/30">
                                    {lineup.formation}
                                </span>
                                <span className="text-sm font-medium">
                                    {lineup.team?.name}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 bg-slate-800/50 px-4 py-2 rounded-2xl border border-slate-700/50">
                        {lineup.user.avatar ? (
                            <img src={lineup.user.avatar} className="w-8 h-8 rounded-full border border-slate-600" alt={lineup.user.name} />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-sm">
                                {lineup.user.name.charAt(0)}
                            </div>
                        )}
                        <div className="text-sm">
                            <span className="text-slate-400">Created by </span>
                            <Link
                                href={`/u/${lineup.user.username || lineup.user.userId}`}
                                className="font-bold text-white hover:text-emerald-400 transition"
                            >
                                {lineup.user.name}
                            </Link>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-slate-600 mx-2" />
                        <div className="flex items-center gap-1 text-pink-400">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                            <span className="font-bold">{lineup._count.likes}</span>
                        </div>
                    </div>

                </div>
            </div>

            {/* Pitch section */}
            <div className="max-w-4xl mx-auto px-4 py-12">
                <StaticPitch slots={sortedSlots} />

                {/* Action Buttons */}
                <div className="mt-12 flex justify-center gap-4">
                    <Link
                        href="/dashboard/lineup-builder"
                        className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 transition shadow-lg shadow-emerald-500/20 active:scale-95"
                    >
                        Create Your Own
                    </Link>
                    <ShareButton />
                </div>
            </div>

        </div>
    );
}
