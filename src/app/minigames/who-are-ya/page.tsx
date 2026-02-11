"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import Navbar from "@/components/Navbar";

interface Game {
  id: string;
  blurredImage: string;
  teamName?: string;
}

export default function WhoAreYaPage() {
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
  const [blurLevel, setBlurLevel] = useState(20);
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
      setFeedback(`Correct! It was ${json.playerName}`);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setFeedback("Incorrect! Try again.");
      setGuessInput("");
      setBlurLevel(Math.max(0, 20 - newAttempts * 2.5));

      if (newAttempts >= 8) {
        setFeedback("Game Over! Run out of attempts.");
        setBlurLevel(0);
      }
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar title="Who Are Ya?" subtitle="Guess the mystery player" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-emerald-600 text-xl font-bold animate-pulse">
            Loading Mystery Player...
          </div>
        </div>
      </div>
    );

  if (!game)
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar title="Who Are Ya?" subtitle="Guess the mystery player" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500 text-xl font-bold">No Game Today</div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar title="Who Are Ya?" subtitle="Guess the mystery player" />

      <div className="px-4 md:px-8 pb-8 flex-1">
        <div className="max-w-2xl mx-auto">
          {/* Stats Header */}
          <div className="glass-panel rounded-3xl p-6 mb-6 flex items-center justify-between">
            <div className="text-center">
              <div
                className={clsx(
                  "text-4xl font-black",
                  attempts >= 7 ? "text-red-600" : "text-purple-600"
                )}
              >
                {attempts}/8
              </div>
              <div className="text-xs font-bold text-emerald-700 uppercase">
                Attempts
              </div>
            </div>

            {solved && (
              <div className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-black text-lg animate-in zoom-in">
                🎉 CORRECT!
              </div>
            )}

            {attempts >= 8 && !solved && (
              <div className="bg-red-600 text-white px-6 py-3 rounded-xl font-black text-lg animate-in zoom-in">
                ❌ GAME OVER
              </div>
            )}
          </div>

          {/* Image Card */}
          <div className="glass-panel rounded-3xl overflow-hidden shadow-xl relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none z-10" />

            <div className="relative aspect-square bg-gradient-to-br from-purple-100 to-pink-100 overflow-hidden">
              <img
                src={game.blurredImage}
                className="w-full h-full object-cover transition-all duration-1000"
                style={{ filter: `blur(${solved ? 0 : blurLevel}px)` }}
                alt="Mystery Player"
              />

              {solved && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-emerald-600 to-transparent p-8 text-center backdrop-blur-sm animate-in slide-in-from-bottom">
                  <div className="text-white font-black text-3xl uppercase drop-shadow-lg">
                    Correct!
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="p-6 md:p-8 bg-white/40">
              {feedback && (
                <div
                  className={clsx(
                    "mb-6 p-4 rounded-xl text-center font-bold text-sm shadow-sm",
                    solved
                      ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-300"
                      : "bg-red-100 text-red-700 border-2 border-red-300"
                  )}
                >
                  {feedback}
                </div>
              )}

              {!solved && attempts < 8 && (
                <form onSubmit={submitGuess} className="flex gap-3">
                  <input
                    value={guessInput}
                    onChange={(e) => setGuessInput(e.target.value)}
                    className="flex-1 p-4 bg-white border-2 border-emerald-200 rounded-xl font-bold text-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-300 transition-all text-emerald-900 placeholder:text-emerald-400"
                    placeholder="Type player name..."
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="bg-gradient-to-br from-purple-600 to-pink-600 text-white font-black uppercase px-8 rounded-xl hover:from-purple-700 hover:to-pink-700 active:scale-95 transition-all shadow-lg"
                  >
                    Guess
                  </button>
                </form>
              )}

              {game.teamName && attempts > 4 && !solved && (
                <div className="mt-6 text-center animate-in fade-in">
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block mb-2">
                    💡 HINT: TEAM
                  </span>
                  <div className="font-black text-purple-700 text-xl bg-white inline-block px-6 py-2 rounded-xl border-2 border-purple-300 shadow-md">
                    {game.teamName}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
