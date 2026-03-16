"use client";

import Link from "next/link";
import { PhotoIcon, PuzzlePieceIcon, SparklesIcon, ChevronRightIcon, PlayIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

const games = [
  {
    id: "who-are-ya",
    title: "Who Are Ya?",
    description: "Identify the mystery player. You have 8 attempts and limited tactical data.",
    icon: PhotoIcon,
    color: "emerald",
    href: "/minigames/who-are-ya",
    stat: "Daily Player",
  },
  {
    id: "tictactoe",
    title: "Immaculate Grid",
    description: "Fill the 3x3 grid with players who meet both intersecting criteria.",
    icon: PuzzlePieceIcon,
    color: "slate",
    href: "/minigames/tictactoe",
    stat: "9 Categories",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function MinigamesPage() {
  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      {/* Hero Section */}
      <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm mb-6"
          >
            <SparklesIcon className="w-4 h-4" />
            <span>DAILY TACTICAL CHALLENGES</span>
          </motion.div>
          <h1 className="text-6xl md:text-7xl font-[900] text-slate-900 tracking-tighter mb-6 leading-[0.9]">
            The <span className="text-emerald-500">Training</span> Ground
          </h1>
          <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">
            Test your football intelligence with our daily strategy games. From identifying legends to completing tactical grids.
          </p>
      </div>

      {/* Games Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {games.map((game) => (
          <motion.div key={game.id} variants={item}>
            <Link
              href={game.href}
              className="group relative flex flex-col glass-panel rounded-[3rem] p-10 bg-white border border-slate-200 hover:border-emerald-400 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-100 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -mr-32 -mt-32 transition-transform duration-700 group-hover:scale-125 group-hover:bg-emerald-500/10" />
              
              <div className="relative mb-8 flex justify-between items-start">
                  <div className={`p-5 rounded-[1.5rem] bg-${game.color === 'emerald' ? 'emerald' : 'slate'}-100 group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                    <game.icon className={`w-10 h-10 text-${game.color === 'emerald' ? 'emerald' : 'slate'}-600`} />
                  </div>
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                    {game.stat}
                  </div>
              </div>

              <div className="relative flex-1">
                <h3 className="text-4xl font-black text-slate-900 tracking-tight mb-4 group-hover:text-emerald-600 transition-colors">
                  {game.title}
                </h3>
                <p className="text-lg text-slate-500 font-medium leading-relaxed group-hover:text-slate-600 transition-colors">
                  {game.description}
                </p>
              </div>

              <div className="relative mt-10 pt-8 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3 text-emerald-600 font-black uppercase tracking-widest text-sm translate-x-0 group-hover:translate-x-2 transition-transform duration-500">
                  <span>DEPLOY NOW</span>
                  <PlayIcon className="w-5 h-5" />
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                  <ChevronRightIcon className="w-6 h-6" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Footer / Stats Mention */}
      <div className="mt-24 text-center">
          <div className="inline-grid grid-cols-3 gap-12 md:gap-24">
              <div>
                  <div className="text-3xl font-black text-slate-900 tracking-tighter">10K+</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Managers</div>
              </div>
              <div>
                  <div className="text-3xl font-black text-slate-900 tracking-tighter">DAILY</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">New Challenges</div>
              </div>
              <div>
                  <div className="text-3xl font-black text-slate-900 tracking-tighter">GLOBAL</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Leaderboards</div>
              </div>
          </div>
      </div>
    </div>
  );
}
