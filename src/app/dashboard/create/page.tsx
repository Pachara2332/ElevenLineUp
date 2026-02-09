
'use client';

import TeamSelection from '@/features/team/components/TeamSelection';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

export default function CreateLineupPage() {
    return (
        <div className="min-h-screen p-4 md:p-8 relative">
            <div className="absolute top-4 left-4 md:top-8 md:left-8 z-10">
                <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 text-emerald-900 font-bold transition-all backdrop-blur-sm shadow-sm border border-white/20">
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span>Back to Dashboard</span>
                </Link>
            </div>

            <div className="pt-16 md:pt-8">
                <TeamSelection />
            </div>
        </div>
    );
}
