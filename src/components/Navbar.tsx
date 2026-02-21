"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/features/auth/hooks/useAuth";
import LogoutButton from "@/components/LogoutButton";
import NotificationBell from "@/components/NotificationBell";

interface NavbarProps {
  title?: string;
  subtitle?: string;
}

export default function Navbar({ title = "Dashboard", subtitle }: NavbarProps) {
  const { user } = useAuth();

  return (
    <header className="flex justify-between items-center mb-8 max-w-7xl mx-auto px-4 py-4">
      <Link href="/dashboard" className="hover:opacity-80 transition">
        <h1 className="text-3xl font-black drop-shadow-md">
          {title} <span className="text-emerald-300">Overview</span>
        </h1>
        <p className="text-emerald-700">
          {subtitle || (user ? `Welcome back, ${user.name}` : "")}
        </p>
      </Link>
      <div className="flex items-center gap-3">
        <Link
          href="/fixtures"
          className="px-4 py-2 rounded-xl bg-white/40 text-emerald-900 font-bold hover:bg-white/60 transition"
        >
          Fixtures
        </Link>
        <Link
          href="/dashboard"
          className="px-4 py-2 rounded-xl bg-white/40 text-emerald-900 font-bold hover:bg-white/60 transition"
        >
          Profile
        </Link>
        <NotificationBell />
        <LogoutButton />
      </div>
    </header>
  );
}
