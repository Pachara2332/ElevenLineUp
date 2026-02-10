"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

export default function TicTacToePage() {
  const router = useRouter();
  const { data: game, isLoading } = useQuery({
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
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (lives <= 0) {
      setGameOver(true);
      alert("Game Over! Better luck next time.");
    }
  }, [lives]);

  if (isLoading)
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center">
        <div className="text-emerald-500 text-xl font-bold animate-pulse">
          Loading Grid...
        </div>
      </div>
    );

  if (!game)
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center">
        <div className="text-slate-400 text-xl font-bold">
          No Daily Game Available Today
        </div>
      </div>
    );

  const isComplete =
    game.rows.length * game.cols.length ===
    Object.keys(gridState).filter((k) => gridState[k].correct).length;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-4 flex flex-col items-center">
      {/* Back Button - Top Left Absolute or just simplified header */}
      <div className="w-full max-w-2xl flex justify-between items-center mb-8 mt-4">
        <button
          onClick={() => router.push("/minigames")}
          className="text-slate-500 hover:text-white transition-colors text-sm font-bold flex items-center gap-2"
        >
          ← Back
        </button>
        <div className="font-black text-2xl tracking-tight text-white">
          TIC-TAC-TOE
        </div>
        <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-full border border-slate-700">
          <span className="text-xs font-bold text-slate-400">LIVES:</span>
          <span
            className={clsx(
              "font-black text-lg",
              lives < 3 ? "text-red-500" : "text-emerald-400",
            )}
          >
            {lives}
          </span>
        </div>
      </div>

      {isComplete && (
        <div className="mb-8 w-full max-w-2xl bg-emerald-900/20 border border-emerald-500/50 p-6 rounded-2xl text-center shadow-lg animate-in fade-in slide-in-from-top-4">
          <div className="text-3xl font-black text-emerald-400 mb-2">
            🎉 GRID COMPLETE!
          </div>
          <p className="text-emerald-200/70">
            You nailed it! Come back tomorrow for a new grid.
          </p>
        </div>
      )}

      {/* GRID CONTAINER */}
      <div className="grid grid-cols-4 gap-2 md:gap-3 max-w-xl w-full">
        {/* Top Left Empty Corner */}
        <div className="aspect-square"></div>

        {/* Column Headers */}
        {game.cols.map((col: any, i: number) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center bg-slate-800 rounded-xl p-2 text-center border border-slate-700 shadow-sm aspect-square"
          >
            {col.type === "TEAM" && (
              <div className="text-[10px] font-bold text-emerald-500 mb-1 tracking-wider uppercase">
                TEAM
              </div>
            )}
            {col.type === "NATION" && (
              <div className="text-[10px] font-bold text-blue-400 mb-1 tracking-wider uppercase">
                NATION
              </div>
            )}
            <div className="text-xs md:text-sm font-black text-white uppercase leading-tight line-clamp-2">
              {col.label}
            </div>
          </div>
        ))}

        {/* Rows with Headers */}
        {game.rows.map((row: any, r: number) => (
          <>
            {/* Row Header */}
            <div className="flex flex-col items-center justify-center bg-slate-800 rounded-xl p-2 text-center border border-slate-700 shadow-sm aspect-square">
              {row.type === "TEAM" && (
                <div className="text-[10px] font-bold text-emerald-500 mb-1 tracking-wider uppercase">
                  TEAM
                </div>
              )}
              {row.type === "NATION" && (
                <div className="text-[10px] font-bold text-blue-400 mb-1 tracking-wider uppercase">
                  NATION
                </div>
              )}
              <div className="text-xs md:text-sm font-black text-white uppercase leading-tight line-clamp-2">
                {row.label}
              </div>
            </div>

            {/* Cells */}
            {[0, 1, 2].map((c) => {
              const key = `${r}-${c}`;
              const state = gridState[key];
              const isSelected = selectedCell?.r === r && selectedCell?.c === c;

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
                    "relative rounded-xl border-2 flex items-center justify-center cursor-pointer transition-all duration-200 aspect-square overflow-hidden group",
                    state?.correct
                      ? "bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-900/20"
                      : "bg-slate-800/50 border-slate-700/50 hover:bg-slate-700 hover:border-slate-500",
                    isSelected && !state?.correct
                      ? "ring-4 ring-emerald-500/30 border-emerald-500 z-10 scale-105"
                      : "",
                  )}
                >
                  {state?.correct ? (
                    <div className="text-center w-full h-full flex flex-col items-center justify-center bg-emerald-600 p-1">
                      <div className="font-bold text-white text-[10px] md:text-xs leading-tight line-clamp-2">
                        {state.player}
                      </div>
                      <div className="mt-1">
                        <svg
                          className="w-4 h-4 md:w-5 md:h-5 text-white"
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
                    </div>
                  ) : (
                    <>
                      <div className="text-slate-600 text-3xl group-hover:text-slate-400 transition-colors font-light">
                        +
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </>
        ))}
      </div>

      {/* PLAYER SEARCH MODAL - CENTERED POPUP */}
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

function PlayerSearchModal({
  gameId,
  cell,
  rowLabel,
  colLabel,
  onClose,
  onSuccess,
  onFail,
}: any) {
  const [query, setQuery] = useState("");
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
      const res = await fetch("/api/minigames/tictactoe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameId,
          row: cell.r,
          col: cell.c,
          playerId: player.name, // Sending mock logic
        }),
      });
      const json = await res.json();

      if (json.correct) {
        onSuccess(player.name);
      } else {
        alert(
          `❌ Incorrect! ${player.name} does not match both ${rowLabel} and ${colLabel}.`,
        );
        onFail();
      }
    } catch (e) {
      alert("Error submitting guess");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] border border-slate-700 ring-1 ring-white/10">
        <div className="bg-slate-900/50 p-4 border-b border-slate-700">
          <div className="text-center text-xs font-bold text-slate-400 uppercase mb-1 tracking-wider">
            Find a player who played for
          </div>
          <div className="text-center font-black text-white text-lg">
            {rowLabel} <span className="text-slate-500 mx-2">×</span> {colLabel}
          </div>
        </div>

        <div className="p-4 border-b border-slate-700 flex items-center gap-3 bg-slate-800">
          <MagnifyingGlassIcon className="w-5 h-5 text-slate-400" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type player name..."
            className="flex-1 bg-transparent outline-none text-white font-bold text-lg placeholder:font-normal placeholder:text-slate-500"
          />
          <button
            onClick={onClose}
            className="text-sm font-bold text-slate-500 hover:text-white p-2 transition-colors"
          >
            Cancel
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-900/30 p-2">
          {searching && (
            <div className="p-8 text-center text-emerald-500 italic animate-pulse">
              Scouting players...
            </div>
          )}

          {results.map((player: any) => (
            <div
              key={player.name + player.team}
              onClick={() => submitGuess(player)}
              className="p-3 mb-2 bg-slate-800 rounded-xl hover:bg-slate-700 cursor-pointer flex items-center gap-4 transition-all border border-slate-700 hover:border-slate-500"
            >
              <div className="w-12 h-12 rounded-full bg-slate-700 flex-shrink-0 overflow-hidden border border-slate-600">
                {player.image_url ? (
                  <img
                    src={player.image_url}
                    alt={player.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold text-xl">
                    ?
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-200 text-sm truncate">
                  {player.name}
                </div>
                <div className="text-xs text-slate-500 truncate">
                  {player.team} • {player.position}
                </div>
              </div>
              <div className="text-emerald-500 group-hover:translate-x-1 transition-transform">
                <span className="sr-only">Select</span>→
              </div>
            </div>
          ))}

          {!searching && query.length > 2 && results.length === 0 && (
            <div className="p-8 text-center text-slate-500 flex flex-col items-center">
              <span className="text-2xl mb-2">🤷‍♂️</span>
              <span>No players found matching "{query}"</span>
            </div>
          )}

          {!searching && query.length <= 2 && (
            <div className="p-8 text-center text-slate-600 text-sm italic">
              Type at least 3 letters to search
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
