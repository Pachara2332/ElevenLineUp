'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { PhotoIcon, MagnifyingGlassIcon, TrophyIcon, ClockIcon, SparklesIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

function GuessThePlayerContent() {
    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const difficultyRaw = searchParams.get('difficulty') || 'CASUAL';
    const difficulty = difficultyRaw.toUpperCase() as 'CASUAL' | 'COMPETITIVE' | 'HARDCORE';

    const [quiz, setQuiz] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Game State
    const initialBlur = difficulty === 'HARDCORE' ? 40 : difficulty === 'COMPETITIVE' ? 25 : 10;
    const [currentBlur, setCurrentBlur] = useState(initialBlur);
    const [clarityLevel, setClarityLevel] = useState(0); 

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

            // Find first IMAGE quiz
            const imageQuizzes = data.data.filter((q: any) => q.type === 'IMAGE');

            if (imageQuizzes.length > 0) {
                setQuiz(imageQuizzes[0]);
            } else {
                setError('No "Guess The Player" quizzes available today in this difficulty.');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to load quiz');
        } finally {
            setLoading(false);
        }
    };

    const handleRevealMore = () => {
        if (currentBlur > 0) {
            setCurrentBlur(prev => Math.max(0, prev - 10)); 
            setClarityLevel(prev => prev + 1);
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
                    hintsUsed: clarityLevel
                })
            });

            const result = await res.json();

            if (result.error) {
                alert(result.error);
                return;
            }

            setStatus(result.isCorrect ? 'correct' : 'wrong');
            setResultData(result);
            setCurrentBlur(0); 

        } catch (err) {
            console.error("Failed to submit:", err);
            alert("Error submitting answer.");
        }
    };

    if (loading) return <div className="text-center mt-20 text-emerald-900 font-black animate-pulse text-2xl uppercase tracking-widest">Initialising Game...</div>;

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
                            <PhotoIcon className={`w-6 h-6 ${accentColor}`} />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Guess Player</h1>
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
                
                <div className="relative w-full aspect-square md:aspect-video rounded-[2rem] overflow-hidden mb-8 bg-slate-100 shadow-inner border border-slate-200 flex items-center justify-center group">
                    {quiz.imageUrl ? (
                        <Image
                            src={quiz.imageUrl}
                            alt="Guess the player"
                            fill
                            className="object-cover transition-all duration-1000 ease-in-out"
                            style={{ filter: `blur(${currentBlur}px)` }}
                        />
                    ) : (
                        <div className="text-slate-300 font-black flex flex-col items-center gap-4">
                            <PhotoIcon className="w-20 h-20 opacity-20" />
                            <span className="text-[10px] uppercase tracking-[0.4em]">Image Unavailable</span>
                        </div>
                    )}

                    {difficulty === 'HARDCORE' && status === 'playing' && currentBlur > 0 && (
                        <div className="absolute inset-0 bg-orange-950/20 mix-blend-color-burn pointer-events-none"></div>
                    )}

                    <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[2rem] pointer-events-none"></div>
                </div>

                {status === 'playing' && currentBlur > 0 && (
                    <button
                        onClick={handleRevealMore}
                        className="w-full py-5 mb-10 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-200"
                    >
                        <MagnifyingGlassIcon className="w-4 h-4" /> Reveal More <span className="opacity-40">(-5 XP)</span>
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
                            <div className={`text-6xl mb-6 ${status === 'correct' ? 'animate-bounce' : 'animate-pulse'}`}>{status === 'correct' ? '👀' : '🌵'}</div>
                            <h2 className={`text-3xl font-black mb-4 uppercase tracking-tighter ${status === 'correct' ? 'text-emerald-900' : 'text-rose-900'}`}>
                                {status === 'correct' ? 'Eagle Vision!' : 'Close But No Cigar!'}
                            </h2>

                            <div className="text-slate-500 font-bold mb-8 flex flex-col items-center">
                                <span className="text-[10px] uppercase tracking-[0.3em] mb-1 opacity-50">Identity Revealed</span>
                                <span className="text-2xl text-slate-900 font-black uppercase border-b-4 border-emerald-500/20 px-2">{resultData?.correctAnswer}</span>
                            </div>

                            {status === 'correct' && (
                                <div className="inline-flex flex-col items-center justify-center gap-1 bg-white border border-yellow-200 p-6 rounded-3xl shadow-xl shadow-yellow-500/5 mb-8">
                                    <div className="flex items-center gap-2">
                                        <TrophyIcon className="w-5 h-5 text-yellow-500" />
                                        <span className="text-yellow-700 font-black text-2xl">+{resultData?.xpEarned} XP</span>
                                    </div>
                                    <span className="text-[8px] font-black text-yellow-600 uppercase tracking-widest">Master of the Pitch</span>
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

export default function GuessThePlayerPage() {
    return (
        <Suspense fallback={<div className="text-center mt-20 text-emerald-900 font-black animate-pulse text-2xl uppercase tracking-widest">Loading...</div>}>
            <GuessThePlayerContent />
        </Suspense>
    );
}
