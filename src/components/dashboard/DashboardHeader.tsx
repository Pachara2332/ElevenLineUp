'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import LogoutButton from '@/components/LogoutButton';
import ProfileDrawer from '@/app/dashboard/ProfileDrawer';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

export default function DashboardHeader() {
    const { user, isLoading } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const [openProfile, setOpenProfile] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll effect for glassmorphism
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleProfileClose = () => {
        setOpenProfile(false);
    };

    const getPageTitle = (path: string) => {
        if (path.startsWith('/dashboard')) {
            return { title: 'Dashboard', highlight: 'Overview' };
        }
        if (path.startsWith('/community')) {
            return { title: 'Community', highlight: 'Hub' };
        }
        if (path.startsWith('/minigames')) {
            return { title: 'Mini Games', highlight: 'Arena' };
        }
        if (path.startsWith('/profile')) {
            return { title: 'Profile', highlight: 'Settings' };
        }
        return { title: 'Eleven', highlight: 'LineUp' };
    };

    const { title, highlight } = getPageTitle(pathname || '');
    const isDashboard = pathname === '/dashboard';

    if (isLoading || !user) return null;

    return (
        <>
            <header
                className={`sticky top-0 z-40 transition-all duration-300 ${scrolled
                    ? 'bg-white/80 backdrop-blur-md shadow-sm py-3'
                    : 'bg-transparent py-5'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        {!isDashboard && (
                            <button
                                onClick={() => router.back()}
                                className={`p-2 rounded-full transition-all ${scrolled
                                        ? 'bg-emerald-100/50 hover:bg-emerald-200/50 text-emerald-800'
                                        : 'bg-white/20 hover:bg-white/30 text-emerald-900 group'
                                    }`}
                                aria-label="Go back"
                            >
                                <ArrowLeftIcon className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-1 transition-transform" />
                            </button>
                        )}
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="text-left group"
                        >
                            <h1 className={`font-black text transition-all duration-300 group-hover:opacity-80 ${scrolled ? 'text-xl' : 'text-2xl md:text-3xl'
                                }`}>
                                {title} <span className="text-emerald-500">{highlight}</span>
                            </h1>
                            {!scrolled && (
                                <p className="text-emerald-700 text-sm md:text-base transition-opacity">
                                    Welcome back, {user.name}
                                </p>
                            )}
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setOpenProfile(true)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${scrolled
                                ? 'bg-emerald-50 hover:bg-emerald-100'
                                : 'bg-white/40 hover:bg-white/60'
                                }`}
                        >
                            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-emerald-500/30">
                                {user.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-emerald-500 flex items-center justify-center text-white font-bold text-xs">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <span className="font-bold text-emerald-900 hidden sm:block pr-1">
                                Profile
                            </span>
                        </button>
                        <LogoutButton />
                    </div>
                </div>
            </header>

            <ProfileDrawer
                open={openProfile}
                onClose={handleProfileClose}
                user={user}
            />
        </>
    );
}
