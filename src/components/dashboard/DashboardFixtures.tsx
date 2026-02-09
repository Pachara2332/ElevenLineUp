'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useState } from 'react';
// Since user might not have shadcn/ui dialog, I'll build a custom simple modal to be safe and dependency-free for this step

interface Fixture {
    id: string;
    league: string;
    season: string;
    homeTeam: string;
    awayTeam: string;
    kickoff: string;
    status: string;
}

interface Prediction {
    fixtureId: string;
    predictedHome: number;
    predictedAway: number;
}

async function fetchFixtures() {
    const res = await fetch('/api/fixtures');
    if (!res.ok) throw new Error('Failed to fetch fixtures');
    const json = await res.json();
    return json.data as Fixture[];
}

async function fetchMyPredictions() {
    const res = await fetch('/api/predictions');
    if (!res.ok) return [];
    const json = await res.json();
    return json.data as Prediction[];
}

export default function DashboardFixtures() {
    const queryClient = useQueryClient();
    const { data: fixtures, isLoading } = useQuery({
        queryKey: ['fixtures'],
        queryFn: fetchFixtures,
    });

    const { data: myPredictions } = useQuery({
        queryKey: ['myPredictions'],
        queryFn: fetchMyPredictions
    });

    const [selectedFixture, setSelectedFixture] = useState<Fixture | null>(null);
    const [homeScore, setHomeScore] = useState('');
    const [awayScore, setAwayScore] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const predictMutation = useMutation({
        mutationFn: async () => {
            const res = await fetch('/api/predictions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fixtureId: selectedFixture?.id,
                    homeScore: parseInt(homeScore),
                    awayScore: parseInt(awayScore)
                })
            });
            if (!res.ok) throw new Error('Failed to predict');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myPredictions'] });
            closeModal();
        },
        onError: (err) => {
            alert('Failed to submit prediction. Match might have started.');
        }
    });

    const openModal = (fixture: Fixture) => {
        const existing = myPredictions?.find((p: any) => p.fixtureId === fixture.id);
        if (existing) {
            setHomeScore(existing.predictedHome.toString());
            setAwayScore(existing.predictedAway.toString());
        } else {
            setHomeScore('');
            setAwayScore('');
        }
        setSelectedFixture(fixture);
    };

    const closeModal = () => {
        setSelectedFixture(null);
        setHomeScore('');
        setAwayScore('');
    };

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
        <div className="glass-panel p-6 rounded-3xl mt-6 relative">
            <h2 className="text-2xl font-bold text-emerald-900 mb-4 px-2">Upcoming Fixtures</h2>
            <div className="space-y-3">
                {fixtures?.map((fixture) => {
                    const prediction = myPredictions?.find((p: any) => p.fixtureId === fixture.id);
                    const isPredicted = !!prediction;

                    return (
                        <div
                            key={fixture.id}
                            onClick={() => openModal(fixture)}
                            className="group bg-white/20 p-4 rounded-xl flex items-center justify-between hover:bg-white/30 transition-all border border-white/10 cursor-pointer"
                        >
                            <div className="flex-1 text-right font-bold text-emerald-900 text-sm md:text-base">
                                {fixture.homeTeam}
                            </div>

                            <div className="px-4 flex flex-col items-center min-w-[100px]">
                                {isPredicted ? (
                                    <div className="bg-emerald-100/50 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold mb-1 border border-emerald-200">
                                        {prediction.predictedHome} - {prediction.predictedAway}
                                    </div>
                                ) : (
                                    <span className="text-xs font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full mb-1 group-hover:scale-110 transition-transform">
                                        Predict
                                    </span>
                                )}
                                <span className="text-xs text-emerald-800 font-semibold">
                                    {format(new Date(fixture.kickoff), 'EEE d MMM, HH:mm')}
                                </span>
                            </div>

                            <div className="flex-1 text-left font-bold text-emerald-900 text-sm md:text-base">
                                {fixture.awayTeam}
                            </div>
                        </div>
                    )
                })}
                {fixtures?.length === 0 && (
                    <div className="text-center text-emerald-800 py-4">No upcoming fixtures scheduled.</div>
                )}
            </div>

            {/* Simple Modal */}
            {selectedFixture && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200">
                        <h3 className="text-xl font-bold text-emerald-900 text-center mb-2">Predict Score</h3>
                        <p className="text-center text-emerald-600 mb-6 text-sm">
                            {selectedFixture.homeTeam} vs {selectedFixture.awayTeam}
                        </p>

                        <div className="flex justify-center items-center gap-4 mb-8">
                            <div className="text-center">
                                <label className="block text-xs font-bold text-emerald-800 mb-1">{selectedFixture.homeTeam}</label>
                                <input
                                    type="number"
                                    value={homeScore}
                                    onChange={(e) => setHomeScore(e.target.value)}
                                    className="w-16 h-16 text-center text-2xl font-black bg-emerald-50 border-2 border-emerald-100 rounded-xl focus:outline-none focus:border-emerald-500 text-emerald-900"
                                />
                            </div>
                            <span className="text-2xl font-black text-emerald-300">-</span>
                            <div className="text-center">
                                <label className="block text-xs font-bold text-emerald-800 mb-1">{selectedFixture.awayTeam}</label>
                                <input
                                    type="number"
                                    value={awayScore}
                                    onChange={(e) => setAwayScore(e.target.value)}
                                    className="w-16 h-16 text-center text-2xl font-black bg-emerald-50 border-2 border-emerald-100 rounded-xl focus:outline-none focus:border-emerald-500 text-emerald-900"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={closeModal}
                                className="flex-1 py-3 px-4 rounded-xl font-bold text-emerald-700 hover:bg-emerald-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => predictMutation.mutate()}
                                disabled={!homeScore || !awayScore || predictMutation.isPending}
                                className="flex-1 py-3 px-4 rounded-xl font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {predictMutation.isPending ? 'Saving...' : 'Submit'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
