"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/features/auth/hooks/useAuth";
import LogoutButton from "@/components/LogoutButton";
import NotificationBell from "@/components/NotificationBell";
import LanguageSwitcher from "@/components/LanguageSwitcher";

interface NavbarProps {
  title?: string;
  subtitle?: string;
}

export default function Navbar({ title = "Dashboard", subtitle }: NavbarProps) {
  const { user } = useAuth();

  if (!user) {
    return (
      <header className="flex justify-end mb-8 max-w-7xl mx-auto px-4 py-4">
        <LanguageSwitcher />
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/dashboard" className="flex flex-col hover:opacity-80 transition">
            <h1 className="text-xl font-bold text-slate-900 leading-tight">
              {title} <span className="text-emerald-600 font-extrabold">LineUp</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
              {subtitle || (user ? `Welcome back, ${user.name}` : "")}
            </p>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <nav className="hidden md:flex items-center gap-1 mr-4">
              <Link
                href="/dashboard"
                className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-emerald-600 hover:bg-slate-100 transition"
              >
                Home
              </Link>
              <Link
                href="/fixtures"
                className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-emerald-600 hover:bg-slate-100 transition"
              >
                Fixtures
              </Link>
              <Link
                href="/community"
                className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-emerald-600 hover:bg-slate-100 transition"
              >
                Community
              </Link>
            </nav>

            <div className="flex items-center gap-2 pl-4 border-l border-slate-200">
              <LanguageSwitcher />
              <NotificationBell />
              <div className="h-8 w-[1px] bg-slate-200 mx-1 hidden sm:block" />
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
