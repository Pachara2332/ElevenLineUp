
'use client';

import LineupBuilder from '@/features/lineup/components/LineupBuilder';

export default function LineupsPage() {
    return (
        <div className="min-h-screen p-4 md:p-8 relative">
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
