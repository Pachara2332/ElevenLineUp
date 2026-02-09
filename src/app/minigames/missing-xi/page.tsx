'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

export default function MissingXIPage() {
    const router = useRouter();
    const { data: game, isLoading } = useQuery({
        queryKey: ['missing-xi'],
        queryFn: async () => {
            const res = await fetch('/api/minigames/missing-xi');
            if (!res.ok) throw new Error('No game');
            return (await res.json()).data;
        }
    });

    const [revealedPlayers, setRevealedPlayers] = useState<Record<number, any>>({}); // Key is index
    const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);

    const checkGuessMutation = useMutation({
        mutationFn: async (guess: string) => {
            const res = await fetch('/api/minigames/missing-xi', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    gameId: game.id,
                    guess
                })
            });
            return res.json();
        },
        onSuccess: (data) => {
            if (data.correct) {
                setRevealedPlayers(prev => ({
                    ...prev,
                    [data.index]: data.player
                }));
                setSelectedSlotIndex(null); // Close modal
            } else {
                alert("Incorrect guess!");
            }
        }
    });

    if (isLoading) return <div className="text-white text-center mt-20">Loading Lineup...</div>;
    if (!game) return <div className="text-white text-center mt-20">No Missing XI Game Today</div>;

    const allRevealed = game.players.every((p: any, idx: number) => !p.isMissing || revealedPlayers[idx]);

    return (
        <div className="min-h-screen p-4 flex flex-col items-center">
            <header className="mb-6 w-full max-w-4xl flex justify-between items-center text-white glass-panel p-4 rounded-2xl">
                <button onClick={() => router.back()} className="font-bold text-black/70 hover:text-black">← Back</button>
                <div className="text-center">
                    <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">MISSING XI</div>
                    <div className="text-xl md:text-2xl font-black">{game.teamName}</div>
                    <div className="text-xs text-black/60 font-mono mt-1">{game.formation}</div>
                </div>
                <div className="w-16"></div> {/* Spacer */}
            </header>

            {/* PITCH CONTAINER */}
            <div className="relative w-full max-w-md aspect-[3/4] bg-emerald-700 rounded-xl overflow-hidden shadow-2xl border-4 border-white/20">
                {/* Pitch Markings */}
                <div className="absolute inset-x-0 top-0 h-1/2 border-b border-white/20"></div>
                <div className="absolute inset-x-[20%] top-0 h-[15%] border-x border-b border-white/20"></div>
                <div className="absolute inset-x-[35%] top-0 h-[6%] border-x border-b border-white/20"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-white/20"></div>

                {/* Players */}
                {game.players.map((player: any, idx: number) => {
                    // Logic to check if this specific slot is revealed
                    const isRevealed = player.isRevealed || revealedPlayers[idx];
                    const isMissing = !isRevealed;

                    return (
                        <div
                            key={idx}
                            style={{
                                left: `${player.x}%`,
                                top: `${player.y}%`,
                                transform: 'translate(-50%, -50%)'
                            }}
                            className="absolute flex flex-col items-center group cursor-pointer"
                            onClick={() => isMissing && setSelectedSlotIndex(idx)}
                        >
                            <div className={clsx(
                                "w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold border-2 shadow-lg transition-transform hover:scale-110",
                                isMissing
                                    ? "bg-white text-emerald-900 border-emerald-900 blink-animation"
                                    : "bg-emerald-900 text-white border-white"
                            )}>
                                {isMissing ? (
                                    <span className="text-lg">?</span>
                                ) : (
                                    <span className="text-xs md:text-sm">{player.position}</span>
                                )}
                            </div>

                            <div className={clsx(
                                "mt-1 px-2 py-0.5 rounded text-[10px] md:text-xs font-bold whitespace-nowrap shadow-md",
                                isMissing ? "bg-white text-emerald-900" : "bg-black/50 text-white backdrop-blur-sm"
                            )}>
                                {isMissing ? "GUESS ME" : player.name}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Guess Modal */}
            {selectedSlotIndex !== null && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                        <h3 className="font-bold text-gray-900 text-center mb-4 text-lg">Who is missing?</h3>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const form = e.target as HTMLFormElement;
                                const input = form.elements.namedItem('guess') as HTMLInputElement;
                                checkGuessMutation.mutate(input.value);
                            }}
                            className="flex gap-2"
                        >
                            <input
                                name="guess"
                                autoFocus
                                className="flex-1 p-3 bg-gray-100 rounded-xl font-bold text-gray-900 outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="Type player name..."
                            />
                            <button
                                type="submit"
                                // disabled={checkGuessMutation.isLoading}
                                className="bg-emerald-600 text-white font-bold px-4 rounded-xl hover:bg-emerald-700"
                            >
                                Guess
                            </button>
                        </form>

                        <button onClick={() => setSelectedSlotIndex(null)} className="w-full mt-4 text-gray-500 font-bold text-sm">Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}
