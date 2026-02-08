'use client';

import React, { useEffect } from 'react';
import LineupBuilder from '@/features/lineup/components/LineupBuilder';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { useQuery } from '@tanstack/react-query';
import { useLineupStore } from '@/features/lineup/stores/useLineupStore';
import { Player, Team } from '@/types';

async function fetchTeamPlayers(teamId: string) {
    const res = await fetch(`/api/teams/${teamId}/players`);
    if (!res.ok) throw new Error('Failed to fetch players');
    const json = await res.json();
    return json.data as Player[];
}

async function fetchTeam(teamId: string) {
    const res = await fetch(`/api/teams/${teamId}`);
    if (!res.ok) throw new Error('Failed to fetch team');
    const json = await res.json();
    return json.data as Team;
}

export default function TeamLineupPage({ params }: { params: Promise<{ teamId: string }> }) {
    // Unwrap params correctly for Next.js 15+
    const { teamId } = React.use(params);

    const { setSquad, setSelectedTeamId } = useLineupStore();

    const { data: players, isLoading: isPlayersLoading } = useQuery({
        queryKey: ['team-players', teamId],
        queryFn: () => fetchTeamPlayers(teamId),
        enabled: !!teamId,
    });

    const { data: team, isLoading: isTeamLoading } = useQuery({
        queryKey: ['team', teamId],
        queryFn: () => fetchTeam(teamId),
        enabled: !!teamId,
    });

    const isLoading = isPlayersLoading || isTeamLoading;

    // Valid approach: Sync server/query state to store
    useEffect(() => {
        if (teamId) {
            setSelectedTeamId(teamId);
        }
    }, [teamId, setSelectedTeamId]);

    useEffect(() => {
        if (players) {
            setSquad(players);
        }
    }, [players, setSquad]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-2xl font-bold text-emerald-800 animate-pulse">Loading Squad...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 md:p-8 relative">
            <div className="absolute top-4 left-4 md:top-8 md:left-8 z-10">
                <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 text-emerald-900 font-bold transition-all backdrop-blur-sm shadow-sm border border-white/20">
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span>Dashboard</span>
                </Link>
            </div>

            <div className="max-w-7xl mx-auto">
                <header className="mb-8 text-center pt-16 md:pt-0 flex flex-col items-center">
                    {team && (
                        <div className="flex flex-col items-center gap-4 mb-4 animate-in fade-in zoom-in duration-500">
                            <div className="relative">
                                <img
                                    src={team.logo}
                                    alt={team.name}
                                    className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-2xl"
                                />
                                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                                    {team.league}
                                </div>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-emerald-900 uppercase tracking-tighter drop-shadow-sm">
                                {team.name}
                            </h1>
                        </div>
                    )}
                    <p className="text-emerald-800 font-medium text-lg">
                        Drag and drop to create your winning formation
                    </p>
                </header>

                <LineupBuilder />
            </div>
        </div>
    );
}
