"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import clsx from "clsx";

export default function WhoAreYaPage() {
  const router = useRouter();
  const { data: game, isLoading } = useQuery({
    queryKey: ["who-are-ya"],
    queryFn: async () => {
      const res = await fetch("/api/minigames/who-are-ya");
      if (!res.ok) throw new Error("No game");
      return (await res.json()).data;
    },
  });

  const [attempts, setAttempts] = useState(0);
  const [solved, setSolved] = useState(false);
  const [blurLevel, setBlurLevel] = useState(20); // Initial blur
  const [guessInput, setGuessInput] = useState("");
  const [feedback, setFeedback] = useState("");

  const submitGuess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guessInput.trim()) return;

    const res = await fetch("/api/minigames/who-are-ya", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gameId: game.id,
        guess: guessInput,
      }),
    });
    const json = await res.json();

    if (json.correct) {
      setSolved(true);
      setBlurLevel(0);
      setFeedback(`Correct! It was ${json.real_name}`);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setFeedback("Incorrect! Try again.");
      setGuessInput("");
      // Reduce blur
      setBlurLevel(Math.max(0, 20 - newAttempts * 2.5));

      if (newAttempts >= 8) {
        setFeedback("Game Over! Run out of attempts.");
        setBlurLevel(0); // Reveal on fail
      }
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center">
        <div className="text-emerald-500 text-xl font-bold animate-pulse">
          Loading Mystery Player...
        </div>
      </div>
    );

  if (!game)
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center">
        <div className="text-slate-400 text-xl font-bold">No Game Today</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-4 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-lg flex justify-between items-center mb-6 mt-4">
        <button
          onClick={() => router.push("/minigames")}
          className="text-slate-500 hover:text-white transition-colors text-sm font-bold flex items-center gap-2"
        >
          ← Back
        </button>
        <div className="font-black text-xl text-white tracking-widest uppercase">
          WHO ARE YA?
        </div>
        <div className="text-xs font-bold bg-slate-800 px-3 py-1 rounded-full text-slate-400 border border-slate-700">
          {attempts}/8 Tries
        </div>
      </div>

      <div className="w-full max-w-lg bg-slate-800 rounded-3xl overflow-hidden shadow-2xl border border-slate-700 ring-1 ring-white/10">
        {/* Image Area */}
        <div className="relative aspect-square bg-slate-900 overflow-hidden group">
          <img
            src={game.image_url}
            className="w-full h-full object-cover transition-all duration-1000 scale-105"
            style={{ filter: `blur(${solved ? 0 : blurLevel}px)` }}
            alt="Mystery Player"
          />

          {/* Overlay for "Solved" */}
          {solved && (
            <div className="absolute inset-x-0 bottom-0 bg-emerald-600/90 p-6 text-center backdrop-blur-md animate-in slide-in-from-bottom">
              <div className="text-white font-black text-3xl uppercase tracking-tighter drop-shadow-md">
                Correct!
              </div>
              <div className="text-emerald-100 font-bold mt-1 text-lg">
                {feedback.replace("Correct! It was ", "")}
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="p-8">
          {feedback && !solved && (
            <div
              className={clsx(
                "mb-6 p-4 rounded-xl text-center font-bold text-sm border-l-4 animate-in fade-in slide-in-from-top-2",
                "bg-red-900/40 text-red-200 border-red-500",
              )}
            >
              {feedback}
            </div>
          )}

          {!solved && attempts < 8 && (
            <form onSubmit={submitGuess} className="flex flex-col gap-4">
              <input
                value={guessInput}
                onChange={(e) => setGuessInput(e.target.value)}
                className="w-full p-4 bg-slate-900 border border-slate-700 rounded-xl font-bold text-lg outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-white placeholder:text-slate-600"
                placeholder="Who is this player?"
                autoFocus
              />
              <button
                type="submit"
                className="w-full bg-emerald-600 text-white font-black uppercase py-4 rounded-xl hover:bg-emerald-500 active:scale-95 transition-all shadow-lg shadow-emerald-900/20"
              >
                Guess
              </button>
            </form>
          )}

          {/* Hints Area */}
          <div className="mt-8 grid grid-cols-3 gap-3">
            <div className="bg-slate-900 p-3 rounded-xl text-center border border-slate-700">
              <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">
                Nationality
              </div>
              <div
                className={clsx(
                  "font-bold text-sm",
                  attempts > 2 ? "text-emerald-400" : "text-slate-700 blur-sm",
                )}
              >
                {game.hints.nationality}
              </div>
            </div>
            <div className="bg-slate-900 p-3 rounded-xl text-center border border-slate-700">
              <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">
                Position
              </div>
              <div
                className={clsx(
                  "font-bold text-sm",
                  attempts > 4 ? "text-emerald-400" : "text-slate-700 blur-sm",
                )}
              >
                {game.hints.position}
              </div>
            </div>
            <div className="bg-slate-900 p-3 rounded-xl text-center border border-slate-700">
              <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">
                Club
              </div>
              <div
                className={clsx(
                  "font-bold text-sm",
                  attempts > 6 ? "text-emerald-400" : "text-slate-700 blur-sm",
                )}
              >
                {game.hints.club}
              </div>
            </div>
          </div>
          <div className="text-center mt-4 text-xs text-slate-600 font-medium italic">
            Hints reveal automatically as you guess
          </div>
        </div>
      </div>
    </div>
  );
}
