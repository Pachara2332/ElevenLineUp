
'use client';

import TeamSelection from '@/features/team/components/TeamSelection';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

export default function CreateLineupPage() {
    return (
        <div className="min-h-screen p-4 md:p-8 relative">
            <div className="pt-16 md:pt-8">
                <TeamSelection />
            </div>
        </div>
    );
}
