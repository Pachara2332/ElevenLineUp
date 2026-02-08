'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLineupStore } from '@/features/lineup/stores/useLineupStore';
import clsx from 'clsx';
import { useQuery } from '@tanstack/react-query';
import { Team } from '@prisma/client';

async function fetchTeams() {
    const res = await fetch('/api/teams');
    if (!res.ok) throw new Error('Failed to fetch teams');
    const json = await res.json();
    return json.data as Team[];
}

export default function TeamSelection() {
    const router = useRouter();
    const { selectedTeamId, setSelectedTeamId } = useLineupStore();

    const [selectedLeague, setSelectedLeague] = useState('Premier League');
    const leagues = ['Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1'];

    const { data: teams, isLoading } = useQuery({
        queryKey: ['teams'],
        queryFn: fetchTeams,
    });

    const filteredTeams = teams?.filter(team => team.league === selectedLeague);

    const handleContinue = () => {
        if (selectedTeamId) {
            router.push(`/lineups/${selectedTeamId}`);
        }
    };

    if (isLoading) {
        return <div className="text-white text-2xl font-bold animate-pulse">Loading Teams...</div>;
    }

    return (
        <div className="w-full max-w-6xl mx-auto p-8 glass-panel rounded-[3rem] shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h1 className="text-5xl font-black text-center mb-4 text-emerald-900 uppercase tracking-tighter drop-shadow-sm">
                Select Your Club
            </h1>
            <p className="text-center text-emerald-800 mb-8 text-lg font-medium">Choose the badge you fight for</p>

            {/* League Tabs */}
            <div className="flex justify-center gap-3 mb-12 flex-wrap">
                {leagues.map(league => (
                    <button
                        key={league}
                        onClick={() => setSelectedLeague(league)}
                        className={clsx(
                            "px-6 py-2 rounded-full font-bold transition-all duration-300 uppercase tracking-widest text-sm",
                            selectedLeague === league
                                ? "bg-emerald-600 text-white shadow-lg scale-105"
                                : "bg-white/40 text-emerald-900 hover:bg-white/60"
                        )}
                    >
                        {league}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                {filteredTeams?.map((team) => (
                    <button
                        key={team.teamId}
                        onClick={() => setSelectedTeamId(team.teamId)}
                        className={clsx(
                            'p-6 rounded-2xl border-4 transition-all duration-300 flex flex-col items-center justify-center gap-4 aspect-square group',
                            selectedTeamId === team.teamId
                                ? 'border-white bg-white/40 scale-105 shadow-xl'
                                : 'border-transparent bg-white/10 hover:bg-white/20 hover:scale-105'
                        )}
                    >
                        <img
                            src={team.logo}
                            alt={team.name}
                            className="w-20 h-20 object-contain drop-shadow-md transition-transform group-hover:rotate-12 duration-300"
                        />
                        <span className={clsx(
                            "font-bold text-lg uppercase tracking-wider",
                            selectedTeamId === team.teamId ? "text-emerald-900" : "text-emerald-900/70"
                        )}>{team.name}</span>
                    </button>
                ))}
            </div>

            <div className="flex justify-center">
                <button
                    onClick={handleContinue}
                    disabled={!selectedTeamId}
                    className="px-12 py-4 rounded-full glass-button text-xl tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                    Start Building
                </button>
            </div>
        </div>
    );
}
