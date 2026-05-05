'use client';

import { useState, useEffect, useRef } from 'react';
import { BellIcon } from '@heroicons/react/24/solid';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { io } from 'socket.io-client';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface Notification {
    id: string;
    type: 'LIKE' | 'COMMENT' | 'FOLLOW' | 'POLL_VOTE';
    message?: string;
    entityId?: string | null;
    isRead: boolean;
    createdAt: string;
    actor: {
        name: string;
        username?: string | null;
        avatar: string | null;
    };
    post?: {
        id: string;
        content?: string;
        imageUrl?: string | null;
        author?: {
            name: string;
            username?: string | null;
        };
    } | null;
}

const getNotificationCopy = (notification: Notification) => {
    if (notification.message) return notification.message;

    switch (notification.type) {
        case 'LIKE':
            return 'liked your post';
        case 'COMMENT':
            return 'commented on your post';
        case 'FOLLOW':
            return 'started following you';
        case 'POLL_VOTE':
            return 'voted on your poll';
        default:
            return 'interacted with you';
    }
};

const getNotificationTitle = (notification: Notification) => {
    switch (notification.type) {
        case 'LIKE':
            return 'New like';
        case 'COMMENT':
            return 'New comment';
        case 'FOLLOW':
            return 'New follower';
        case 'POLL_VOTE':
            return 'Poll activity';
        default:
            return 'Community update';
    }
};

export default function NotificationDropdown() {
    const { user } = useAuth();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();

    // Fetch notifications
    const { data: notifications = [] } = useQuery({
        queryKey: ['notifications'],
        queryFn: async () => {
            const res = await fetch('/api/notifications');
            if (!res.ok) throw new Error('Failed to fetch notifications');
            const data = await res.json();
            return (Array.isArray(data) ? data : data.data?.notifications ?? []) as Notification[];
        },
        enabled: Boolean(user),
    });

    // Socket.IO Connection
    useEffect(() => {
        if (!user) return;

        const socket = io();

        socket.on('connect', () => {
            console.log('Connected to socket server');
            socket.emit('join', `user-${user.userId}`);
        });

        socket.on('notification', (newNotification: Notification) => {
            console.log('Received notification:', newNotification);
            queryClient.setQueryData<Notification[]>(['notifications'], (current = []) => [
                newNotification,
                ...current.filter((notification) => notification.id !== newNotification.id),
            ]);
        });

        return () => {
            socket.disconnect();
        };
    }, [user, queryClient]);

    // ... rest of component


    const unreadCount = notifications.filter((n: Notification) => !n.isRead).length;

    // Mark as read mutation
    const readMutation = useMutation({
        mutationFn: async (id: string) => {
            await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }
    });

    const handleRead = (notification: Notification) => {
        if (!notification.isRead) {
            readMutation.mutate(notification.id);
        }
        setIsOpen(false);
        const postId = notification.post?.id || notification.entityId;
        if (postId && (notification.type === 'LIKE' || notification.type === 'COMMENT')) {
            router.push(`/community#post-${postId}`);
        }
    };

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full text-emerald-800 hover:bg-emerald-100/50 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
            >
                <BellIcon className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 inline-flex items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white border-2 border-white shadow-sm">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-[min(22rem,calc(100vw-2rem))] md:w-96 bg-white rounded-2xl shadow-2xl shadow-emerald-950/10 border border-emerald-100 overflow-hidden z-50">
                    <div className="p-4 border-b border-emerald-100 flex justify-between items-center bg-emerald-50/70">
                        <div>
                            <h3 className="font-black text-emerald-950">Notifications</h3>
                            <p className="text-xs font-medium text-emerald-800/60">Likes, comments, and community activity</p>
                        </div>
                        {unreadCount > 0 && (
                            <span className="text-xs font-bold text-white bg-emerald-500 px-2 py-0.5 rounded-full">
                                {unreadCount} new
                            </span>
                        )}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-400 text-sm">
                                <BellIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                No notifications yet
                            </div>
                        ) : (
                            notifications.map((notification: Notification) => (
                                <button
                                    key={notification.id}
                                    onClick={() => handleRead(notification)}
                                    className={`w-full text-left p-4 flex gap-3 hover:bg-emerald-50/70 transition-colors border-b border-emerald-50 last:border-0 ${!notification.isRead ? 'bg-emerald-50/50' : ''
                                        }`}
                                >
                                    <div className="shrink-0">
                                        <div className="w-10 h-10 rounded-full overflow-hidden border border-emerald-100 bg-emerald-100">
                                            {notification.actor.avatar ? (
                                                <img
                                                    src={notification.actor.avatar}
                                                    alt={notification.actor.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm">
                                                    {notification.actor.name.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[11px] font-black uppercase tracking-wide text-emerald-600">
                                            {getNotificationTitle(notification)}
                                        </p>
                                        <p className="text-sm text-gray-800 break-words leading-snug">
                                            <span className="font-bold text-emerald-950">{notification.actor.name}</span>{' '}
                                            {getNotificationCopy(notification)}
                                        </p>
                                        {notification.post?.content && (
                                            <p className="mt-1 truncate rounded-lg bg-white px-2 py-1 text-xs font-medium text-slate-500 ring-1 ring-emerald-100">
                                                &quot;{notification.post.content}&quot;
                                            </p>
                                        )}
                                        <p className="text-xs text-gray-400 mt-1 font-medium">
                                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                        </p>
                                    </div>
                                    {!notification.isRead && (
                                        <div className="shrink-0 self-center">
                                            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                                        </div>
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
