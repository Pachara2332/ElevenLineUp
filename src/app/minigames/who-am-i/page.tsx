'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { AcademicCapIcon, QuestionMarkCircleIcon, TrophyIcon, ClockIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

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

    if (loading) return <div className="text-center mt-20 text-emerald-900 font-black animate-pulse text-2xl uppercase tracking-widest">Loading Quiz...</div>;

    if (error) return (
        <div className="max-w-md mx-auto mt-20 text-center glass-panel p-10 rounded-[2.5rem] border border-slate-200">
            <h2 className="text-3xl font-black text-rose-500 mb-4 uppercase tracking-tighter">Oops!</h2>
            <p className="text-slate-600 font-medium mb-8 leading-relaxed">{error}</p>
            <button
                onClick={() => router.push('/minigames/quiz-hub')}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
            >
                Back to Hub
            </button>
        </div>
    );

    if (!quiz) return null;

    const accentColor = difficulty === 'HARDCORE' ? 'text-orange-600' : difficulty === 'COMPETITIVE' ? 'text-blue-600' : 'text-emerald-600';
    const accentBg = difficulty === 'HARDCORE' ? 'bg-orange-100' : difficulty === 'COMPETITIVE' ? 'bg-blue-100' : 'bg-emerald-100';

    return (
        <div className="max-w-2xl mx-auto py-12 px-4">
            <div className="flex justify-between items-end mb-10 pb-6 border-b border-slate-200/50">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-xl ${accentBg}`}>
                            <AcademicCapIcon className={`w-6 h-6 ${accentColor}`} />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Who Am I?</h1>
                    </div>
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-sm ${difficulty === 'HARDCORE' ? 'bg-orange-600' : difficulty === 'COMPETITIVE' ? 'bg-blue-600' : 'bg-emerald-600'}`}>
                        <SparklesIcon className="w-3 h-3" /> {difficulty}
                    </div>
                </div>
                {status === 'playing' && (
                    <div className="text-right">
                        <div className="flex items-center justify-end gap-2 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-1">
                            <ClockIcon className="w-3 h-3" /> Time
                        </div>
                        <div className="text-3xl font-black text-slate-900 tabular-nums leading-none">
                            {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}
                        </div>
                    </div>
                )}
            </div>

            <div className="glass-panel p-8 md:p-10 rounded-[3rem] border border-slate-200/50 bg-white/40 shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -mr-32 -mt-32 pointer-events-none" />
                
                <div className="space-y-6 mb-10 relative z-10">
                    {visibleHints === 0 && difficulty === 'HARDCORE' && (
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-center p-10 border-2 border-dashed border-orange-200 rounded-[2rem] bg-white/50 backdrop-blur-sm"
                        >
                            <QuestionMarkCircleIcon className="w-16 h-16 mx-auto text-orange-200 mb-4" />
                            <h3 className="text-orange-900 font-black uppercase tracking-widest text-sm mb-2">Hardcore Mode</h3>
                            <p className="text-slate-500 text-xs font-medium mb-6">The first hint is hidden. Reveal it to start your quest.</p>
                            <button
                                onClick={handleRevealHint}
                                className="px-8 py-3 bg-orange-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-100"
                            >
                                Reveal First Hint <span className="opacity-50 ml-1">(-5 XP)</span>
                            </button>
                        </motion.div>
                    )}

                    <AnimatePresence>
                        {hints.slice(0, visibleHints).map((hint, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-start gap-5 group hover:border-emerald-200 transition-colors"
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 shadow-sm ${accentBg} ${accentColor}`}>
                                    {idx + 1}
                                </div>
                                <p className="text-slate-700 font-bold text-lg leading-relaxed pt-1.5 tracking-tight">{hint}</p>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {status === 'playing' && visibleHints < hints.length && visibleHints > 0 && (
                    <button
                        onClick={handleRevealHint}
                        className="w-full py-4 mb-10 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-50 hover:border-emerald-200 hover:text-emerald-600 transition-all flex items-center justify-center gap-2"
                    >
                        <QuestionMarkCircleIcon className="w-4 h-4" /> Request Another Hint
                    </button>
                )}

                <div className="relative z-10">
                    {status === 'playing' ? (
                        <form onSubmit={handleSubmit} className="relative group">
                            <input
                                type="text"
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                                placeholder="Type player's full name..."
                                className="w-full text-xl p-6 pr-32 bg-white border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-slate-900 shadow-sm font-black placeholder:text-slate-300 transition-all"
                                autoFocus
                            />
                            <button
                                type="submit"
                                disabled={!userAnswer.trim()}
                                className="absolute right-3 top-3 bottom-3 px-8 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 disabled:opacity-30 transition-all shadow-lg"
                            >
                                Guess
                            </button>
                        </form>
                    ) : (
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={`p-10 rounded-[2.5rem] text-center border shadow-2xl ${status === 'correct' ? 'bg-emerald-50 border-emerald-200 shadow-emerald-500/10' : 'bg-rose-50 border-rose-200 shadow-rose-500/10'}`}
                        >
                            <div className={`text-6xl mb-6 ${status === 'correct' ? 'animate-bounce' : 'animate-pulse'}`}>{status === 'correct' ? '🏆' : '💔'}</div>
                            <h2 className={`text-3xl font-black mb-4 uppercase tracking-tighter ${status === 'correct' ? 'text-emerald-900' : 'text-rose-900'}`}>
                                {status === 'correct' ? 'Absolute Legend!' : 'Heartbreaker!'}
                            </h2>

                            <div className="text-slate-500 font-bold mb-8 flex flex-col items-center">
                                <span className="text-[10px] uppercase tracking-[0.3em] mb-1 opacity-50">Correct Answer</span>
                                <span className="text-2xl text-slate-900 font-black uppercase border-b-4 border-emerald-500/20 px-2">{resultData?.correctAnswer}</span>
                            </div>

                            {status === 'correct' && (
                                <div className="inline-flex flex-col items-center justify-center gap-1 bg-white border border-yellow-200 p-6 rounded-3xl shadow-xl shadow-yellow-500/5 mb-8">
                                    <div className="flex items-center gap-2">
                                        <TrophyIcon className="w-5 h-5 text-yellow-500" />
                                        <span className="text-yellow-700 font-black text-2xl">+{resultData?.xpEarned} XP</span>
                                    </div>
                                    <span className="text-[8px] font-black text-yellow-600 uppercase tracking-widest">Master of the Game</span>
                                </div>
                            )}

                            <button
                                onClick={() => router.push('/minigames/quiz-hub')}
                                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg"
                            >
                                Back to Hub
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function WhoAmIPage() {
    return (
        <Suspense fallback={<div className="text-center mt-20 text-emerald-900 font-black animate-pulse text-2xl uppercase tracking-widest">Loading...</div>}>
            <WhoAmIQuizContent />
        </Suspense>
    );
}
