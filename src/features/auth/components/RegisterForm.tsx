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
    <div className="w-full max-w-md mx-auto p-10 md:p-12 glass-panel-dark rounded-[2rem] shadow-2xl relative z-10 animate-in fade-in duration-700">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-white mb-2 tracking-tighter uppercase whitespace-nowrap">
          {t.auth.create_account_title}
        </h2>
        <p className="text-white/40 text-sm font-medium">
          {t.auth.create_account_subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="label-dark">{t.auth.name}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full input-dark"
            placeholder="Pep Guardiola"
            required
          />
        </div>

        <div>
          <label className="label-dark">{t.auth.email}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full input-dark"
            placeholder="manager@example.com"
            required
          />
        </div>

        <div>
          <label className="label-dark">{t.auth.password}</label>
          <div className="relative group">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full input-dark pr-12"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/20 hover:text-[#10b981] transition-colors focus:outline-none"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 animate-shake">
            <span className="text-red-500 text-lg flex-shrink-0">⚠</span>
            <span className="text-red-200 font-semibold text-xs">
              {error instanceof Error ? error.message : "Registration failed"}
            </span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary-green py-4 rounded-xl text-sm uppercase tracking-[0.2em] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {t.auth.registering}
            </span>
          ) : (
            t.auth.register
          )}
        </button>
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
