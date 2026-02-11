'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { useAuth } from '@/features/auth/hooks/useAuth';

interface PollOption {
    id: string;
    text: string;
    _count: {
        votes: number;
    };
}

interface Poll {
    id: string;
    question: string;
    options: PollOption[];
    expiresAt: string | null;
    creator: {
        name: string;
        avatar: string | null;
    };
    _count: {
        votes: number;
    };
}

interface PollCardProps {
    poll: Poll;
    userVotedOptionId?: string | null; // ID of the option user voted for, null if not voted
}

export default function PollCard({ poll, userVotedOptionId = null }: PollCardProps) {
    const { user } = useAuth();
    const [votedOption, setVotedOption] = useState<string | null>(userVotedOptionId);
    const [isVoting, setIsVoting] = useState(false);
    const [localPoll, setLocalPoll] = useState(poll);

    const totalVotes = localPoll._count.votes;
    const isExpired = poll.expiresAt ? new Date(poll.expiresAt) < new Date() : false;
    const showResults = votedOption !== null || isExpired;

    const handleVote = async (optionId: string) => {
        if (votedOption || isVoting || isExpired) return;

        setIsVoting(true);
        try {
            const res = await fetch(`/api/community/polls/${poll.id}/vote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ optionId }),
            });

            if (res.ok) {
                setVotedOption(optionId);
                // Optimistically update UI
                setLocalPoll(prev => ({
                    ...prev,
                    _count: { votes: prev._count.votes + 1 },
                    options: prev.options.map(opt =>
                        opt.id === optionId
                            ? { ...opt, _count: { votes: opt._count.votes + 1 } }
                            : opt
                    )
                }));
            } else {
                console.error('Failed to vote');
            }
        } catch (error) {
            console.error('Error voting:', error);
        } finally {
            setIsVoting(false);
        }
    };

    return (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold text-xs ring-2 ring-emerald-500/20">
                    {poll.creator.avatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={poll.creator.avatar} alt={poll.creator.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                        poll.creator.name.charAt(0).toUpperCase()
                    )}
                </div>
                <div>
                    <h3 className="text-emerald-900 font-bold text-lg leading-tight">{poll.question}</h3>
                    <p className="text-xs text-emerald-700/60 font-medium">
                        Posted by {poll.creator.name} • {totalVotes} votes • {isExpired ? 'Ended' : 'Active'}
                    </p>
                </div>
            </div>

            <div className="space-y-3">
                {localPoll.options.map((option) => {
                    const percentage = totalVotes > 0 ? Math.round((option._count.votes / totalVotes) * 100) : 0;
                    const isSelected = votedOption === option.id;

                    return (
                        <button
                            key={option.id}
                            onClick={() => handleVote(option.id)}
                            disabled={showResults || isVoting}
                            className={clsx(
                                "relative w-full text-left p-3 rounded-xl border transition-all overflow-hidden group",
                                showResults
                                    ? "border-transparent bg-emerald-50/50"
                                    : "border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50 bg-white/40"
                            )}
                        >
                            {/* Progress Bar Background */}
                            {showResults && (
                                <div
                                    className={clsx(
                                        "absolute top-0 left-0 h-full transition-all duration-1000 ease-out opacity-20",
                                        isSelected ? "bg-emerald-500" : "bg-emerald-300"
                                    )}
                                    style={{ width: `${percentage}%` }}
                                />
                            )}

                            <div className="relative z-10 flex justify-between items-center">
                                <span className={clsx(
                                    "font-medium transition-colors",
                                    isSelected ? "text-emerald-800" : "text-emerald-700"
                                )}>
                                    {option.text}
                                    {isSelected && <span className="ml-2 text-xs bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded-full">You</span>}
                                </span>

                                {showResults && (
                                    <span className="text-sm font-bold text-emerald-800">
                                        {percentage}%
                                    </span>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
