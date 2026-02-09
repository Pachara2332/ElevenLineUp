
'use client';

import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

interface Fixture {
    id: string;
    league: string;
    season: string;
    homeTeam: string;
    awayTeam: string;
    kickoff: string;
    status: string;
}

async function fetchFixtures() {
    const res = await fetch('/api/fixtures');
    if (!res.ok) throw new Error('Failed to fetch fixtures');
    const json = await res.json();
    return json.data as Fixture[];
}

export default function DashboardFixtures() {
    const { data: fixtures, isLoading } = useQuery({
        queryKey: ['fixtures'],
        queryFn: fetchFixtures,
    });

    if (isLoading) {
        return (
            <div className="glass-panel p-6 rounded-3xl animate-pulse mt-6">
                <div className="h-8 bg-white/20 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-16 bg-white/10 rounded w-full"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="glass-panel p-6 rounded-3xl mt-6">
            <h2 className="text-2xl font-bold text-emerald-900 mb-4 px-2">Upcoming Fixtures</h2>
            <div className="space-y-3">
                {fixtures?.map((fixture) => (
                    <div
                        key={fixture.id}
                        className="bg-white/20 p-4 rounded-xl flex items-center justify-between hover:bg-white/30 transition-all border border-white/10"
                    >
                        <div className="flex-1 text-right font-bold text-emerald-900 text-sm md:text-base">
                            {fixture.homeTeam}
                        </div>

                        <div className="px-4 flex flex-col items-center">
                            <span className="text-xs font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full mb-1">
                                VS
                            </span>
                            <span className="text-xs text-emerald-800 font-semibold">
                                {format(new Date(fixture.kickoff), 'EEE d MMM, HH:mm')}
                            </span>
                        </div>

                        <div className="flex-1 text-left font-bold text-emerald-900 text-sm md:text-base">
                            {fixture.awayTeam}
                        </div>
                    </div>
                ))}
                {fixtures?.length === 0 && (
                    <div className="text-center text-emerald-800 py-4">No upcoming fixtures scheduled.</div>
                )}
            </div>
        </div>
    );
}
