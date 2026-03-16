"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function LoginForm() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("🔐 Attempting login for:", email);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ⚠️ CRITICAL: ต้องมีเพื่อส่ง cookie
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("📩 Login response:", res.status, data);

      if (!res.ok) {
        console.error("❌ Login failed:", data);
        setError(data.error || "Invalid email or password");
        setLoading(false);
        return;
      }

      // Login สำเร็จ
      console.log("✅ Login successful!");
      console.log("👤 User:", data.user);

      // รอให้ cookie ถูก set
      await new Promise((resolve) => setTimeout(resolve, 500));

      console.log("🔄 Redirecting to dashboard...");

      // Redirect และ refresh
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      console.error("💥 Login error:", err);
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="auth-page-bg min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Blur (Subtle) */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#10b981]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Navbar Decoration */}
      <div className="absolute top-0 left-0 right-0 z-50 px-8 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-[#10b981] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </div>
          <span className="text-white/60 font-bold tracking-widest text-[10px] uppercase">
            {t.common.home}
          </span>
        </Link>
        <LanguageSwitcher />
      </div>

      <div className="glass-panel-dark max-w-md w-full mx-auto p-10 md:p-12 rounded-[2rem] shadow-2xl relative z-10 animate-in fade-in duration-700">
        <div className="relative z-10">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase whitespace-nowrap">
              {t.auth.welcome_back}
            </h1>
            <p className="text-white/40 text-sm font-medium">
              {t.auth.sign_in_subtitle}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 animate-shake">
              <span className="text-red-500 text-lg flex-shrink-0">⚠</span>
              <span className="text-red-200 font-semibold text-xs">
                {error}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="label-dark">{t.auth.email}</label>
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full input-dark pl-4"
                  placeholder="name@example.com"
                  required
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="label-dark !mb-0">{t.auth.password}</label>
                <Link
                  href="/auth/forgot-password"
                  className="text-[10px] font-bold text-[#10b981] hover:text-[#10b981]/80 hover:underline transition-colors uppercase tracking-widest"
                >
                  {t.auth.forgot_password}
                </Link>
              </div>
              <div className="relative group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full input-dark pl-4"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary-green py-4 rounded-xl text-sm uppercase tracking-[0.2em] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
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
                  {t.auth.signing_in}
                </span>
              ) : (
                t.auth.sign_in
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="text-white/40 text-xs font-medium">
              {t.auth.dont_have_account}{" "}
              <Link
                href="/register"
                className="text-[#10b981] font-bold hover:text-white transition-colors ml-1"
              >
                {t.auth.register_here}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
