'use client';
import { useRouter } from 'next/navigation';

export default function QuizHubPage() {
    const router = useRouter();

    const difficultyModes = [
        {
            id: 'CASUAL',
            label: 'Casual',
            description: 'Fun & relaxed. Take your time, use unlimited hints. Good for warmups.',
            xpBase: 20,
            color: 'from-emerald-400 to-teal-500',
            icon: '☕',
            bgStyles: 'bg-emerald-50 border-emerald-200'
        },
        {
            id: 'COMPETITIVE',
            label: 'Competitive Ranked',
            description: 'Race against the clock. Fewer hints allowed. Impacts Weekly Leaderboard.',
            xpBase: 30,
            color: 'from-blue-500 to-indigo-600',
            icon: '⚔️',
            bgStyles: 'bg-blue-50 border-blue-200'
        },
        {
            id: 'HARDCORE',
            label: 'Hardcore',
            description: 'For scholars only. Obscure players, no hints, strict timer. 1-Strike and you are out.',
            xpBase: 50,
            color: 'from-orange-500 to-red-600',
            icon: '🔥',
            bgStyles: 'bg-orange-50 border-orange-200'
        }
    ];

    const quizTypes = [
        {
            id: 'who-am-i',
            name: 'Who Am I?',
            description: 'Guess the player from progressive text hints.'
        },
        {
            id: 'guess-the-player',
            name: 'Guess The Player',
            description: 'Identify the blurred or cropped image.'
        }
    ];

    const handleSelectMode = (typeId: string, difficulty: string) => {
        // e.g., /minigames/who-am-i?difficulty=HARDCORE
        router.push(`/minigames/${typeId}?difficulty=${difficulty}`);
    }

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-emerald-900 drop-shadow-sm tracking-tight mb-4">
                    Football Brain <span className="text-emerald-500">Games Hub</span>
                </h1>
                <p className="text-lg text-emerald-700 font-medium">Test your knowledge. Earn XP. Prove you're a Tactical Genius.</p>
            </div>

            <div className="space-y-12">
                {quizTypes.map((quiz) => (
                    <div key={quiz.id} className="bg-white/80 p-6 md:p-8 rounded-3xl border border-emerald-100 shadow-xl backdrop-blur-sm">
                        <div className="mb-6">
                            <h2 className="text-3xl font-black text-emerald-800">{quiz.name}</h2>
                            <p className="text-emerald-600 mt-1 font-medium">{quiz.description}</p>
                        </div>

                        <h3 className="text-sm font-bold text-emerald-900/60 uppercase tracking-widest mb-4">Select Difficulty:</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {difficultyModes.map((mode) => (
                                <button
                                    key={mode.id}
                                    onClick={() => handleSelectMode(quiz.id, mode.id)}
                                    className={`relative overflow-hidden group text-left p-5 rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-lg ${mode.bgStyles}`}
                                >
                                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${mode.color} rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity`}></div>
                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-2xl">{mode.icon}</span>
                                            <span className={`text-xs font-bold px-2 py-1 rounded-full bg-gradient-to-r ${mode.color} text-white`}>
                                                Base +{mode.xpBase} XP
                                            </span>
                                        </div>
                                        <h4 className="text-lg font-black text-slate-800 mb-1">{mode.label}</h4>
                                        <p className="text-sm text-slate-600 flex-grow font-medium leading-relaxed">{mode.description}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
