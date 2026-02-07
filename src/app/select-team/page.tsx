
import TeamSelection from '@/features/team/components/TeamSelection';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

export default function SelectTeamPage() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-4 relative">
            <div className="absolute top-8 left-8 z-10">
                <Link href="/" className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 text-emerald-900 font-bold transition-all backdrop-blur-sm">
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span>Home</span>
                </Link>
            </div>

            <TeamSelection />
        </main>
    );
}
