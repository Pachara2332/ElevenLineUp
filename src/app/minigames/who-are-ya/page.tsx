'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

export default function WhoAreYaPage() {
    const router = useRouter();
    const { data: game, isLoading } = useQuery({
        queryKey: ['who-are-ya'],
        queryFn: async () => {
            const res = await fetch('/api/minigames/who-are-ya');
            if (!res.ok) throw new Error('No game');
            return (await res.json()).data;
        }
    });

    const [attempts, setAttempts] = useState(0);
    const [solved, setSolved] = useState(false);
    const [blurLevel, setBlurLevel] = useState(20); // Initial blur
    const [guessInput, setGuessInput] = useState('');
    const [feedback, setFeedback] = useState('');

    const submitGuess = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!guessInput.trim()) return;

        const res = await fetch('/api/minigames/who-are-ya', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                gameId: game.id,
                guess: guessInput
            })
        });
        const json = await res.json();

        if (json.correct) {
            setSolved(true);
            setBlurLevel(0);
            setFeedback(`Correct! It was ${json.playerName}`);
        } else {
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);
            setFeedback('Incorrect! Try again.');
            setGuessInput('');
            // Reduce blur
            setBlurLevel(Math.max(0, 20 - (newAttempts * 2.5)));

            if (newAttempts >= 8) {
                setFeedback('Game Over! Run out of attempts.');
                setBlurLevel(0); // Reveal on fail
            }
        }
    };

    if (isLoading) return <div className="text-white text-center mt-20">Loading Mystery Player...</div>;
    if (!game) return <div className="text-white text-center mt-20">No Game Today</div>;

    return (
        <div className="min-h-screen p-4 flex flex-col items-center">
            <header className="mb-6 w-full max-w-lg flex justify-between items-center text-white glass-panel p-4 rounded-2xl">
                <button onClick={() => router.back()} className="font-bold text-white/70 hover:text-white">← Back</button>
                <div className="font-black text-xl">WHO ARE YA?</div>
                <div className="text-sm font-bold bg-white/20 px-3 py-1 rounded-full">
                    {attempts}/8 Tries
                </div>
            </header>

            <div className="w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl">
                {/* Image Area */}
                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    <img
                        src={game.blurredImage}
                        className="w-full h-full object-cover transition-all duration-1000"
                        style={{ filter: `blur(${solved ? 0 : blurLevel}px)` }}
                        alt="Mystery Player"
                    />

                    {/* Overlay for "Solved" */}
                    {solved && (
                        <div className="absolute inset-x-0 bottom-0 bg-emerald-600/90 p-4 text-center backdrop-blur-sm animate-in slide-in-from-bottom">
                            <div className="text-white font-black text-2xl uppercase">Correct!</div>
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="p-6">
                    {feedback && (
                        <div className={clsx(
                            "mb-4 p-3 rounded-xl text-center font-bold text-sm",
                            solved ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                        )}>
                            {feedback}
                        </div>
                    )}

                    {!solved && attempts < 8 && (
                        <form onSubmit={submitGuess} className="flex gap-2">
                            <input
                                value={guessInput}
                                onChange={e => setGuessInput(e.target.value)}
                                className="flex-1 p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold text-lg outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-gray-900"
                                placeholder="Type player name..."
                                autoFocus
                            />
                            <button
                                type="submit"
                                className="bg-emerald-600 text-white font-black uppercase px-6 rounded-xl hover:bg-emerald-700 active:scale-95 transition-all shadow-lg shadow-emerald-200"
                            >
                                Guess
                            </button>
                        </form>
                    )}

                    {game.teamName && attempts > 4 && !solved && (
                        <div className="mt-4 text-center">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">HINT: TEAM</span>
                            <div className="font-bold text-gray-700">{game.teamName}</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
