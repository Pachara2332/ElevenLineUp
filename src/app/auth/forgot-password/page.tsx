"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import AuthNavbar from "@/components/AuthNavbar";

export default function ForgotPasswordPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setMessage(
          data.message || "If an account exists, a reset link has been sent.",
        );
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page-bg min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Blur (Subtle) */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#10b981]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Unified Auth Navbar */}
      <AuthNavbar backHref="/login" backLabel={t.auth.back_to_login} />

      <div className="glass-panel-dark max-w-md w-full mx-auto p-10 md:p-12 rounded-xl shadow-2xl relative z-10 animate-in fade-in duration-700">
        <div className="relative z-10">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase">
              {t.auth.forgot_password}
            </h1>
            <p className="text-white/40 text-sm font-medium">
              {t.auth.forgot_password_subtitle}
            </p>
          </div>

          {message && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
              <span className="text-emerald-500 text-lg flex-shrink-0">✓</span>
              <span className="text-emerald-200 font-semibold text-xs">
                {message}
              </span>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 animate-shake">
              <span className="text-red-500 text-lg flex-shrink-0">⚠</span>
              <span className="text-red-200 font-semibold text-xs">
                {error}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="label-dark px-1 !mb-0">{t.auth.email}</label>
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full input-dark pl-4"
                  placeholder="name@example.com"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="relative flex w-full items-center justify-center bg-[#10b981] hover:bg-[#059669] text-white py-4 px-8 rounded-xl text-sm font-bold uppercase tracking-[0.2em] shadow-[0_4px_20px_rgba(16,185,129,0.2)] hover:shadow-[0_6px_25px_rgba(16,185,129,0.4)] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-1"
              >
                {loading ? (
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
                    {t.common.loading}
                  </span>
                ) : (
                  t.auth.send_reset_link
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
