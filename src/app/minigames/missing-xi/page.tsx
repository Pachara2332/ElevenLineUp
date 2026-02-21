"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

interface Player {
  id: string;
  name: string;
  position: string;
  x: number;
  y: number;
  is_masked: boolean;
  image_url?: string;
}

interface Game {
  id: string;
  team: { name: string };
  season: string;
  formation: string;
  lineup: Player[];
}

export default function MissingXIPage() {
  const { data: game, isLoading } = useQuery<Game>({
    queryKey: ["missing-xi"],
    queryFn: async () => {
      const res = await fetch("/api/minigames/missing-xi");
      if (!res.ok) throw new Error("No game");
      return (await res.json()).data;
    },
  });

  const [revealedPlayers, setRevealedPlayers] = useState<
    Record<number, { name: string }>
  >({});
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(
    null
  );

  const checkGuessMutation = useMutation({
    mutationFn: async (guess: string) => {
      const res = await fetch("/api/minigames/missing-xi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameId: game?.id,
          guess,
        }),
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.correct) {
        setRevealedPlayers((prev) => ({
          ...prev,
          [selectedSlotIndex!]: { name: data.real_name },
        }));
        setSelectedSlotIndex(null);
      } else {
        alert("Incorrect guess!");
      }
    },
  });

  if (isLoading)
    return (
      <div className="min-h-screen flex flex-col">
        <div className="mb-6 text-center mt-4 md:mt-8">
          <h1 className="text-3xl font-black text-emerald-900 drop-shadow-sm">
            Missing XI <span className="text-emerald-400">Overview</span>
          </h1>
          <p className="text-emerald-700 font-medium mt-1">Guess the missing players</p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-emerald-600 text-xl font-bold animate-pulse">
            Loading Lineup...
          </div>
        </div>
      </div>
    );

  if (!game)
    return (
      <div className="min-h-screen flex flex-col">
        <div className="mb-6 text-center mt-4 md:mt-8">
          <h1 className="text-3xl font-black text-emerald-900 drop-shadow-sm">
            Missing XI <span className="text-emerald-400">Overview</span>
          </h1>
          <p className="text-emerald-700 font-medium mt-1">Guess the missing players</p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500 text-xl font-bold">
            No Missing XI Game Today
          </div>
        </div>
      </div>
    );

  const totalMissing = game.lineup.filter((p) => p.is_masked).length;
  const totalRevealed = Object.keys(revealedPlayers).length;
  const isComplete = totalRevealed === totalMissing;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="mb-6 text-center mt-4 md:mt-8">
        <h1 className="text-3xl font-black text-emerald-900 drop-shadow-sm">
          Missing XI <span className="text-emerald-400">Overview</span>
        </h1>
        <p className="text-emerald-700 font-medium mt-1">Guess the missing players</p>
      </div>

      <div className="px-4 md:px-8 pb-8 flex-1">
        <div className="max-w-7xl mx-auto">
          {/* Game Info Header */}
          <div className="glass-panel rounded-3xl p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black text-emerald-900 uppercase tracking-wide mb-2">
                  {game.team.name}
                </h2>
                <div className="flex gap-3 text-sm font-medium text-emerald-700">
                  <span className="bg-white/60 px-3 py-1 rounded-lg">
                    {game.season}
                  </span>
                  <span className="bg-white/60 px-3 py-1 rounded-lg">
                    {game.formation}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-3xl font-black text-emerald-600">
                    {totalRevealed}/{totalMissing}
                  </div>
                  <div className="text-xs font-bold text-emerald-700 uppercase">
                    Revealed
                  </div>
                </div>
                {isComplete && (
                  <div className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-black text-lg animate-in zoom-in">
                    🎉 COMPLETE!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pitch Container */}
          <div className="glass-panel rounded-3xl p-4 md:p-6 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />

            <div className="relative w-full aspect-[4/5] md:aspect-[3/4] max-w-2xl mx-auto rounded-2xl shadow-2xl overflow-hidden">
              {/* Pitch background */}
              <div className="absolute inset-0 bg-gradient-to-b from-green-600 via-green-700 to-green-800" />

              {/* Grass texture */}
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: `repeating-linear-gradient(
                    0deg,
                    transparent,
                    transparent 20px,
                    rgba(0,0,0,0.1) 20px,
                    rgba(0,0,0,0.1) 40px
                  )`,
                }}
              />

              {/* Pitch markings */}
              <div className="absolute inset-3 border-2 border-white/40 rounded-lg" />
              <div className="absolute top-1/2 left-3 right-3 h-0.5 bg-white/40" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-28 h-28 border-2 border-white/40 rounded-full" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/40 rounded-full" />
              <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-52 h-28 border-2 border-white/40 border-t-0 rounded-b-lg" />
              <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-28 h-12 border-2 border-white/40 border-t-0 rounded-b-lg" />
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-52 h-28 border-2 border-white/40 border-b-0 rounded-t-lg" />
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-28 h-12 border-2 border-white/40 border-b-0 rounded-t-lg" />

              {/* Players */}
              {game.lineup.map((player, idx) => {
                const isRevealed = !player.is_masked || revealedPlayers[idx];
                const isMissing = !isRevealed;
                const displayName = isRevealed
                  ? (revealedPlayers[idx]?.name || player.name)
                    .replace(/\s*\(\d+\)$/, "")
                    .split(" ")
                    .slice(-1)[0]
                  : "?";

                return (
                  <div
                    key={idx}
                    style={{
                      left: `${player.x}%`,
                      top: `${player.y}%`,
                    }}
                    onClick={() => isMissing && setSelectedSlotIndex(idx)}
                    className={clsx(
                      "absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 cursor-pointer group hover:z-20",
                      isMissing ? "w-10 h-10 md:w-14 md:h-14" : "w-12 h-16 md:w-16 md:h-20"
                    )}
                  >
                    {isMissing ? (
                      <div className="w-full h-full rounded-2xl flex flex-col items-center justify-center bg-gradient-to-b from-yellow-400 to-yellow-500 shadow-xl hover:scale-110 transition-transform ring-4 ring-yellow-300/50 animate-pulse">
                        <span className="text-3xl font-black text-yellow-900">
                          ?
                        </span>
                      </div>
                    ) : (
                      <>
                        {/* Hover popup */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50">
                          <div className="bg-slate-900 rounded-xl p-2 shadow-xl border border-slate-600 whitespace-nowrap flex items-center gap-2">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-700 flex-shrink-0">
                              {player.image_url ? (
                                <img
                                  src={player.image_url}
                                  alt={displayName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold">
                                  {displayName.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <span className="text-white font-bold text-xs">
                                {revealedPlayers[idx]?.name || player.name}
                              </span>
                              <span className="bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded text-center">
                                {player.position}
                              </span>
                            </div>
                          </div>
                          <div className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-900" />
                        </div>

                        {/* Player card */}
                        <div className="w-full h-full rounded-2xl flex flex-col items-center justify-center bg-gradient-to-b from-slate-800/90 to-slate-900/90 backdrop-blur-sm shadow-xl hover:scale-150 hover:z-50 hover:shadow-2xl transition-all">
                          <div className="w-8 h-8 md:w-11 md:h-11 rounded-xl overflow-hidden ring-2 ring-white/50 bg-slate-700 flex-shrink-0 shadow-lg">
                            {player.image_url ? (
                              <img
                                src={player.image_url}
                                alt={displayName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xs md:text-sm">
                                {displayName.charAt(0)}
                              </div>
                            )}
                          </div>
                          <span className="text-[8px] md:text-[10px] font-bold text-white mt-0.5 truncate w-[90%] text-center drop-shadow-lg leading-tight">
                            {displayName}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      {selectedSlotIndex !== null && (
        <PlayerSearchModal
          onClose={() => setSelectedSlotIndex(null)}
          onSelect={(playerName: string) =>
            checkGuessMutation.mutate(playerName)
          }
          isChecking={checkGuessMutation.isPending}
        />
      )}
    </div>
  );
}

interface PlayerSearchModalProps {
  onClose: () => void;
  onSelect: (playerName: string) => void;
  isChecking: boolean;
}

interface SearchPlayer {
  id: string;
  name: string;
  team: string;
  image_url?: string;
}

function PlayerSearchModal({
  onClose,
  onSelect,
  isChecking,
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
      } catch (e) {
        console.error(e);
      } finally {
        setSearching(false);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in zoom-in duration-200">
      <div className="glass-panel w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        <div className="p-6 border-b border-emerald-200/30">
          <h3 className="font-black text-emerald-900 text-center text-2xl uppercase tracking-wide">
            Who is missing?
          </h3>
        </div>

        <div className="p-4 border-b border-emerald-200/30 flex items-center gap-3 bg-white/40">
          <MagnifyingGlassIcon className="w-6 h-6 text-emerald-600" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search player name..."
            className="flex-1 bg-transparent outline-none text-emerald-900 font-bold text-lg placeholder:font-normal placeholder:text-emerald-600/50"
          />
        </div>

        <div className="flex-1 overflow-y-auto bg-white/20 p-3 min-h-[300px] custom-scrollbar">
          {isChecking && (
            <div className="p-8 text-center text-emerald-600 font-bold animate-pulse">
              Checking Answer...
            </div>
          )}

          {!isChecking && searching && (
            <div className="p-8 text-center text-emerald-700 italic">
              Searching database...
            </div>
          )}

          {!isChecking &&
            !searching &&
            results.map((player) => (
              <div
                key={player.id}
                onClick={() => onSelect(player.name)}
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
                    {player.team}
                  </div>
                </div>
              </div>
            ))}

          {!isChecking &&
            !searching &&
            query.length > 2 &&
            results.length === 0 && (
              <div className="p-8 text-center text-emerald-700/60 text-sm">
                No players found
              </div>
            )}

          {!isChecking && !searching && query.length <= 2 && (
            <div className="p-8 text-center text-emerald-700/60 text-sm italic">
              Type at least 3 letters to search
            </div>
          )}
        </div>

        <div className="p-4 bg-white/40 border-t border-emerald-200/30 text-center">
          <button
            onClick={onClose}
            className="text-emerald-700 hover:text-emerald-900 text-sm font-bold transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
