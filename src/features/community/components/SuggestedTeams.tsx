'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';

type SuggestedTeam = {
    id: string;
    name: string;
    logo: string;
    isFollowing: boolean;
};

export default function SuggestedTeams() {
    const { user } = useAuth();
    const [teams, setTeams] = useState<SuggestedTeam[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        const fetchTeams = async () => {
            try {
                const res = await fetch('/api/community/teams/suggested');
                const data = await res.json();
                if (data.success) {
                    setTeams(data.data?.teams ?? []);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTeams();
    }, [user]);

    const toggleFollow = async (teamId: string, currentStatus: boolean) => {
        // Optimistic UI update
        setTeams(teams.map(t => t.id === teamId ? { ...t, isFollowing: !currentStatus } : t));

        try {
            await fetch(`/api/teams/${teamId}/follow`, { method: 'POST' });
            // We don't need to do anything else, optimistic update handles it
        } catch (err) {
            // Revert on failure
            setTeams(teams.map(t => t.id === teamId ? { ...t, isFollowing: currentStatus } : t));
            console.error(err);
        }
    };

    if (!user || loading || !teams || teams.length === 0) return null;

    return (
        <div className="glass-panel rounded-3xl p-6 hidden lg:block sticky top-8">
            <h3 className="text-lg font-black text-emerald-900 mb-4 uppercase tracking-tighter">
                Suggested Teams
            </h3>
            <div className="space-y-4">
                {teams.map(team => (
                    <div key={team.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img src={team.logo} alt={team.name} className="w-10 h-10 object-contain drop-shadow-sm" />
                            <p className="font-bold text-emerald-800 text-sm">{team.name}</p>
                        </div>
                        <button
                            onClick={() => toggleFollow(team.id, team.isFollowing)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${team.isFollowing
                                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:scale-105'
                                }`}
                        >
                            {team.isFollowing ? 'Following' : 'Follow'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
