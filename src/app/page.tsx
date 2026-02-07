
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/solid';

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
            <div className="max-w-4xl w-full glass-panel p-12 md:p-20 rounded-[3rem] shadow-2xl animate-in zoom-in duration-700">
                <div className="mb-8 inline-block px-6 py-2 rounded-full bg-white/20 border border-white/40 backdrop-blur-md">
                    <span className="text-emerald-900 font-bold tracking-widest uppercase text-sm">Season 2025/26</span>
                </div>

                <h1 className="text-6xl md:text-8xl font-black mb-6 text-emerald-900 tracking-tighter drop-shadow-sm leading-[0.9]">
                    ELEVEN<br />
                    <span className="text-white drop-shadow-md">LINEUP</span>
                </h1>

                <p className="text-xl md:text-2xl text-emerald-800 mb-12 font-medium max-w-2xl mx-auto leading-relaxed">
                    The ultimate Premier League squad builder. <br />
                    Mock up your dream team in seconds.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                    <Link
                        href="/login"
                        className="group relative px-10 py-5 rounded-2xl glass-button text-xl uppercase tracking-widest flex items-center gap-3"
                    >
                        Start Building
                        {/* Simple SVG Arrow if Heroicons not installed yet, but I'll assume standard text for now or verify icons later */}
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>

                    <Link
                        href="/register"
                        className="px-10 py-5 rounded-2xl bg-emerald-900/10 text-emerald-900 font-bold text-xl uppercase tracking-widest hover:bg-emerald-900/20 transition-all border-2 border-transparent hover:border-emerald-900/20"
                    >
                        Create Account
                    </Link>
                </div>
            </div>

            <div className="mt-12 text-emerald-900/60 font-semibold text-sm">
                © 2026 ElevenLineUp. Built for fans.
            </div>
        </main>
    );
}
