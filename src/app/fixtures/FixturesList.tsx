'use client';
import { Fixture } from '@prisma/client';
import { useState } from 'react';
import LiveMatchThread from '@/features/match/components/LiveMatchThread';

export default function FixturesList({ fixtures }: { fixtures: Fixture[] }) {
    const [activeLiveMatch, setActiveLiveMatch] = useState<string | null>(null);

    if (fixtures.length === 0) {
        return (
            <div className="text-center p-12 bg-white/50 dark:bg-gray-800/50 rounded-3xl">
                <p className="text-gray-500 font-medium">No fixtures available at the moment.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fixtures.map((fixture) => {
                const dateObj = new Date(fixture.kickoff);
                const dateStr = dateObj.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
                const timeStr = dateObj.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
                const isLive = fixture.status === 'live';

                return (
                    <div
                        key={fixture.id}
                        className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border ${isLive ? 'border-red-400 cursor-pointer hover:border-red-500' : 'border-gray-100 dark:border-gray-700'
                            } hover:shadow-md transition-all relative overflow-hidden`}
                        onClick={() => isLive && setActiveLiveMatch(fixture.id)}
                    >
                        {isLive && (
                            <div className="absolute -top-6 -right-6 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center opacity-50 pointer-events-none">
                                <div className="w-8 h-8 bg-red-500 rounded-full animate-ping"></div>
                            </div>
                        )}
                        <div className="flex justify-between items-center mb-4 relative z-10">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{dateStr} • {timeStr}</span>
                            <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase ${fixture.status === 'live' ? 'bg-red-100 text-red-700 animate-pulse' :
                                fixture.status === 'finished' ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400' :
                                    'bg-emerald-100 text-emerald-700'
                                }`}>
                                {fixture.status}
                            </span>
                        </div>

                        <div className="space-y-4">
                            {/* Home Team */}
                            <div className="flex justify-between items-center">
                                <span className={`font-bold ${fixture.homeScore !== null && fixture.homeScore > (fixture.awayScore || 0) ? 'text-emerald-900 dark:text-emerald-400' : 'text-gray-800 dark:text-gray-200'}`}>
                                    {fixture.homeTeam}
                                </span>
                                <span className="text-xl font-black bg-gray-50 dark:bg-gray-900 w-10 h-10 flex items-center justify-center rounded-lg">
                                    {fixture.homeScore ?? '-'}
                                </span>
                            </div>

                            {/* Away Team */}
                            <div className="flex justify-between items-center">
                                <span className={`font-bold ${fixture.awayScore !== null && fixture.awayScore > (fixture.homeScore || 0) ? 'text-emerald-900 dark:text-emerald-400' : 'text-gray-800 dark:text-gray-200'}`}>
                                    {fixture.awayTeam}
                                </span>
                                <span className="text-xl font-black bg-gray-50 dark:bg-gray-900 w-10 h-10 flex items-center justify-center rounded-lg">
                                    {fixture.awayScore ?? '-'}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Modal for Live Match Thread */}
            {activeLiveMatch && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="w-full max-w-2xl bg-transparent flex flex-col items-center animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                        <div className="w-full text-right mb-2">
                            <button
                                onClick={() => setActiveLiveMatch(null)}
                                className="text-white bg-white/20 hover:bg-white/40 rounded-full p-2 px-6 font-bold transition-all w-fit self-end shadow-md hover:scale-105"
                            >
                                Close Chat
                            </button>
                        </div>
                        <div className="w-full shadow-2xl rounded-3xl overflow-hidden ring-4 ring-emerald-500/20">
                            <LiveMatchThread fixtureId={activeLiveMatch} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
