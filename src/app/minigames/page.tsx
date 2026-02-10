"use client";

import { useRouter } from "next/navigation";

export default function MiniGamesPage() {
  const router = useRouter();

  const games = [
    {
      id: "tictactoe",
      title: "Football Tic-Tac-Toe",
      description:
        "The ultimate grid challenge. Match players to teams and criteria.",
      icon: "❌⭕",
      path: "/minigames/tictactoe",
      bgColor: "bg-emerald-900/20",
      borderColor: "border-emerald-500/30",
      hoverBorder: "group-hover:border-emerald-400",
      iconColor: "text-emerald-400",
    },
    {
      id: "missing-xi",
      title: "Missing XI",
      description: "Can you name the players missing from this classic lineup?",
      icon: "👕",
      path: "/minigames/missing-xi",
      bgColor: "bg-blue-900/20",
      borderColor: "border-blue-500/30",
      hoverBorder: "group-hover:border-blue-400",
      iconColor: "text-blue-400",
    },
    {
      id: "who-are-ya",
      title: "Who Are Ya?",
      description:
        "Guess the player from the blurred image. You have 8 attempts!",
      icon: "🕵️",
      path: "/minigames/who-are-ya",
      bgColor: "bg-purple-900/20",
      borderColor: "border-purple-500/30",
      hoverBorder: "group-hover:border-purple-400",
      iconColor: "text-purple-400",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-4 md:p-8 flex flex-col items-center">
      {/* Header - No Navbar */}
      <header className="max-w-4xl mx-auto mb-12 text-center mt-8">
        <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow-lg mb-4 tracking-tight">
          Mini <span className="text-emerald-400">Games</span> Arena
        </h1>
        <p className="text-slate-400 text-lg font-medium">
          Test your football knowledge with our daily challenges
        </p>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {games.map((game) => (
          <div
            key={game.id}
            onClick={() => router.push(game.path)}
            className={`
              relative overflow-hidden rounded-3xl p-8 cursor-pointer transition-all duration-300 group
              bg-slate-800/50 backdrop-blur-sm border ${game.borderColor} ${game.hoverBorder}
              hover:bg-slate-800 hover:shadow-2xl hover:scale-[1.02]
            `}
          >
            {/* Glow Effect */}
            <div
              className={`absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 rounded-full blur-3xl opacity-20 ${game.bgColor.replace("/20", "")}`}
            ></div>

            <div className="relative z-10 flex flex-col items-center text-center h-full">
              <div
                className={`text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300 ${game.iconColor} drop-shadow-md`}
              >
                {game.icon}
              </div>

              <h2 className="text-2xl font-black text-white mb-3 tracking-wide group-hover:text-emerald-300 transition-colors">
                {game.title}
              </h2>

              <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8 flex-grow">
                {game.description}
              </p>

              <span className="inline-block px-8 py-3 rounded-xl bg-slate-700/50 text-slate-300 font-bold text-xs uppercase tracking-wider group-hover:bg-white group-hover:text-slate-900 transition-all shadow-lg border border-white/5">
                Play Now
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <button
          onClick={() => router.push("/dashboard")}
          className="text-slate-500 hover:text-white transition-colors text-sm font-bold flex items-center gap-2"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}
