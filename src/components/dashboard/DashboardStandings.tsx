
'use client';

import { useQuery } from '@tanstack/react-query';

interface LeagueStanding {
    id: string;
    league: string;
    season: string;
    teamName: string;
    position: number;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    goalsFor: number;
    goalsAgainst: number;
    points: number;
    form: string | null;
}

async function fetchStandings() {
    const res = await fetch('/api/standings');
    if (!res.ok) throw new Error('Failed to fetch standings');
    const json = await res.json();
    return json.data as LeagueStanding[];
}

export default function DashboardStandings() {
    const { data: standings, isLoading } = useQuery({
        queryKey: ['standings'],
        queryFn: fetchStandings,
    });

    if (isLoading) {
        return (
            <div className="glass-panel p-6 rounded-3xl animate-pulse">
                <div className="h-8 bg-white/20 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-10 bg-white/10 rounded w-full"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="glass-panel p-6 rounded-3xl">
            <h2 className="text-2xl font-bold text-emerald-900 mb-4 px-2">League Table</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-emerald-800 uppercase border-b border-emerald-900/10">
                        <tr>
                            <th className="px-3 py-3 font-extrabold">Pos</th>
                            <th className="px-3 py-3 font-extrabold">Club</th>
                            <th className="px-3 py-3 font-extrabold text-center">P</th>
                            <th className="px-3 py-3 font-extrabold text-center">W</th>
                            <th className="px-3 py-3 font-extrabold text-center">D</th>
                            <th className="px-3 py-3 font-extrabold text-center">L</th>
                            <th className="px-3 py-3 font-extrabold text-center">GD</th>
                            <th className="px-3 py-3 font-extrabold text-center">Pts</th>
                            <th className="px-3 py-3 font-extrabold hidden md:table-cell">Form</th>
                        </tr>
                    </thead>
                    <tbody>
                        {standings?.map((team) => (
                            <tr
                                key={team.id}
                                className="border-b border-white/10 hover:bg-white/10 transition-colors"
                            >
                                <td className="px-3 py-3 font-bold">
                                    <span className={`
                        w-6 h-6 flex items-center justify-center rounded-full text-xs
                        ${team.position <= 4 ? 'bg-emerald-500 text-white' :
                                            team.position >= 18 ? 'bg-red-500 text-white' : 'text-emerald-900'}
                    `}>
                                        {team.position}
                                    </span>
                                </td>
                                <td className="px-3 py-3 font-bold text-emerald-900">{team.teamName}</td>
                                <td className="px-3 py-3 text-center">{team.played}</td>
                                <td className="px-3 py-3 text-center">{team.won}</td>
                                <td className="px-3 py-3 text-center">{team.drawn}</td>
                                <td className="px-3 py-3 text-center">{team.lost}</td>
                                <td className="px-3 py-3 text-center">{team.goalsFor - team.goalsAgainst}</td>
                                <td className="px-3 py-3 text-center font-black text-emerald-900">{team.points}</td>
                                <td className="px-3 py-3 hidden md:table-cell">
                                    <div className="flex gap-1">
                                        {team.form?.split(',').map((result, i) => (
                                            <span
                                                key={i}
                                                className={`
                                    w-5 h-5 flex items-center justify-center rounded text-[10px] font-bold text-white
                                    ${result === 'W' ? 'bg-green-500' : result === 'D' ? 'bg-gray-400' : 'bg-red-500'}
                                `}
                                            >
                                                {result}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
