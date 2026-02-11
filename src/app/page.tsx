'use client';

import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Home() {
    const { t } = useLanguage();

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center relative">
            <div className="absolute top-8 right-8 z-50">
                <LanguageSwitcher />
            </div>

            <div className="max-w-4xl w-full glass-panel p-12 md:p-20 rounded-[3rem] shadow-2xl animate-in zoom-in duration-700">
                <div className="mb-8 inline-block px-6 py-2 rounded-full bg-white/20 border border-white/40 backdrop-blur-md">
                    <span className="text-emerald-900 font-bold tracking-widest uppercase text-sm">{t.landing.season}</span>
                </div>

                <h1 className="text-6xl md:text-8xl font-black mb-6 text-emerald-900 tracking-tighter drop-shadow-sm leading-[0.9]">
                    {t.landing.title_start}<br />
                    <span className="text-white drop-shadow-md">{t.landing.title_end}</span>
                </h1>

                <p className="text-xl md:text-2xl text-emerald-800 mb-12 font-medium max-w-2xl mx-auto leading-relaxed">
                    {t.landing.subtitle}
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                    <Link
                        href="/login"
                        className="group relative px-10 py-5 rounded-2xl glass-button text-xl uppercase tracking-widest flex items-center gap-3"
                    >
                        {t.landing.start_building}
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>

                    <Link
                        href="/register"
                        className="px-10 py-5 rounded-2xl bg-emerald-900/10 text-emerald-900 font-bold text-xl uppercase tracking-widest hover:bg-emerald-900/20 transition-all border-2 border-transparent hover:border-emerald-900/20"
                    >
                        {t.landing.create_account}
                    </Link>
                </div>
            </div>

            <div className="mt-12 text-emerald-900/60 font-semibold text-sm">
                {t.landing.footer}
            </div>
        </main>
    );
}
