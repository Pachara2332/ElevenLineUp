"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { 
  MagnifyingGlassIcon, 
  TrophyIcon, 
  HeartIcon, 
  XMarkIcon, 
  CheckCircleIcon,
  InformationCircleIcon,
  PuzzlePieceIcon
} from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";

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
  const router = useRouter();
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
  const isComplete = game && 
    game.rows.length * game.cols.length ===
    Object.keys(gridState).filter((k) => gridState[k].correct).length;

  if (isLoading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <div className="text-emerald-900 font-black animate-pulse text-2xl uppercase tracking-[0.5em]">
            Deploying Grid...
          </div>
      </div>
    );

  if (!game)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
           <div className="max-w-md w-full glass-panel p-10 rounded-[3rem] border border-slate-200 text-center">
             <InformationCircleIcon className="w-16 h-16 text-slate-300 mx-auto mb-6" />
             <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4">No Session Today</h2>
             <p className="text-slate-500 font-medium mb-8">The grid generator is recalibrating. Check back tomorrow.</p>
             <button onClick={() => router.push('/minigames')} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-slate-200">Return to Field</button>
           </div>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 pb-8 border-b border-slate-200/50">
          <div className="text-center md:text-left">
              <div className="flex items-center gap-3 mb-2 justify-center md:justify-start">
                  <div className="p-2 rounded-xl bg-emerald-100">
                      <PuzzlePieceIcon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Immaculate Grid</h1>
              </div>
              <p className="text-slate-500 font-medium">Match players who meet both criteria.</p>
          </div>

          <div className="flex items-center gap-4">
              <div className="glass-panel px-6 py-3 rounded-2xl border border-slate-200 flex items-center gap-3">
                  <HeartIcon className={clsx("w-6 h-6", lives < 3 ? "text-rose-500" : "text-emerald-500")} />
                  <div className="text-2xl font-black text-slate-900 tabular-nums">{lives}</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lives</div>
              </div>
              <div className="glass-panel px-6 py-3 rounded-2xl border border-slate-200 flex items-center gap-3">
                  <CheckCircleIcon className="w-6 h-6 text-emerald-500" />
                  <div className="text-2xl font-black text-slate-900 tabular-nums">
                    {Object.keys(gridState).filter((k) => gridState[k].correct).length}<span className="text-slate-300">/</span>9
                  </div>
              </div>
          </div>
      </div>

      <AnimatePresence>
        {isComplete && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-[2.5rem] p-8 mb-10 text-center border-2 border-emerald-400 bg-emerald-50/50"
          >
            <TrophyIcon className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <div className="text-3xl font-black text-emerald-900 mb-2 uppercase tracking-tight">Perfect Grid!</div>
            <p className="text-emerald-700 font-bold mb-6">You masterminded the entire board. Tactical brilliance.</p>
            <button
                onClick={() => router.push('/minigames')}
                className="px-10 py-4 bg-emerald-600 text-white rounded-xl font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200"
            >
                Share Result
            </button>
          </motion.div>
        )}

        {gameOver && !isComplete && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-[2.5rem] p-8 mb-10 text-center border-2 border-rose-400 bg-rose-50/50"
          >
            <XMarkIcon className="w-16 h-16 text-rose-500 mx-auto mb-4" />
            <div className="text-3xl font-black text-rose-900 mb-2 uppercase tracking-tight">Board Cleared</div>
            <p className="text-rose-700 font-bold mb-6">Tactical error. You've run out of lives.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-10 py-4 bg-rose-600 text-white rounded-xl font-black uppercase tracking-widest hover:bg-rose-700 transition-all shadow-xl shadow-rose-200"
            >
              Reset Session
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="glass-panel rounded-[3rem] p-4 md:p-8 bg-white border border-slate-200 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full -mr-48 -mt-48 pointer-events-none" />
        
        <div className="relative grid grid-cols-4 gap-2 md:gap-4">
          <div className="aspect-square"></div>

          {game.cols.map((col, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center bg-slate-900 rounded-3xl p-2 md:p-4 text-center shadow-lg aspect-square border-4 border-slate-800"
            >
              <div className="text-[8px] md:text-[10px] font-black text-emerald-400 mb-1 tracking-widest uppercase truncate w-full">
                {col.type}
              </div>
              <div className="text-[10px] md:text-sm font-black text-white uppercase leading-tight line-clamp-2 md:line-clamp-none">
                {col.label}
              </div>
            </div>
          ))}

          {game.rows.map((row, r) => (
            <React.Fragment key={r}>
              <div className="flex flex-col items-center justify-center bg-slate-900 rounded-3xl p-2 md:p-4 text-center shadow-lg aspect-square border-4 border-slate-800">
                <div className="text-[8px] md:text-[10px] font-black text-emerald-400 mb-1 tracking-widest uppercase truncate w-full">
                  {row.type}
                </div>
                <div className="text-[10px] md:text-sm font-black text-white uppercase leading-tight line-clamp-2 md:line-clamp-none">
                  {row.label}
                </div>
              </div>

              {[0, 1, 2].map((c) => {
                const key = `${r}-${c}`;
                const state = gridState[key];
                const isSelected =
                  selectedCell?.r === r && selectedCell?.c === c;

                return (
                  <motion.div
                    key={c}
                    whileHover={!state?.correct && !gameOver ? { scale: 1.02 } : {}}
                    whileTap={!state?.correct && !gameOver ? { scale: 0.98 } : {}}
                    onClick={() =>
                      !state?.correct &&
                      !gameOver &&
                      !isComplete &&
                      setSelectedCell({ r, c })
                    }
                    className={clsx(
                      "relative rounded-[1.5rem] md:rounded-[2rem] border-2 flex items-center justify-center cursor-pointer transition-all duration-300 aspect-square overflow-hidden shadow-sm",
                      state?.correct
                        ? "bg-emerald-600 border-emerald-400 text-white shadow-xl shadow-emerald-200"
                        : "bg-slate-50 border-slate-100 hover:border-emerald-400 hover:bg-white",
                      isSelected && !state?.correct
                        ? "ring-8 ring-emerald-500/10 border-emerald-500 z-10"
                        : ""
                    )}
                  >
                    {state?.correct ? (
                      <div className="text-center w-full h-full flex flex-col items-center justify-center p-2 animate-in zoom-in">
                        <div className="font-black text-white text-[10px] md:text-sm leading-tight uppercase tracking-tighter mb-1">
                          {state.player}
                        </div>
                        <CheckCircleIcon className="w-5 h-5 md:w-8 md:h-8 text-white/50" />
                      </div>
                    ) : (
                      <div className="text-slate-200 text-4xl font-light">+</div>
                    )}
                    
                    {!state?.correct && !gameOver && !isComplete && (
                       <div className="absolute inset-x-0 bottom-0 h-1 bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </motion.div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      <AnimatePresence>
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
      </AnimatePresence>
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
    }, 400);

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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4"
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="glass-panel w-full max-w-lg rounded-[2.5rem] bg-white shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-slate-200"
      >
        <div className="p-8 border-b border-slate-100 bg-slate-50 relative">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-200 transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-slate-500" />
          </button>
          
          <div className="text-center text-[10px] font-black text-slate-400 uppercase mb-3 tracking-[0.2em]">
            Strategic Search
          </div>
          <div className="text-center font-black text-slate-900 text-2xl tracking-tight uppercase">
            {rowLabel} <span className="text-emerald-500 mx-2">×</span> {colLabel}
          </div>
        </div>

        <div className="p-6 border-b border-slate-100 flex items-center gap-4">
          <MagnifyingGlassIcon className="w-6 h-6 text-slate-300" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Player Database..."
            className="flex-1 bg-transparent outline-none text-slate-900 font-black text-xl placeholder:font-bold placeholder:text-slate-200 uppercase tracking-tighter"
          />
          {searching && (
            <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-white">
          <AnimatePresence>
            {results.map((player) => (
              <motion.div
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                key={player.name + player.team}
                onClick={() => submitGuess(player)}
                className="group p-5 mb-3 bg-slate-50 rounded-2xl hover:bg-emerald-600 cursor-pointer flex items-center gap-5 transition-all border border-slate-100 hover:border-emerald-400"
              >
                <div className="w-16 h-16 rounded-2xl bg-white flex-shrink-0 overflow-hidden shadow-sm border border-slate-100 group-hover:border-emerald-200">
                  {player.image_url ? (
                    <img
                      src={player.image_url}
                      alt={player.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 font-black text-2xl uppercase group-hover:text-emerald-100">
                      {player.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-black text-slate-900 text-lg uppercase tracking-tight group-hover:text-white transition-colors">
                    {player.name}
                  </div>
                  <div className="text-xs font-bold text-slate-400 group-hover:text-emerald-100 transition-colors">
                    {player.team} • {player.position}
                  </div>
                </div>
                <div className="text-slate-300 group-hover:text-white transition-colors">
                   <CheckCircleIcon className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {!searching && query.length > 2 && results.length === 0 && (
            <div className="p-12 text-center text-slate-300 flex flex-col items-center">
              <XMarkIcon className="w-12 h-12 mb-4 opacity-20" />
              <span className="font-black uppercase tracking-widest text-xs">No Intel Found</span>
            </div>
          )}

          {!searching && query.length <= 2 && (
            <div className="p-12 text-center text-slate-300 uppercase font-black text-[10px] tracking-[0.3em]">
              Input minimum 3 characters
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
