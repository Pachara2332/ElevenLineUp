"use client";

import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

interface AuthNavbarProps {
  backHref?: string;
  backLabel?: string;
}

export default function AuthNavbar({
  backHref = "/",
  backLabel,
}: AuthNavbarProps) {
  const { t } = useLanguage();

  return (
    <div className="absolute top-0 left-0 right-0 z-50 px-8 py-6 flex items-center justify-between">
      <Link
        href={backHref}
        className="group flex items-center gap-3 px-4 py-2 bg-white/5 hover:bg-[#10b981]/10 border border-white/10 hover:border-[#10b981]/40 rounded-lg backdrop-blur-sm transition-all duration-300"
      >
        <span className="text-white/60 group-hover:text-white font-bold tracking-widest text-[10px] uppercase transition-colors">
          {backLabel || t.common.home}
        </span>
      </Link>
      <LanguageSwitcher />
    </div>
  );
}
