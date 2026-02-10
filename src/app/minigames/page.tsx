'use client';

import { useRouter } from 'next/navigation';

export default function MiniGamesPage() {
    const router = useRouter();

    const games = [
        {
            id: 'tictactoe',
            title: 'Football Tic-Tac-Toe',
            description: 'The ultimate grid challenge. Match players to teams and criteria.',
            icon: '❌⭕',
            color: 'bg-emerald-600',
            path: '/minigames/tictactoe'
        },
        {
            id: 'missing-xi',
            title: 'Missing XI',
            description: 'Can you name the players missing from this classic lineup?',
            icon: '👕',
            color: 'bg-blue-600',
            path: '/minigames/missing-xi'
        },
        {
            id: 'who-are-ya',
            title: 'Who Are Ya?',
            description: 'Guess the player from the blurred image. You have 8 attempts!',
            icon: '🕵️',
            color: 'bg-indigo-600',
            path: '/minigames/who-are-ya'
        }
    ];

    return (
        <div className="min-h-screen p-4 md:p-8">


            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                {games.map((game) => (
                    <div
                        key={game.id}
                        onClick={() => router.push(game.path)}
                        className="glass-panel p-8 rounded-3xl cursor-pointer hover:scale-105 transition-transform duration-300 group relative overflow-hidden"
                    >
                        <div className={`absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity ${game.color}`}></div>

                        <div className="text-6xl mb-6 text-center">{game.icon}</div>

                        <h2 className="text-2xl font-bold text-emerald-900 text-center mb-3 group-hover:text-emerald-700 transition-colors">
                            {game.title}
                        </h2>

                        <p className="text-emerald-800/70 text-center text-sm font-medium leading-relaxed">
                            {game.description}
                        </p>

                        <div className="mt-8 text-center">
                            <span className="inline-block px-6 py-2 rounded-full bg-white/40 text-emerald-900 font-bold text-sm uppercase tracking-wider border border-white/20 group-hover:bg-white/60 transition-colors">
                                Play Now
                            </span>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}
