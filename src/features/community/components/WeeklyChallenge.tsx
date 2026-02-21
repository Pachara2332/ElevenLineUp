'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function WeeklyChallenge() {
    const { user } = useAuth();
    const [challengeData, setChallengeData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Mock Fantasy Draft Selection
    const [selectedPlayers, setSelectedPlayers] = useState<any[]>([]);
    const [budgetUsed, setBudgetUsed] = useState(0);

    useEffect(() => {
        if (!user) return;
        fetch('/api/community/challenge')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setChallengeData(data);
                }
            })
            .finally(() => setLoading(false));
    }, [user]);

    const handleMockDraft = () => {
        // Draft a set of mock players to demonstrate UI functionality within budget.
        const mockPicks = [
            { id: '1', position: 'FW', name: 'Saka', cost: 10 },
            { id: '2', position: 'FW', name: 'Haaland', cost: 15 },
            { id: '3', position: 'FW', name: 'Salah', cost: 12 },
            { id: '4', position: 'MF', name: 'Odegaard', cost: 9 },
            { id: '5', position: 'MF', name: 'Rodri', cost: 8 },
            { id: '6', position: 'MF', name: 'Palmer', cost: 9 },
            { id: '7', position: 'DF', name: 'Saliba', cost: 6 },
            { id: '8', position: 'DF', name: 'Dias', cost: 6 },
            { id: '9', position: 'DF', name: 'Van Dijk', cost: 7 },
            { id: '10', position: 'DF', name: 'Trent A.', cost: 8 },
            { id: '11', position: 'GK', name: 'Alisson', cost: 6 }
        ];

        setSelectedPlayers(mockPicks);
        setBudgetUsed(mockPicks.reduce((acc, curr) => acc + curr.cost, 0));
    };

    const submitEntry = async () => {
        if (!challengeData?.challenge || selectedPlayers.length !== 11) return;

        try {
            const payload = {
                challengeId: challengeData.challenge.id,
                formation: '4-3-3',
                players: selectedPlayers
            };

            const res = await fetch('/api/community/challenge', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await res.json();
            if (result.success) {
                alert('Lineup submitted successfully!');
                // refresh or optimistically update state
                setChallengeData((prev: any) => ({
                    ...prev,
                    myEntry: result.entry
                }));
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error('Failed to submit entry', error);
        }
    };

    if (!user) return null;
    if (loading) return <div className="p-8 text-center animate-pulse">Loading Weekly Challenge...</div>;

    if (!challengeData?.challenge) {
        return (
            <div className="bg-white rounded-3xl p-8 text-center shadow-lg border border-emerald-100">
                <h2 className="text-2xl font-black text-emerald-900 mb-2">Weekly Lineup Challenge</h2>
                <p className="text-gray-500">There is no active challenge this week. Check back soon!</p>
            </div>
        );
    }

    const maxBudget = challengeData.challenge.budget;
    const isOverBudget = budgetUsed > maxBudget;
    const { myEntry, leaderboard } = challengeData;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Draft UI */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-xl border border-emerald-100">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-3xl font-black text-emerald-900 tracking-tighter uppercase">Week {challengeData.challenge.week} Challenge</h2>
                        <p className="text-emerald-700 font-bold mt-1">Draft your ultimate 11 for the upcoming fixtures.</p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Budget Remaining</div>
                        <div className={`text-4xl font-black ${isOverBudget ? 'text-red-500' : 'text-emerald-500'}`}>
                            {maxBudget - budgetUsed}M
                        </div>
                    </div>
                </div>

                {myEntry ? (
                    <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200">
                        <h3 className="font-bold text-emerald-900 mb-2">Your Lineup is locked in! 🔒</h3>
                        <p className="text-emerald-700">You have earned <strong className="text-2xl">{myEntry.totalPoints}</strong> points so far this week.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 min-h-[300px] flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-emerald-900/5 opacity-[0.03]" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%2310b981\\' fill-opacity=\\'0.4\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}></div>

                            {selectedPlayers.length === 11 ? (
                                <div className="relative z-10 w-full">
                                    <h4 className="text-center font-bold text-emerald-900 mb-4 uppercase text-sm tracking-widest">Your Picks (4-3-3)</h4>
                                    <div className="grid grid-cols-4 gap-2">
                                        {selectedPlayers.map(p => (
                                            <div key={p.id} className="bg-white p-2 rounded-lg shadow-sm border border-emerald-100 flex flex-col items-center">
                                                <span className="text-[10px] font-bold text-emerald-500">{p.position}</span>
                                                <span className="font-bold text-xs text-gray-800 truncate w-full text-center">{p.name}</span>
                                                <span className="text-xs font-bold text-gray-400 mt-1">{p.cost}M</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="relative z-10 text-center">
                                    <p className="text-gray-400 font-bold mb-4">You have selected {selectedPlayers.length}/11 players.</p>
                                    <button onClick={handleMockDraft} className="px-6 py-2 bg-emerald-100 text-emerald-700 font-bold rounded-full hover:bg-emerald-200 transition-colors">
                                        Auto-Draft (Mock)
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3">
                            {selectedPlayers.length === 11 && (
                                <button
                                    onClick={() => { setSelectedPlayers([]); setBudgetUsed(0); }}
                                    className="px-6 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition"
                                >
                                    Clear
                                </button>
                            )}
                            <button
                                disabled={selectedPlayers.length !== 11 || isOverBudget}
                                onClick={submitEntry}
                                className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold rounded-xl hover:opacity-90 shadow-lg shadow-emerald-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Submit Lineup
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Leaderboard */}
            <div className="bg-emerald-900 rounded-3xl p-6 shadow-xl text-white">
                <h3 className="text-xl font-black uppercase tracking-wider mb-6 flex items-center gap-2">
                    <span className="text-2xl">🏆</span> Leaderboard
                </h3>

                {leaderboard?.length === 0 ? (
                    <p className="text-emerald-200/50 text-sm text-center py-8">No entries yet. Be the first to draft!</p>
                ) : (
                    <div className="space-y-3">
                        {leaderboard.map((entry: any, i: number) => (
                            <div key={entry.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition">
                                <span className={`font-black w-6 text-center ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-amber-600' : 'text-emerald-500'}`}>
                                    {i + 1}
                                </span>
                                <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
                                    {entry.user.avatar ? (
                                        <img src={entry.user.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        entry.user.name.charAt(0)
                                    )}
                                </div>
                                <span className="font-bold flex-1 truncate">{entry.user.name}</span>
                                <span className="font-black text-emerald-300 bg-emerald-950 px-3 py-1 rounded-full text-xs">
                                    {entry.totalPoints} pts
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
