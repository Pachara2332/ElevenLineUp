"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import Navbar from "@/components/Navbar";

interface GridCell {
  type: string;
  label: string;
}

interface Game {
  id: string;
  rows: GridCell[];
  cols: GridCell[];
}

interface SearchPlayer {
  id: string;
  name: string;
  team: string;
  position: string;
  image_url?: string;
}

export default function TicTacToePage() {
  const { data: game, isLoading } = useQuery<Game>({
    queryKey: ["tictactoe"],
    queryFn: async () => {
      const res = await fetch("/api/minigames/tictactoe");
      if (!res.ok) throw new Error("No game");
      return (await res.json()).data;
    },
  });

  const [gridState, setGridState] = useState<
    Record<string, { correct: boolean; player?: string }>
  >({});
  const [selectedCell, setSelectedCell] = useState<{
    r: number;
    c: number;
  } | null>(null);
  const [lives, setLives] = useState(9);

  const gameOver = lives <= 0;

  if (isLoading)
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar title="Tic-Tac-Toe" subtitle="Match players to criteria" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-emerald-600 text-xl font-bold animate-pulse">
            Loading Grid...
          </div>
        </div>
      </div>
    );

  if (!game)
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar title="Tic-Tac-Toe" subtitle="Match players to criteria" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500 text-xl font-bold">
            No Daily Game Available Today
          </div>
        </div>
      </div>
    );

  const isComplete =
    game.rows.length * game.cols.length ===
    Object.keys(gridState).filter((k) => gridState[k].correct).length;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar title="Tic-Tac-Toe" subtitle="Match players to criteria" />

      <div className="px-4 md:px-8 pb-8 flex-1">
        <div className="max-w-4xl mx-auto">
          <div className="glass-panel rounded-3xl p-6 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div
                  className={clsx(
                    "text-4xl font-black",
                    lives < 3 ? "text-red-600" : "text-emerald-600"
                  )}
                >
                  {lives}
                </div>
                <div className="text-xs font-bold text-emerald-700 uppercase">
                  Lives Left
                </div>
              </div>
              <div className="h-12 w-px bg-emerald-200" />
              <div className="text-center">
                <div className="text-4xl font-black text-emerald-600">
                  {Object.keys(gridState).filter((k) => gridState[k].correct).length}/9
                </div>
                <div className="text-xs font-bold text-emerald-700 uppercase">
                  Completed
                </div>
              </div>
            </div>

            {isComplete && (
              <div className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-black text-lg animate-in zoom-in">
                🎉 GRID COMPLETE!
              </div>
            )}

            {gameOver && !isComplete && (
              <div className="bg-red-600 text-white px-6 py-3 rounded-xl font-black text-lg animate-in zoom-in">
                ❌ GAME OVER
              </div>
            )}
          </div>

          {isComplete && (
            <div className="glass-panel rounded-3xl p-6 mb-6 text-center border-2 border-emerald-400">
              <div className="text-3xl font-black text-emerald-900 mb-2">
                🎉 PERFECT GRID!
              </div>
              <p className="text-emerald-700 font-medium">
                You nailed it! Come back tomorrow for a new grid.
              </p>
            </div>
          )}

          {gameOver && !isComplete && (
            <div className="glass-panel rounded-3xl p-6 mb-6 text-center border-2 border-red-400">
              <div className="text-3xl font-black text-red-700 mb-3">
                GAME OVER
              </div>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition-all shadow-md"
              >
                Try Again
              </button>
            </div>
          )}

          <div className="glass-panel rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />

            <div className="relative grid grid-cols-4 gap-3">
              <div className="aspect-square"></div>

              {game.cols.map((col, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-3 text-center shadow-lg aspect-square"
                >
                  <div className="text-[10px] font-bold text-white/80 mb-1 tracking-wider uppercase">
                    {col.type}
                  </div>
                  <div className="text-xs md:text-sm font-black text-white uppercase leading-tight line-clamp-2">
                    {col.label}
                  </div>
                </div>
              ))}

              {game.rows.map((row, r) => (
                <>
                  <div className="flex flex-col items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-3 text-center shadow-lg aspect-square">
                    <div className="text-[10px] font-bold text-white/80 mb-1 tracking-wider uppercase">
                      {row.type}
                    </div>
                    <div className="text-xs md:text-sm font-black text-white uppercase leading-tight line-clamp-2">
                      {row.label}
                    </div>
                  </div>

                  {[0, 1, 2].map((c) => {
                    const key = `${r}-${c}`;
                    const state = gridState[key];
                    const isSelected =
                      selectedCell?.r === r && selectedCell?.c === c;

                    return (
                      <div
                        key={c}
                        onClick={() =>
                          !state?.correct &&
                          !gameOver &&
                          !isComplete &&
                          setSelectedCell({ r, c })
                        }
                        className={clsx(
                          "relative rounded-2xl border-2 flex items-center justify-center cursor-pointer transition-all duration-200 aspect-square overflow-hidden group shadow-md",
                          state?.correct
                            ? "bg-gradient-to-br from-emerald-500 to-teal-600 border-emerald-400 text-white shadow-xl"
                            : "bg-white/60 border-emerald-200 hover:border-emerald-400 hover:bg-white/80",
                          isSelected && !state?.correct
                            ? "ring-4 ring-emerald-400/50 border-emerald-500 z-10 scale-105"
                            : ""
                        )}
                      >
                        {state?.correct ? (
                          <div className="text-center w-full h-full flex flex-col items-center justify-center p-2 animate-in zoom-in">
                            <div className="font-bold text-white text-xs md:text-sm leading-tight line-clamp-2 mb-2">
                              {state.player}
                            </div>
                            <svg
                              className="w-6 h-6 text-white/90"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        ) : (
                          <div className="text-emerald-300 text-4xl font-light group-hover:text-emerald-500 transition-colors">
                            +
                          </div>
                        )}
                      </div>
                    );
                  })}
                </>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedCell && (
        <PlayerSearchModal
          gameId={game.id}
          cell={selectedCell}
          rowLabel={game.rows[selectedCell.r].label}
          colLabel={game.cols[selectedCell.c].label}
          onClose={() => setSelectedCell(null)}
          onSuccess={(player: string) => {
            setGridState((prev) => ({
              ...prev,
              [`${selectedCell.r}-${selectedCell.c}`]: {
                correct: true,
                player,
              },
            }));
            setSelectedCell(null);
          }}
          onFail={() => {
            setLives((l) => l - 1);
          }}
        />
      )}
    </div>
  );
}

interface PlayerSearchModalProps {
  gameId: string;
  cell: { r: number; c: number };
  rowLabel: string;
  colLabel: string;
  onClose: () => void;
  onSuccess: (player: string) => void;
  onFail: () => void;
}

function PlayerSearchModal({
  gameId,
  cell,
  rowLabel,
  colLabel,
  onClose,
  onSuccess,
  onFail,
}: PlayerSearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchPlayer[]>([]);
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
      } catch (error) {
        console.error(error);
      } finally {
        setSearching(false);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [query]);

  const submitGuess = async (player: SearchPlayer) => {
    try {
      const res = await fetch("/api/minigames/tictactoe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameId,
          row: cell.r,
          col: cell.c,
          playerId: player.name,
        }),
      });
      const json = await res.json();

      if (json.correct) {
        onSuccess(player.name);
      } else {
        alert(
          `❌ Incorrect! ${player.name} does not match both ${rowLabel} and ${colLabel}.`
        );
        onFail();
      }
    } catch (error) {
      alert("Error submitting guess");
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        <div className="p-6 border-b border-emerald-200/30">
          <div className="text-center text-xs font-bold text-emerald-600 uppercase mb-2 tracking-wider">
            Find a player who played for
          </div>
          <div className="text-center font-black text-emerald-900 text-xl">
            {rowLabel} <span className="text-teal-600 mx-2">×</span> {colLabel}
          </div>
        </div>

        <div className="p-4 border-b border-emerald-200/30 flex items-center gap-3 bg-white/40">
          <MagnifyingGlassIcon className="w-6 h-6 text-emerald-600" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type player name..."
            className="flex-1 bg-transparent outline-none text-emerald-900 font-bold text-lg placeholder:font-normal placeholder:text-emerald-600/50"
          />
          <button
            onClick={onClose}
            className="text-sm font-bold text-emerald-700 hover:text-emerald-900 px-3 py-1 transition-colors"
          >
            Cancel
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-white/20 p-3 custom-scrollbar">
          {searching && (
            <div className="p-8 text-center text-emerald-600 italic animate-pulse">
              Scouting players...
            </div>
          )}

          {results.map((player) => (
            <div
              key={player.name + player.team}
              onClick={() => submitGuess(player)}
              className="p-4 mb-3 bg-white/80 rounded-2xl hover:bg-white cursor-pointer flex items-center gap-4 transition-all shadow-md hover:shadow-lg border border-emerald-200/50 hover:border-emerald-300"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex-shrink-0 overflow-hidden shadow-md">
                {player.image_url ? (
                  <img
                    src={player.image_url}
                    alt={player.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white font-bold text-xl">
                    {player.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-emerald-900 text-base truncate">
                  {player.name}
                </div>
                <div className="text-sm text-emerald-600 truncate">
                  {player.team} • {player.position}
                </div>
              </div>
              <div className="text-emerald-600 group-hover:translate-x-1 transition-transform text-xl">
                →
              </div>
            </div>
          ))}

          {!searching && query.length > 2 && results.length === 0 && (
            <div className="p-8 text-center text-emerald-700/60 flex flex-col items-center">
              <span className="text-3xl mb-2">🤷‍♂️</span>
              <span>No players found matching &quot;{query}&quot;</span>
            </div>
          )}

          {!searching && query.length <= 2 && (
            <div className="p-8 text-center text-emerald-700/60 text-sm italic">
              Type at least 3 letters to search
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
