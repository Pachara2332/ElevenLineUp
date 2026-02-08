'use client';

import { useAuth } from '@/features/auth/hooks/useAuth';
import clsx from 'clsx';

export default function LogoutButton({ className }: { className?: string }) {
    const { logout } = useAuth();

    return (
        <button
            onClick={() => logout()}
            className={clsx(
                "px-4 py-2 rounded-xl font-bold bg-red-500/80 text-white hover:bg-red-600 transition-colors shadow-lg text-sm",
                className
            )}
        >
            Logout
        </button>
    );
}
