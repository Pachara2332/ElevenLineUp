'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/features/auth/hooks/useAuth';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function LandingNavbar() {
    const { user } = useAuth();
    const { t } = useLanguage();

    if (!user) {
        return (
            <div className="fixed top-8 right-8 z-[100]">
                <LanguageSwitcher />
            </div>
        );
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-[100] px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-[#10b981] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                </div>
                <span className="text-white font-black tracking-tighter text-xl">
                    ELEVEN <span className="text-white/80">LINEUP</span>
                </span>
            </Link>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-8">
                <Link href="#" className="nav-link">{t.landing.nav.leagues}</Link>
                <Link href="#" className="nav-link">{t.landing.nav.players}</Link>
                <Link href="#" className="nav-link">{t.landing.nav.stats}</Link>
                <Link href="#" className="nav-link">{t.landing.nav.live}</Link>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-6">
                <LanguageSwitcher />

                {/* Profile Avatar */}
                <div className="w-10 h-10 rounded-full border-2 border-[#10b981] overflow-hidden bg-black/40 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
                    {user?.avatar ? (
                        <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#10b981] to-emerald-900 flex items-center justify-center text-white text-xs font-bold">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
