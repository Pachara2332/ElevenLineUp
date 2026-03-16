"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import {
  PhotoIcon,
  SparklesIcon,
  TicketIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

interface Game {
  id: string;
  blurredImage: string;
  teamName?: string;
}

export default function WhoAreYaPage() {
  const router = useRouter();
  const { data: game, isLoading } = useQuery<Game>({
    queryKey: ["who-are-ya"],
    queryFn: async () => {
      const res = await fetch("/api/minigames/who-are-ya");
      if (!res.ok) throw new Error("No game");
      return (await res.json()).data;
    },
  });

  const [attempts, setAttempts] = useState(0);
  const [solved, setSolved] = useState(false);
  const [blurLevel, setBlurLevel] = useState(30);
  const [guessInput, setGuessInput] = useState("");
  const [feedback, setFeedback] = useState("");

  const submitGuess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guessInput.trim()) return;

    const res = await fetch("/api/minigames/who-are-ya", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gameId: game?.id,
        guess: guessInput,
      }),
    });
    const json = await res.json();

    if (json.correct) {
      setSolved(true);
      setBlurLevel(0);
      setFeedback(`Identity Verified: It was ${json.playerName}`);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setFeedback("Identity Mismatch. Recalibrating sensors...");
      setGuessInput("");
      setBlurLevel(Math.max(0, 30 - newAttempts * 3.5));

      if (newAttempts >= 8) {
        setFeedback(
          `Out of Intel. Target was ${json.playerName || "the mystery player"}.`,
        );
        setBlurLevel(0);
      }
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-emerald-900 font-black animate-pulse text-2xl uppercase tracking-[0.5em]">
          Analysing Target...
        </div>
      </div>
    );

  if (!game)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full glass-panel p-10 rounded-[3rem] border border-slate-200 text-center">
          <InformationCircleIcon className="w-16 h-16 text-slate-300 mx-auto mb-6" />
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4">
            No Intel Today
          </h2>
          <p className="text-slate-500 font-medium mb-8">
            The mystery player database will refresh soon. Check back tomorrow.
          </p>
          <button
            onClick={() => window.history.back()}
            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-slate-200"
          >
            Return to Field
          </button>
        </div>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="flex justify-between items-end mb-10 pb-6 border-b border-slate-200/50">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-purple-100">
              <PhotoIcon className="w-6 h-6 text-purple-600" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
              Who Are Ya?
            </h1>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-sm bg-purple-600">
            <SparklesIcon className="w-3 h-3" /> Mystery Target
          </div>
        </div>
        <div className="text-right">
          <div className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-1">
            Status
          </div>
          <div
            className={clsx(
              "text-3xl font-black tabular-nums leading-none",
              attempts >= 6 ? "text-rose-600" : "text-slate-900",
            )}
          >
            {attempts}
            <span className="text-slate-300 mx-0.5">/</span>8
          </div>
        </div>
      </div>

      <div className="glass-panel p-8 md:p-10 rounded-[3rem] border border-slate-200/50 bg-white shadow-xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full -ml-32 -mt-32 pointer-events-none" />

        <div className="relative w-full aspect-square bg-slate-50 rounded-[2.5rem] overflow-hidden mb-10 border border-slate-200 shadow-inner group">
          <div className="absolute inset-0 flex items-center justify-center opacity-5 text-slate-900"></div>

          <AnimatePresence>
            {game.blurredImage && (
              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={game.blurredImage}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 z-10"
                style={{ filter: `blur(${solved ? 0 : blurLevel}px)` }}
                alt="Mystery Player"
              />
            )}
          </AnimatePresence>

          {solved && (
            <div className="absolute inset-0 bg-emerald-500/10 mix-blend-overlay z-20" />
          )}

          <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[2.5rem] pointer-events-none z-30"></div>
        </div>

        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={clsx(
                  "p-5 rounded-2xl flex items-center gap-4 border text-sm font-black uppercase tracking-tight",
                  solved
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : attempts >= 8
                      ? "bg-rose-50 text-rose-700 border-rose-200"
                      : "bg-slate-50 text-slate-600 border-slate-200",
                )}
              >
                {solved ? (
                  <CheckCircleIcon className="w-6 h-6 flex-shrink-0" />
                ) : (
                  <XCircleIcon className="w-6 h-6 flex-shrink-0" />
                )}
                {feedback}
              </motion.div>
            )}
          </AnimatePresence>

          {!solved && attempts < 8 && (
            <form onSubmit={submitGuess} className="relative group">
              <input
                value={guessInput}
                onChange={(e) => setGuessInput(e.target.value)}
                className="w-full text-xl p-6 pr-32 bg-white border border-slate-200 rounded-2xl outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 text-slate-900 shadow-sm font-black placeholder:text-slate-300 transition-all uppercase"
                placeholder="Enter player identity..."
                autoFocus
              />
              <button
                type="submit"
                disabled={!guessInput.trim()}
                className="absolute right-3 top-3 bottom-3 px-8 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 disabled:opacity-30 transition-all shadow-lg"
              >
                Guess
              </button>
            </form>
          )}

          {game.teamName && attempts > 4 && !solved && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="pt-6 border-t border-slate-100 flex flex-col items-center"
            >
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">
                Decrypted Intelligence
              </span>
              <div className="flex items-center gap-3 px-6 py-3 bg-purple-50 border border-purple-200 rounded-2xl">
                <TicketIcon className="w-5 h-5 text-purple-600" />
                <span className="font-black text-purple-900 uppercase tracking-tighter">
                  Current Team: {game.teamName}
                </span>
              </div>
            </motion.div>
          )}

          {(solved || attempts >= 8) && (
            <button
              onClick={() => router.push("/minigames")}
              className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
            >
              Return to Hub
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
