
'use client';

import LineupBuilder from '@/features/lineup/components/LineupBuilder';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

export default function LineupsPage() {
    return (
        <div className="min-h-screen p-4 md:p-8 relative">
            <div className="absolute top-4 left-4 md:top-8 md:left-8 z-10">
                <Link href="/select-team" className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 text-emerald-900 font-bold transition-all backdrop-blur-sm">
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span>Home</span>
                </Link>
            </div>

            <div className="max-w-7xl mx-auto">
                <header className="mb-8 text-center pt-12 md:pt-0">
                    <h1 className="text-4xl md:text-5xl font-black text-emerald-900 uppercase tracking-tighter drop-shadow-sm mb-2">
                        Squad Builder
                    </h1>
                    <p className="text-emerald-800 font-medium text-lg">
                        Drag and drop to create your winning formation
                    </p>
                </header>

                <LineupBuilder />
            </div>
        </div>
    );
}
