'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Brain02Icon, HelpCircleIcon, Award01Icon } from 'hugeicons-react';

function WhoAmIQuizContent() {
    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const difficultyRaw = searchParams.get('difficulty') || 'CASUAL';
    const difficulty = difficultyRaw.toUpperCase() as 'CASUAL' | 'COMPETITIVE' | 'HARDCORE';

    const [quiz, setQuiz] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Game State
    const [hints, setHints] = useState<string[]>([]);
    const [visibleHints, setVisibleHints] = useState(1);
    const [userAnswer, setUserAnswer] = useState('');
    const [status, setStatus] = useState<'playing' | 'correct' | 'wrong'>('playing');
    const [resultData, setResultData] = useState<any>(null);
    const [timeElapsed, setTimeElapsed] = useState(0);

    const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!user) return;
        fetchQuiz();
    }, [user]);

    useEffect(() => {
        if (status === 'playing' && quiz) {
            const int = setInterval(() => {
                setTimeElapsed(prev => prev + 1);
            }, 1000);
            setTimerInterval(int);
            return () => clearInterval(int);
        } else if (timerInterval) {
            clearInterval(timerInterval);
        }
    }, [status, quiz]);

    const fetchQuiz = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/minigames/quiz/daily?difficulty=${difficulty}`);
            const data = await res.json();

            if (data.error) throw new Error(data.error);

            // Find first WHO_AM_I quiz or use empty
            const whoAmIQuizzes = data.data.filter((q: any) => q.type === 'WHO_AM_I');

            if (whoAmIQuizzes.length > 0) {
                const currentQuiz = whoAmIQuizzes[0];
                setQuiz(currentQuiz);

                // Parse options if it contains an array of hints
                if (currentQuiz.options && Array.isArray(currentQuiz.options)) {
                    setHints(currentQuiz.options);
                } else if (currentQuiz.question) {
                    setHints([currentQuiz.question]); // Fallback if hints aren't array
                }

                // Hardcore logic: Start with 0 hints visible, user must click to reveal first hint
                if (difficulty === 'HARDCORE') {
                    setVisibleHints(0);
                }
            } else {
                setError('No more "Who Am I?" quizzes available today in this difficulty.');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to load quiz');
        } finally {
            setLoading(false);
        }
    };

    const handleRevealHint = () => {
        if (visibleHints < hints.length) {
            setVisibleHints(prev => prev + 1);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userAnswer.trim() || status !== 'playing') return;

        try {
            const res = await fetch('/api/minigames/quiz/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    quizId: quiz.id,
                    userAnswer: userAnswer.trim(),
                    timeTaken: timeElapsed,
                    hintsUsed: visibleHints
                })
            });

            const result = await res.json();

            if (result.error) {
                alert(result.error);
                return;
            }

            setStatus(result.isCorrect ? 'correct' : 'wrong');
            setResultData(result);

        } catch (err) {
            console.error("Failed to submit:", err);
            alert("Error submitting answer.");
        }
    };

    if (loading) return <div className="text-center mt-20 text-white font-bold animate-pulse text-2xl">Loading Quiz...</div>;

    if (error) return (
        <div className="max-w-md mx-auto mt-20 text-center glass-panel p-8 rounded-3xl">
            <h2 className="text-2xl font-black text-rose-500 mb-2">Oops!</h2>
            <p className="text-emerald-800">{error}</p>
            <button
                onClick={() => router.push('/minigames/quiz-hub')}
                className="mt-6 px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold"
            >
                Back to Hub
            </button>
        </div>
    );

    if (!quiz) return null;

    const baseBgColor = difficulty === 'HARDCORE' ? 'bg-orange-50/90' : difficulty === 'COMPETITIVE' ? 'bg-blue-50/90' : 'bg-emerald-50/90';
    const accentColor = difficulty === 'HARDCORE' ? 'text-orange-600' : difficulty === 'COMPETITIVE' ? 'text-blue-600' : 'text-emerald-600';

    return (
        <div className="max-w-2xl mx-auto py-10 px-4">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-black text-emerald-900 drop-shadow-sm flex items-center gap-2">
                        <Brain02Icon size={32} className="text-emerald-500" /> Who Am I?
                    </h1>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-2 uppercase tracking-wide text-white ${difficulty === 'HARDCORE' ? 'bg-orange-500' : difficulty === 'COMPETITIVE' ? 'bg-blue-500' : 'bg-emerald-500'}`}>
                        {difficulty}
                    </span>
                </div>
                {status === 'playing' && (
                    <div className="text-right">
                        <div className="text-4xl font-black text-slate-800 tabular-nums">
                            {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}
                        </div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Time Elapsed</div>
                    </div>
                )}
            </div>

            <div className={`p-6 md:p-8 rounded-[2rem] border shadow-xl backdrop-blur-md mb-8 ${baseBgColor} border-white/50`}>
                <div className="space-y-4 mb-8">
                    {visibleHints === 0 && difficulty === 'HARDCORE' && (
                        <div className="text-center p-6 border-2 border-dashed border-orange-300 rounded-xl bg-orange-100/50">
                            <HelpCircleIcon size={48} className="mx-auto text-orange-400 mb-2 opacity-50" />
                            <p className="text-orange-800 font-bold mb-4">Hardcore Mode Active</p>
                            <button
                                onClick={handleRevealHint}
                                className="px-6 py-2 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-400 transition"
                            >
                                Reveal First Hint (-5 XP)
                            </button>
                        </div>
                    )}

                    {hints.slice(0, visibleHints).map((hint, idx) => (
                        <div
                            key={idx}
                            className="p-4 bg-white/80 rounded-xl border border-emerald-100 shadow-sm animate-in slide-in-from-left duration-500 flex items-start gap-4"
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shrink-0 ${difficulty === 'HARDCORE' ? 'bg-orange-100 text-orange-600' : difficulty === 'COMPETITIVE' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                {idx + 1}
                            </div>
                            <p className="text-slate-700 font-medium text-lg leading-relaxed pt-0.5">{hint}</p>
                        </div>
                    ))}
                </div>

                {status === 'playing' && visibleHints < hints.length && visibleHints > 0 && (
                    <button
                        onClick={handleRevealHint}
                        className="w-full py-3 mb-8 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-semibold hover:border-slate-400 hover:text-slate-600 transition-colors flex items-center justify-center gap-2"
                    >
                        <HelpCircleIcon size={20} /> Request another hint (Reduces XP)
                    </button>
                )}

                {status === 'playing' ? (
                    <form onSubmit={handleSubmit} className="relative">
                        <input
                            type="text"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            placeholder="Type player's full name..."
                            className="w-full text-xl p-4 bg-white border-2 border-emerald-200 rounded-xl outline-none focus:border-emerald-500 text-slate-800 shadow-inner font-medium placeholder:text-slate-400"
                            autoFocus
                        />
                        <button
                            type="submit"
                            disabled={!userAnswer.trim()}
                            className="absolute right-2 top-2 bottom-2 px-6 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-500 disabled:opacity-50 transition"
                        >
                            Guess
                        </button>
                    </form>
                ) : (
                    <div className={`p-6 rounded-2xl text-center border-2 animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 ${status === 'correct' ? 'bg-emerald-100 border-emerald-400 shadow-[0_0_40px_rgba(52,211,153,0.3)]' : 'bg-rose-100 border-rose-400'}`}>
                        <div className={`text-4xl mb-4 ${status === 'correct' ? 'animate-bounce' : 'animate-pulse'}`}>{status === 'correct' ? '🎉' : '❌'}</div>
                        <h2 className={`text-2xl font-black mb-2 ${status === 'correct' ? 'text-emerald-800' : 'text-rose-800'}`}>
                            {status === 'correct' ? 'Brilliant!' : 'Not Quite!'}
                        </h2>

                        <div className="text-lg text-slate-700 font-medium mb-4">
                            The correct answer was <span className="font-black text-slate-900 border-b-2 border-slate-400">{resultData?.correctAnswer}</span>
                        </div>

                        {status === 'correct' && (
                            <div className="inline-flex items-center justify-center gap-2 bg-yellow-100 border border-yellow-300 px-6 py-3 rounded-full shadow-sm mt-4">
                                <Award01Icon size={24} className="text-yellow-600" />
                                <span className="text-yellow-800 font-black text-xl">+{resultData?.xpEarned} XP</span>
                            </div>
                        )}

                        <button
                            onClick={() => router.push('/minigames/quiz-hub')}
                            className="mt-6 w-full py-4 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition"
                        >
                            Back to Quiz Hub
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function WhoAmIPage() {
    return (
        <Suspense fallback={<div className="text-center mt-20 text-white font-bold animate-pulse text-2xl">Loading Context...</div>}>
            <WhoAmIQuizContent />
        </Suspense>
    );
}
