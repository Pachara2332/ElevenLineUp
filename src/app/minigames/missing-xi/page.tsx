"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

export default function MissingXIPage() {
  const router = useRouter();
  const { data: game, isLoading } = useQuery({
    queryKey: ["missing-xi"],
    queryFn: async () => {
      const res = await fetch("/api/minigames/missing-xi");
      if (!res.ok) throw new Error("No game");
      return (await res.json()).data;
    },
  });

  const [revealedPlayers, setRevealedPlayers] = useState<Record<number, any>>(
    {},
  );
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(
    null,
  );

  const checkGuessMutation = useMutation({
    mutationFn: async (guess: string) => {
      const res = await fetch("/api/minigames/missing-xi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameId: game.id,
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
        setSelectedSlotIndex(null); // Close modal
      } else {
        alert("Incorrect guess!");
      }
    },
  });

  if (isLoading)
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center">
        <div className="text-emerald-500 text-xl font-bold animate-pulse">
          Loading Lineup...
        </div>
      </div>
    );

  if (!game)
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center">
        <div className="text-slate-400 text-xl font-bold">
          No Missing XI Game Today
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-4 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-2xl flex justify-between items-center mb-6 mt-4">
        <button
          onClick={() => router.push("/minigames")}
          className="text-slate-500 hover:text-white transition-colors text-sm font-bold flex items-center gap-2"
        >
          ← Back
        </button>
        <div className="text-center">
          <div className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-1">
            MISSING XI
          </div>
          <div className="text-xl md:text-2xl font-black text-white">
            {game.team.name}
          </div>
          <div className="flex justify-center gap-3 text-xs font-medium text-slate-400 mt-1">
            <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              {game.season}
            </span>
            <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              {game.formation}
            </span>
          </div>
        </div>
        <div className="w-16"></div> {/* Spacer to balance Back button */}
      </div>

      <main className="flex-1 flex flex-col items-center w-full">
        {/* PITCH CONTAINER - REUSING DESIGN FROM PITCH COMPONENT */}
        <div className="relative w-full max-w-md aspect-[2/3] rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/10">
          {/* Pitch background with gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-800 via-emerald-700 to-emerald-900" />

          {/* Grass texture overlay */}
          <div
            className="absolute inset-0 opacity-20"
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

          {/* Pitch border */}
          <div className="absolute inset-3 border-2 border-white/30 rounded-lg" />

          {/* Center line */}
          <div className="absolute top-1/2 left-3 right-3 h-0.5 bg-white/30" />

          {/* Center circle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-white/30 rounded-full" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/30 rounded-full" />

          {/* Penalty Areas (Simplified) */}
          <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-40 h-20 border-2 border-white/30 border-t-0 rounded-b-lg" />
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-40 h-20 border-2 border-white/30 border-b-0 rounded-t-lg" />

          {/* Players */}
          {game.lineup.map((player: any, idx: number) => {
            // Logic to check if this specific slot is revealed
            const isRevealed = !player.is_masked || revealedPlayers[idx];
            const isMissing = !isRevealed;

            return (
              <div
                key={idx}
                style={{
                  left: `${player.x}%`,
                  top: `${player.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                className="absolute flex flex-col items-center group cursor-pointer z-10"
                onClick={() => isMissing && setSelectedSlotIndex(idx)}
              >
                <div
                  className={clsx(
                    "w-12 h-12 rounded-full flex items-center justify-center font-bold border-2 shadow-lg transition-transform hover:scale-110",
                    isMissing
                      ? "bg-gradient-to-br from-slate-200 to-white text-slate-900 border-white ring-4 ring-emerald-500/50 animate-pulse"
                      : "bg-slate-800 text-white border-slate-600",
                  )}
                >
                  {isMissing ? (
                    <span className="text-2xl font-black text-slate-800">
                      ?
                    </span>
                  ) : (
                    <div className="flex flex-col items-center leading-none">
                      <span className="text-[10px] opacity-70 mb-0.5">PO</span>
                      <span className="text-xs font-bold">
                        {player.position}
                      </span>
                    </div>
                  )}
                </div>

                <div
                  className={clsx(
                    "mt-1 px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap shadow-md backdrop-blur-md",
                    isMissing
                      ? "bg-emerald-500 text-white"
                      : "bg-black/60 text-white border border-white/10",
                  )}
                >
                  {isMissing
                    ? "GUESS ME"
                    : revealedPlayers[idx]?.name || player.name}
                </div>
              </div>
            );
          })}
        </div>
      </main>

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

function PlayerSearchModal({ onClose, onSelect, isChecking }: any) {
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

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in zoom-in duration-200">
      <div className="bg-slate-800 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh] border border-slate-700 ring-1 ring-white/10">
        <div className="p-4 bg-slate-900 border-b border-slate-700">
          <h3 className="font-black text-white text-center text-lg">
            Who is missing?
          </h3>
        </div>

        <div className="p-3 border-b border-slate-700 flex items-center gap-2 bg-slate-800">
          <MagnifyingGlassIcon className="w-5 h-5 text-slate-500" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search player name..."
            className="flex-1 bg-transparent outline-none text-white font-bold placeholder:font-normal placeholder:text-slate-500"
          />
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-900/50 p-2 min-h-[300px]">
          {isChecking && (
            <div className="p-8 text-center text-emerald-400 font-bold animate-pulse">
              Checking Answer...
            </div>
          )}

          {!isChecking && searching && (
            <div className="p-8 text-center text-slate-500 italic">
              Searching database...
            </div>
          )}

          {!isChecking &&
            !searching &&
            results.map((player: any) => (
              <div
                key={player.id}
                onClick={() => onSelect(player.name)}
                className="p-3 mb-2 bg-slate-800 rounded-xl hover:bg-emerald-900/30 hover:border-emerald-500/50 cursor-pointer flex items-center gap-3 transition-all border border-slate-700/50"
              >
                <div className="w-10 h-10 rounded-full bg-slate-700 flex-shrink-0 overflow-hidden border border-slate-600">
                  {player.image_url ? (
                    <img
                      src={player.image_url}
                      alt={player.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold">
                      ?
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-200 text-sm truncate">
                    {player.name}
                  </div>
                  <div className="text-xs text-slate-500 truncate">
                    {player.team}
                  </div>
                </div>
              </div>
            ))}

          {!isChecking &&
            !searching &&
            query.length > 2 &&
            results.length === 0 && (
              <div className="p-8 text-center text-slate-600 text-sm">
                No players found
              </div>
            )}
        </div>

        <div className="p-3 bg-slate-900 border-t border-slate-700 text-center">
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-sm font-bold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
