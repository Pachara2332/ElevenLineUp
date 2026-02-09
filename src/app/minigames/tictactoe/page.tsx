'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

export default function TicTacToePage() {
    const router = useRouter();
    const { data: game, isLoading } = useQuery({
        queryKey: ['tictactoe'],
        queryFn: async () => {
            const res = await fetch('/api/minigames/tictactoe');
            if (!res.ok) throw new Error('No game');
            return (await res.json()).data;
        }
    });

    const [gridState, setGridState] = useState<Record<string, { correct: boolean; player?: string }>>({});
    const [selectedCell, setSelectedCell] = useState<{ r: number, c: number } | null>(null);
    const [lives, setLives] = useState(9); // 9 squares to fill, but usually you get limited wrong attempts. Let's say 9 lives is generous.
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        if (lives <= 0) {
            setGameOver(true);
            alert('Game Over! Better luck next time.');
        }
    }, [lives]);

    if (isLoading) return <div className="text-white text-center mt-20 text-xl font-bold animate-pulse">Loading Grid...</div>;
    if (!game) return <div className="text-white text-center mt-20 text-xl font-bold">No Daily Game Available Today</div>;

    const isComplete = game.rows.length * game.cols.length === Object.keys(gridState).filter(k => gridState[k].correct).length;

    return (
        <div className="min-h-screen p-4 flex flex-col items-center bg-gray-900/50">
            <header className="mb-8 w-full max-w-2xl flex justify-between items-center text-white p-4 glass-panel rounded-2xl">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm font-bold text-white/70 hover:text-white transition-colors"
                >
                    ← Back
                </button>
                <div className="text-2xl font-black text-center">
                    <span className="text-emerald-400">FOOTBALL</span> GRID
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white/70">LIVES:</span>
                    <span className={clsx("font-black text-xl", lives < 3 ? "text-red-500" : "text-emerald-400")}>
                        {lives}
                    </span>
                </div>
            </header>

            {isComplete && (
                <div className="mb-6 w-full max-w-2xl bg-emerald-500/20 border border-emerald-500 p-4 rounded-xl text-center">
                    <div className="text-2xl font-black text-emerald-400 mb-1">🎉 GRID COMPLETE!</div>
                    <p className="text-white/80">You nailed it! Come back tomorrow for a new grid.</p>
                </div>
            )}

            {/* GRID CONTAINER */}
            <div className="grid grid-cols-4 gap-2 max-w-2xl w-full">
                {/* Top Left Empty Corner */}
                <div className="aspect-square"></div>

                {/* Column Headers */}
                {game.cols.map((col: any, i: number) => (
                    <div key={i} className="flex flex-col items-center justify-center bg-emerald-950/80 rounded-xl p-2 text-center border border-white/10 aspect-square">
                        {col.type === 'TEAM' && <div className="text-xs text-emerald-400 font-bold mb-1">TEAM</div>}
                        {col.type === 'NATION' && <div className="text-xs text-blue-400 font-bold mb-1">NATION</div>}
                        <div className="text-xs md:text-sm font-black text-white uppercase leading-tight">{col.label}</div>
                    </div>
                ))}

                {/* Rows with Headers */}
                {game.rows.map((row: any, r: number) => (
                    <>
                        {/* Row Header */}
                        <div className="flex flex-col items-center justify-center bg-emerald-950/80 rounded-xl p-2 text-center border border-white/10 aspect-square">
                            {row.type === 'TEAM' && <div className="text-xs text-emerald-400 font-bold mb-1">TEAM</div>}
                            {row.type === 'NATION' && <div className="text-xs text-blue-400 font-bold mb-1">NATION</div>}
                            <div className="text-xs md:text-sm font-black text-white uppercase leading-tight">{row.label}</div>
                        </div>

                        {/* Cells */}
                        {[0, 1, 2].map((c) => {
                            const key = `${r}-${c}`;
                            const state = gridState[key];
                            const isSelected = selectedCell?.r === r && selectedCell?.c === c;

                            return (
                                <div
                                    key={c}
                                    onClick={() => !state?.correct && !gameOver && !isComplete && setSelectedCell({ r, c })}
                                    className={clsx(
                                        "relative rounded-xl border-2 flex items-center justify-center cursor-pointer transition-all duration-200 aspect-square overflow-hidden group",
                                        state?.correct
                                            ? "bg-emerald-500 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                                            : "bg-white/5 border-white/10 hover:bg-white/10 hover:scale-[1.02]",
                                        isSelected && !state?.correct ? "ring-4 ring-emerald-400 border-transparent z-10 scale-105" : ""
                                    )}
                                >
                                    {state?.correct ? (
                                        <div className="text-center w-full h-full flex flex-col items-center justify-center bg-emerald-600">
                                            <div className="font-extrabold text-white text-[10px] md:text-xs px-1 line-clamp-2 md:line-clamp-none">
                                                {state.player}
                                            </div>
                                            <div className="mt-1">
                                                <svg className="w-4 h-4 md:w-6 md:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="text-white/10 text-4xl group-hover:text-white/30 transition-colors">+</div>
                                            {/* Corner Hints for Mobile */}
                                            <div className="absolute top-1 left-1 w-2 h-2 rounded-full md:hidden" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </>
                ))}
            </div>

            {/* PLAYER SEARCH MODAL */}
            {selectedCell && (
                <PlayerSearchModal
                    gameId={game.id}
                    cell={selectedCell}
                    rowLabel={game.rows[selectedCell.r].label}
                    colLabel={game.cols[selectedCell.c].label}
                    onClose={() => setSelectedCell(null)}
                    onSuccess={(player) => {
                        setGridState(prev => ({
                            ...prev,
                            [`${selectedCell.r}-${selectedCell.c}`]: { correct: true, player }
                        }));
                        setSelectedCell(null);
                    }}
                    onFail={() => {
                        setLives(l => l - 1);
                        // Optionally close or stay open
                    }}
                />
            )}
        </div>
    );
}

function PlayerSearchModal({ gameId, cell, rowLabel, colLabel, onClose, onSuccess, onFail }: any) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        if (query.length < 3) {
            setResults([]);
            return;
        }

        const timeout = setTimeout(async () => {
            setSearching(true);
            try {
                const res = await fetch(`/api/players/search?q=${query}`);
                const json = await res.json();
                setResults(json.data || []);
            } catch (e) {
                console.error(e);
            } finally {
                setSearching(false);
            }
        }, 500);

        return () => clearTimeout(timeout);
    }, [query]);

    const submitGuess = async (player: any) => {
        try {
            const res = await fetch('/api/minigames/tictactoe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    gameId,
                    row: cell.r,
                    col: cell.c,
                    playerId: player.name // Sending name as ID for this MVP
                })
            });
            const json = await res.json();

            if (json.correct) {
                onSuccess(player.name);
            } else {
                alert(`❌ Incorrect! ${player.name} does not match both ${rowLabel} and ${colLabel}.`);
                onFail();
            }
        } catch (e) {
            alert('Error submitting guess');
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-20 p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                <div className="bg-emerald-50 p-4 border-b border-emerald-100">
                    <div className="text-center text-xs font-bold text-emerald-600 uppercase mb-1">Find a player who played for</div>
                    <div className="text-center font-black text-emerald-900 text-lg">
                        {rowLabel} <span className="text-emerald-400 mx-2">×</span> {colLabel}
                    </div>
                </div>

                <div className="p-4 border-b flex items-center gap-3 bg-white">
                    <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                    <input
                        autoFocus
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Type player name..."
                        className="flex-1 outline-none text-gray-900 font-bold text-lg placeholder:font-normal"
                    />
                    <button onClick={onClose} className="text-sm font-bold text-gray-500 hover:text-gray-800 p-2">Cancel</button>
                </div>

                <div className="flex-1 overflow-y-auto bg-gray-50 p-2">
                    {searching && <div className="p-8 text-center text-gray-400 italic">Scouting players...</div>}

                    {results.map((player: any) => (
                        <div
                            key={player.name + player.team}
                            onClick={() => submitGuess(player)}
                            className="p-3 mb-2 bg-white rounded-xl shadow-sm hover:shadow-md hover:ring-2 hover:ring-emerald-400 cursor-pointer flex items-center gap-4 transition-all"
                        >
                            <div className="w-12 h-12 rounded-full bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-100">
                                {player.image_url ? (
                                    <img src={player.image_url} alt={player.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300 font-bold text-xl">?</div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="font-bold text-gray-900 text-sm truncate">{player.name}</div>
                                <div className="text-xs text-gray-500 truncate">{player.team} • {player.position}</div>
                            </div>
                            <div className="text-emerald-600">
                                <span className="sr-only">Select</span>
                                →
                            </div>
                        </div>
                    ))}

                    {!searching && query.length > 2 && results.length === 0 && (
                        <div className="p-8 text-center text-gray-400 flex flex-col items-center">
                            <span className="text-2xl mb-2">🤷‍♂️</span>
                            <span>No players found matching "{query}"</span>
                        </div>
                    )}

                    {!searching && query.length <= 2 && (
                        <div className="p-8 text-center text-gray-400 text-sm">
                            Type at least 3 letters to search
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
