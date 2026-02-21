'use client';

import { useState, useEffect, useRef } from 'react';
import { BellIcon } from '@heroicons/react/24/solid';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { io } from 'socket.io-client';
import { useAuth } from '@/features/auth/hooks/useAuth';

interface Notification {
    id: string;
    type: 'LIKE' | 'COMMENT';
    message: string;
    isRead: boolean;
    createdAt: string;
    actor: {
        name: string;
        avatar: string | null;
    };
    post: {
        id: string;
    } | null;
}

export default function NotificationDropdown() {
    const { user } = useAuth();
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
    });

    // Socket.IO Connection
    useEffect(() => {
        if (!user) return;

        const socket = io();

        socket.on('connect', () => {
            console.log('Connected to socket server');
            socket.emit('join', user.userId);
        });

        socket.on('notification', (newNotification: any) => {
            console.log('Received notification:', newNotification);
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            // Optional: Show toast/sound
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
        // Navigate or do something
        if (notification.post?.id) {
            window.location.href = `/community#post-${notification.post.id}`;
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
                className="relative p-2 rounded-full text-emerald-800 hover:bg-emerald-100/50 transition-colors"
            >
                <BellIcon className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h3 className="font-bold text-gray-800">Notifications</h3>
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
                                    className={`w-full text-left p-4 flex gap-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 ${!notification.isRead ? 'bg-emerald-50/30' : ''
                                        }`}
                                >
                                    <div className="shrink-0">
                                        <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100">
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
                                        <p className="text-sm text-gray-800 break-words leading-snug">
                                            <span className="font-bold">{notification.actor.name}</span>{' '}
                                            {notification.message}
                                        </p>
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
