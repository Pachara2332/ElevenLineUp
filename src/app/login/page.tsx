'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function LoginForm() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('🔐 Attempting login for:', email);

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // ⚠️ CRITICAL: ต้องมีเพื่อส่ง cookie
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log('📩 Login response:', res.status, data);

      if (!res.ok) {
        console.error('❌ Login failed:', data);
        setError(data.error || 'Invalid email or password');
        setLoading(false);
        return;
      }

      // Login สำเร็จ
      console.log('✅ Login successful!');
      console.log('👤 User:', data.user);

      // รอให้ cookie ถูก set
      await new Promise(resolve => setTimeout(resolve, 500));

      console.log('🔄 Redirecting to dashboard...');

      // Redirect และ refresh
      router.push('/dashboard');
      router.refresh();

    } catch (err) {
      console.error('💥 Login error:', err);
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <main className="auth-page-bg min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating blur elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      {/* Language Switcher */}
      <div className="absolute top-8 right-8 z-50">
        <LanguageSwitcher />
      </div>

      {/* Back button */}
      <Link
        href="/"
        className="absolute top-8 left-8 z-20 flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-lg text-emerald-900 font-bold transition-all duration-300 border border-white/50 group"
      >
        <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
        <span>{t.common.home}</span>
      </Link>

      <div className="glass-panel max-w-md w-full mx-auto p-8 md:p-12 rounded-[2rem] shadow-2xl relative overflow-hidden z-10">
        {/* Decorative gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent"></div>

        <div className="relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-emerald-900 mb-2 uppercase tracking-tight">
              {t.auth.welcome_back}
            </h1>
            <p className="text-emerald-800 font-medium">
              {t.auth.sign_in_subtitle}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border-2 border-red-200 flex items-center gap-3 animate-shake">
              <span className="text-red-600 text-xl flex-shrink-0">⚠</span>
              <span className="text-red-800 font-semibold text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-bold text-emerald-900 mb-2 uppercase tracking-wide">
                {t.auth.email}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 text-xl">
                  ✉️
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/50 border-2 border-white/30 focus:border-emerald-500 focus:bg-white transition-all outline-none font-medium text-emerald-900 placeholder:text-emerald-600/50"
                  placeholder="Email"
                  required
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-emerald-900 uppercase tracking-wide">
                  {t.auth.password}
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm font-semibold text-emerald-600 hover:text-emerald-500 hover:underline transition-colors"
                >
                  {t.auth.forgot_password}
                </Link>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 text-xl">
                  🔒
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/50 border-2 border-white/30 focus:border-emerald-500 focus:bg-white transition-all outline-none font-medium text-emerald-900"
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
              className="w-full py-4 rounded-xl bg-emerald-600 text-white font-bold text-lg uppercase tracking-widest shadow-lg hover:bg-emerald-500 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:bg-emerald-400"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {t.auth.signing_in}
                </span>
              ) : (
                t.auth.sign_in
              )}
            </button>
          </form>

          {/* Register Link */}
          <p className="mt-8 text-center text-emerald-800 font-medium">
            {t.auth.dont_have_account}{' '}
            <Link
              href="/register"
              className="text-emerald-600 font-bold underline hover:text-emerald-500 transition-colors"
            >
              {t.auth.register_here}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}