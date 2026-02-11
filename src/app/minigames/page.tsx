"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { PlayIcon } from "@heroicons/react/24/outline";


const games = [
    {
        id: "tictactoe",
        title: "Tic-Tac-Toe",
        description: "Match players to the grid based on teams and criteria",
        color: "bg-emerald-500",
        href: "/minigames/tictactoe",
    },
    {
        id: "missing-xi",
        title: "Missing XI",
        description: "Guess the missing player from classic lineups",
        color: "bg-blue-500",
        href: "/minigames/missing-xi",
    },
    {
        id: "who-are-ya",
        title: "Who Are Ya?",
        description: "Identify the blurred player from their photo",
        color: "bg-purple-500",
        href: "/minigames/who-are-ya",
    },
];

export default function MinigamesPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-slate-900 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <header className="flex items-center justify-between mb-8">
                    {/* <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-all border border-slate-700 shadow-sm"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
          </div> */}
                    <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter">
                        Minigames
                    </h1>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {games.map((game) => (
                        <Link
                            href={game.href}
                            key={game.id}
                            className="group relative overflow-hidden rounded-3xl bg-slate-800 border border-slate-700 hover:border-slate-500 transition-all hover:scale-[1.02] hover:shadow-2xl shadow-lg"
                        >
                            <div
                                className={`absolute top-0 right-0 w-32 h-32 ${game.color} opacity-10 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity group-hover:opacity-20`}
                            />

                            <div className="p-8 flex flex-col h-full min-h-[200px]">
                                <div
                                    className={`w-12 h-12 rounded-xl ${game.color} flex items-center justify-center mb-6 text-white text-xl font-black shadow-lg`}
                                >
                                    {game.title[0]}
                                </div>

                                <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">
                                    {game.title}
                                </h2>

                                <p className="text-slate-400 font-medium text-sm leading-relaxed mb-8 flex-1">
                                    {game.description}
                                </p>

                                <div className="flex items-center text-sm font-bold text-white/50 group-hover:text-white transition-colors">
                                    Play Now
                                    <PlayIcon
                                        className="ml-2 w-4 h-4 transition-all duration-200 group-hover:scale-110 group-hover:translate-x-0.5"

                                    />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
