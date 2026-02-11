'use client';

import RegisterForm from '@/features/auth/components/RegisterForm';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function RegisterPage() {
    const { t } = useLanguage();

    return (
        <main className="auth-page-bg min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Floating blur elements */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

            {/* Language Switcher */}
            <div className="absolute top-8 right-8 z-50">
                <LanguageSwitcher />
            </div>

            {/* Back button */}
            <Link
                href="/"
                className="absolute top-8 left-8 z-20 flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-lg text-emerald-900 font-bold transition-all duration-300 border border-white/50 group"
            >
                <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
                <span>{t.common.home}</span>
            </Link>

            {/* Main content */}
            <div className="relative z-10 w-full max-w-md">
                <RegisterForm />
            </div>
        </main>
    );
}