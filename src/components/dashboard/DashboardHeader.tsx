"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import LogoutButton from "@/components/LogoutButton";
import ProfileDrawer from "@/app/dashboard/ProfileDrawer";
import NotificationDropdown from "./NotificationDropdown";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeftIcon, PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function DashboardHeader() {
  const { user, isLoading } = useAuth();
  const { t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const [openProfile, setOpenProfile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [faviconAvailable, setFaviconAvailable] = useState(true);

  // Handle scroll effect for glassmorphism
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Increased threshold and buffer to prevent jitter
          if (window.scrollY > 50) {
            setScrolled(true);
          } else if (window.scrollY < 30) {
            setScrolled(false);
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleProfileClose = () => {
    setOpenProfile(false);
  };

  const getPageTitle = (path: string) => {
    if (path.startsWith("/dashboard")) {
      return {
        title: t.dashboard.menu.dashboard,
        highlight: t.dashboard.highlights.overview,
      };
    }
    if (path.startsWith("/community")) {
      return {
        title: t.dashboard.menu.community,
        highlight: t.dashboard.highlights.hub,
      };
    }
    if (path.startsWith("/minigames")) {
      return {
        title: t.dashboard.menu.minigames,
        highlight: t.dashboard.highlights.arena,
      };
    }
    if (path.startsWith("/profile")) {
      return {
        title: t.dashboard.menu.profile,
        highlight: t.dashboard.highlights.settings,
      };
    }
    return { title: "Eleven", highlight: "LineUp" };
  };

  const { title, highlight } = getPageTitle(pathname || "");
  const isDashboard = pathname === "/dashboard";

  if (isLoading || !user) return null;

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 py-4 ${
          scrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <button
              onClick={() => router.push("/dashboard")}
              className="group flex items-center gap-3"
            >
              <div
                className={`rounded-lg flex items-center justify-center group-hover:scale-110 transition-all duration-200 ${
                  scrolled ? "w-8 h-8" : "w-10 h-10"
                }`}
              >
                {faviconAvailable ? (
                  <img
                    src="/favicon.ico"
                    alt="ElevenLineUp logo"
                    className={`object-contain ${
                      scrolled ? "w-6 h-6" : "w-7 h-7"
                    }`}
                    onError={() => setFaviconAvailable(false)}
                  />
                ) : (
                  <PaperAirplaneIcon
                    className={`text-emerald-500 -rotate-45 ${
                      scrolled ? "w-6 h-6" : "w-7 h-7"
                    }`}
                  />
                )}
              </div>

              <div className="flex flex-col">
                <h1
                  className={`font-brand font-black tracking-tight leading-none ${
                    scrolled
                      ? "text-lg text-slate-900"
                      : "text-xl md:text-2xl text-slate-900"
                  }`}
                >
                  ELEVEN <span className="text-emerald-500">LINEUP</span>
                </h1>

                <div
                  className={`flex items-center gap-1.5 transition-opacity ${
                    scrolled ? "opacity-0 h-0" : "opacity-100 mt-1"
                  }`}
                >
                  <span className="text-[#10b981] font-bold text-xs uppercase tracking-wider">
                    {title}
                  </span>
                  <span className="text-slate-400 font-medium text-xs uppercase tracking-widest">
                    {highlight}
                  </span>
                </div>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <NotificationDropdown />
            <LanguageSwitcher />

            <button
              onClick={() => setOpenProfile(true)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
                scrolled
                  ? "bg-emerald-50 hover:bg-emerald-100"
                  : "bg-white/40 hover:bg-white/60"
              }`}
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-emerald-500/30">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-emerald-500 flex items-center justify-center text-white font-bold text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <span className="font-bold text-emerald-900 hidden sm:block pr-1">
                {t.dashboard.menu.profile}
              </span>
            </button>

            <LogoutButton />
          </div>
        </div>
      </header>

      <ProfileDrawer
        open={openProfile}
        onClose={handleProfileClose}
        user={{ ...user, avatar: user.avatar ?? undefined }}
      />
    </>
  );
}
