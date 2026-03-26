"use client";

import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { register, isLoading, error } = useAuth();

  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register(name, email, password);
  };

  return (
    <div className="glass-panel-dark max-w-md w-full mx-auto p-10 md:p-12 rounded-xl shadow-2xl relative z-10 animate-in fade-in duration-700">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase whitespace-nowrap">
          {t.auth.create_account_title}
        </h2>
        <p className="text-white/40 text-sm font-medium">
          {t.auth.create_account_subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Name Field */}
        <div className="flex flex-col gap-2">
          <label className="label-dark px-1 !mb-0">{t.auth.name}</label>
          <div className="relative group">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full input-dark pl-4"
              placeholder="Pep Guardiola"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="flex flex-col gap-2">
          <label className="label-dark px-1 !mb-0">{t.auth.email}</label>
          <div className="relative group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full input-dark pl-4"
              placeholder="manager@example.com"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-2">
          <label className="label-dark px-1 !mb-0">{t.auth.password}</label>
          <div className="relative group">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full input-dark pl-4 pr-12"
              placeholder="••••••••"
              required
              minLength={6}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 animate-shake">
            <span className="text-red-500 text-lg flex-shrink-0">⚠</span>
            <span className="text-red-200 font-semibold text-xs">
              {error instanceof Error ? error.message : "Registration failed"}
            </span>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="relative flex w-full items-center justify-center bg-[#10b981] hover:bg-[#059669] text-white py-4 px-8 rounded-xl text-sm font-bold uppercase tracking-[0.2em] shadow-[0_4px_20px_rgba(16,185,129,0.2)] hover:shadow-[0_6px_25px_rgba(16,185,129,0.4)] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-1 disabled:hover:translate-y-0"
          >
            {isLoading ? (
              <span className="flex items-center gap-3">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                {t.auth.registering}
              </span>
            ) : (
              t.auth.register
            )}
          </button>
        </div>
      </form>

      <div className="mt-10 pt-8 border-t border-white/5 text-center">
        <p className="text-white/40 text-xs font-medium">
          {t.auth.already_have_account}{" "}
          <Link
            href="/login"
            className="text-[#10b981] font-bold hover:text-white transition-colors ml-1"
          >
            {t.auth.sign_in_here}
          </Link>
        </p>
      </div>
    </div>

  );
}
