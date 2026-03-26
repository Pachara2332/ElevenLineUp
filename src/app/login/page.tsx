"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import AuthNavbar from "@/components/AuthNavbar";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";

export default function LoginForm() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { login } = useAuth();

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
        credentials: "include",
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
      console.log("👤 User:", data.data?.user);

      // สำคัญมาก: ต้องบอก react-query ว่าข้อมูล user เปลี่ยนแล้ว
      // เพื่อป้องกันอาการ cache ค้าง (Unauthorized) ตอนเปลี่ยนหน้า
      await queryClient.invalidateQueries({ queryKey: ["auth", "user"] });

      console.log("🔄 Redirecting to dashboard...");

      // Redirect ทันทีหลังจาก invalidate
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="auth-page-bg min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Blur (Subtle) */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#10b981]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Unified Auth Navbar */}
      <AuthNavbar backHref="/" backLabel={t.common.home} />

      <div className="glass-panel-dark max-w-md w-full mx-auto p-10 md:p-12 rounded-xl shadow-2xl relative z-10 animate-in fade-in duration-700">
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

          {/* 🛑 ปรับแก้ form spacing ให้สวยงามขึ้น */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            {/* Email Field */}
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
                  autoComplete="email"
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
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
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

              {/* 🛑 ย้ายลืมรหัสผ่านมาไว้ด้านล่างขวา */}
              <div className="flex justify-end px-1 mt-2">
                <Link
                  href="/auth/forgot-password"
                  className="text-[10px] font-bold text-[#10b981] hover:text-[#10b981]/80 hover:underline transition-colors uppercase tracking-widest"
                >
                  {t.auth.forgot_password}
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="relative flex w-full items-center justify-center bg-[#10b981] hover:bg-[#059669] text-white py-4 px-8 rounded-xl text-sm font-bold uppercase tracking-[0.2em] shadow-[0_4px_20px_rgba(16,185,129,0.2)] hover:shadow-[0_6px_25px_rgba(16,185,129,0.4)] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-1 disabled:hover:translate-y-0"
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
                    {t.auth.signing_in}
                  </span>
                ) : (
                  t.auth.sign_in
                )}
              </button>
            </div>
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
