'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { BellIcon } from '@heroicons/react/24/outline';
import { BellIcon as BellIconSolid } from '@heroicons/react/24/solid';
import io from 'socket.io-client';

type Notification = {
    id: string;
    type: string;
    isRead: boolean;
    createdAt: string;
    entityId?: string | null;
    actor: {
        name: string;
        username?: string | null;
        avatar: string | null;
    };
    post?: {
        id: string;
        content?: string;
    } | null;
};

export default function NotificationBell() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!user) return;

        const fetchNotifications = async () => {
            try {
                const res = await fetch('/api/notifications');
                const data = await res.json();
                if (data.success) {
                    setNotifications(data.data?.notifications ?? []);
                    setUnreadCount(data.data?.unreadCount ?? 0);
                }
            } catch (err) {
                console.error('Failed to fetch notifications', err);
            }
        };

        fetchNotifications();

        // Socket.IO for real-time notifications
        const socket = io({
            path: '/socket.io',
        });

        socket.on('connect', () => {
            console.log('Notification socket connected:', socket.id);
            // Join user room once connected
            socket.emit('join', `user-${user.userId}`);
        });

        // Listen for new notifications
        socket.on('notification', (notification: Notification) => {
            console.log('Received notification:', notification);
            setNotifications(prev => [notification, ...prev]);
            setUnreadCount(prev => prev + 1);
        });

        socket.on('connect_error', (err) => {
            console.error('Notification socket error:', err);
        });

        return () => {
            socket.disconnect();
        };
    }, [user]);

    // Handle clicking outside to close
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    const markAsRead = async (id: string) => {
        try {
            await fetch('/api/notifications', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notificationId: id })
            });
            setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error(err);
        }
    };

    const markAllAsRead = async () => {
        try {
            await fetch('/api/notifications?action=markAllRead', { method: 'PUT' });
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error(err);
        }
    };

    const getMessage = (n: Notification) => {
        switch (n.type) {
            case 'LIKE': return 'liked your post';
            case 'COMMENT': return 'commented on your post';
            case 'FOLLOW': return 'started following you';
            case 'POLL_VOTE': return 'voted on your poll';
            default: return 'interacted with you';
        }
    };

    if (!user) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-white/20 transition-colors text-emerald-900 focus:outline-none"
            >
                {unreadCount > 0 ? (
                    <>
                        <BellIconSolid className="w-6 h-6 animate-pulse text-emerald-800" />
                        <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -translate-y-1 translate-x-1">
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                    </>
                ) : (
                    <BellIcon className="w-6 h-6" />
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl shadow-emerald-900/10 border border-emerald-100 z-50 overflow-hidden origin-top-right animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-4 bg-emerald-50 border-b border-emerald-100 flex justify-between items-center">
                        <h3 className="font-bold text-emerald-900">Notifications</h3>
                        {unreadCount > 0 && (
                            <button onClick={markAllAsRead} className="text-xs text-emerald-600 font-semibold hover:text-emerald-800 transition">
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 text-sm">
                                No notifications yet. Go be active!
                            </div>
                        ) : (
                            <ul className="divide-y divide-emerald-50">
                                {notifications.map((n) => (
                                    <li
                                        key={n.id}
                                        className={`p-4 hover:bg-emerald-50/50 transition cursor-pointer flex gap-3 ${!n.isRead ? 'bg-emerald-50/80' : ''}`}
                                        onClick={() => { if (!n.isRead) markAsRead(n.id); }}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold shrink-0">
                                            {n.actor.avatar ? (
                                                <img src={n.actor.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                n.actor.name.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-800">
                                                <span className="font-bold text-emerald-900">{n.actor.name}</span> {getMessage(n)}
                                            </p>
                                            {n.post?.content && (
                                                <p className="mt-1 truncate rounded-lg bg-white px-2 py-1 text-xs text-slate-500 ring-1 ring-emerald-100">
                                                    &quot;{n.post.content}&quot;
                                                </p>
                                            )}
                                            <p className="text-xs text-emerald-600/70 mt-1">
                                                {new Date(n.createdAt).toLocaleDateString()} {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                        {!n.isRead && (
                                            <div className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-2 self-start shadow-sm" />
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="p-3 bg-gray-50 text-center border-t border-gray-100 flex justify-center">
                        <Link href="/dashboard" className="text-sm font-semibold text-emerald-700 hover:text-emerald-900 transition">
                            View Profile
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
