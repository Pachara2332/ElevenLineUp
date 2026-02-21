'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import io, { Socket } from 'socket.io-client';
import { formatDistanceToNow } from 'date-fns';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

type MatchMessage = {
    id: string;
    content: string;
    createdAt: string;
    userId: string;
    user: {
        name: string;
        avatar: string | null;
    };
};

export default function LiveMatchThread({ fixtureId }: { fixtureId: string }) {
    const { user } = useAuth();
    const [messages, setMessages] = useState<MatchMessage[]>([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom of chat
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => scrollToBottom, [messages]);

    useEffect(() => {
        if (!user) return;

        // Load initial history
        let isMounted = true;
        fetch(`/api/match/${fixtureId}/thread`)
            .then(r => r.json())
            .then(data => {
                if (data.success && isMounted) {
                    setMessages(data.messages);
                }
            })
            .finally(() => { if (isMounted) setLoading(false); });

        // Connect to WebSocket namespace `/match`
        const newSocket = io('/match', {
            path: '/socket.io',
        });

        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected to Live Match Thread');
            newSocket.emit('join_match', fixtureId);
        });

        newSocket.on('new_message', (msg: MatchMessage) => {
            if (isMounted) {
                setMessages(prev => [...prev, msg]);
            }
        });

        return () => {
            isMounted = false;
            newSocket.disconnect();
        };
    }, [user, fixtureId]);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim() || !user) return;

        const content = inputText;
        setInputText('');

        try {
            await fetch(`/api/match/${fixtureId}/thread`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content })
            });
            // Do not append optimistically to avoid duplicates.
            // We will wait for `new_message` to bounce back from the server.
        } catch (err) {
            console.error(err);
            setInputText(content); // Revert on fail
        }
    };

    if (!user) return <div className="text-center p-4">Please log in to join the live thread.</div>;

    return (
        <div className="flex flex-col h-[600px] max-h-[80vh] bg-white rounded-3xl shadow-xl overflow-hidden border border-emerald-100">
            <div className="bg-emerald-800 p-4 text-white flex justify-between items-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white to-transparent"></div>
                <div className="relative z-10">
                    <h2 className="font-black text-xl uppercase tracking-tighter">Live Match Thread</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
                        <p className="text-xs font-bold text-emerald-100">{messages.length} messages</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-emerald-50/30">
                {loading ? (
                    <div className="text-center text-emerald-600 animate-pulse text-sm mt-10">Loading chat history...</div>
                ) : messages.length === 0 ? (
                    <div className="text-center text-gray-500 text-sm mt-12 flex flex-col items-center justify-center opacity-70">
                        <div className="text-5xl mb-3 animate-pulse">📢</div>
                        <p className="font-bold text-emerald-800 text-lg">The stands are quiet...</p>
                        <p className="text-emerald-600">Give a shout to start the chant!</p>
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        const isMe = msg.userId === user.userId;
                        let showTime = index === 0;
                        if (index > 0 && messages[index - 1]) {
                            const prevTime = new Date(messages[index - 1].createdAt).getTime();
                            const currTime = new Date(msg.createdAt).getTime();
                            if (currTime - prevTime > 1000 * 60 * 5) { // 5 mins
                                showTime = true;
                            }
                        }

                        return (
                            <div key={msg.id} className="flex flex-col">
                                {showTime && (
                                    <span className="text-[10px] text-center text-gray-400 font-bold mb-2">
                                        {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                                    </span>
                                )}
                                <div className={`flex gap-3 max-w-[85%] ${isMe ? 'self-end flex-row-reverse' : 'self-start'}`}>
                                    {!isMe && (
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold shrink-0 text-sm shadow-sm">
                                            {msg.user.avatar ? (
                                                <img src={msg.user.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                msg.user.name.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                    )}

                                    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                        {!isMe && <span className="text-xs text-gray-500 font-bold ml-1 mb-1">{msg.user.name}</span>}
                                        <div className={`px-4 py-2.5 rounded-2xl shadow-sm ${isMe
                                            ? 'bg-emerald-600 text-white rounded-tr-sm'
                                            : 'bg-white text-emerald-950 border border-emerald-100 rounded-tl-sm'
                                            }`}>
                                            <p className="text-sm break-words">{msg.content}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t border-emerald-100">
                <form onSubmit={sendMessage} className="flex gap-2">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Shout your reaction..."
                        className="flex-1 bg-emerald-50 border-none rounded-full px-5 py-3 text-sm focus:ring-2 focus:ring-emerald-500/50 focus:bg-white transition-colors"
                        maxLength={300}
                    />
                    <button
                        type="submit"
                        disabled={!inputText.trim()}
                        className="w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                    >
                        <PaperAirplaneIcon className="w-5 h-5 -ml-0.5" />
                    </button>
                </form>
            </div>
        </div>
    );
}
