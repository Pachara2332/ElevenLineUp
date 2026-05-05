"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import LandingNavbar from "@/components/LandingNavbar";

export default function Home() {
  const { t, language } = useLanguage();
  const [subtitleFxKey, setSubtitleFxKey] = useState(0);

  useEffect(() => {
    setSubtitleFxKey((prev) => prev + 1);
  }, [language]);

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black flex flex-col items-center justify-center text-center">
      {/* Background with overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-60"
        style={{ backgroundImage: 'url("/images/stadium-hero.png")' }}
      />
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-transparent to-black" />

      {/* Navbar */}
      <LandingNavbar />

      {/* Content */}
      <div className="relative z-20 max-w-4xl px-8 flex flex-col items-center animate-in zoom-in duration-1000">


        {/* Title */}
        <h1 className="text-7xl md:text-9xl font-black mb-6 leading-none tracking-tighter text-white drop-shadow-2xl font-brand">
          ELEVEN <span className="text-[#10b981]">LINEUP</span>
        </h1>

        {/* Subtitle */}
        <div className="relative mb-12">
          <span
            key={`subtitle-glow-${subtitleFxKey}`}
            className="pointer-events-none absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/30 blur-2xl animate-ping"
          />
          <p
            key={`subtitle-${subtitleFxKey}`}
            className="relative max-w-2xl text-base md:text-lg text-white/80 font-medium leading-relaxed text-shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500"
          >
            {t.landing.subtitle}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link
            href="/login"
            className="btn-primary-green min-w-[220px] justify-center"
          >
            {t.landing.start_building}
          </Link>

          <Link
            href="/register"
            className="btn-glass min-w-[220px] justify-center"
          >
            {t.landing.create_account}
          </Link>
        </div>
      </div>

      {/* Footer decoration */}
      <div className="absolute bottom-12 left-0 right-0 z-20 flex justify-center gap-12 opacity-20 pointer-events-none">
        <div className="h-[1px] w-24 bg-white/50" />
        <div className="h-[1px] w-24 bg-white/50" />
      </div>
    </main>
  );
}
