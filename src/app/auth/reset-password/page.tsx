'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { useLanguage } from '@/contexts/LanguageContext';
import AuthNavbar from '@/components/AuthNavbar';
import { ArrowPathIcon } from "@heroicons/react/24/outline";

function ResetPasswordForm() {
    const { t } = useLanguage();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (!token) {
            setError('Invalid or missing token');
            return;
        }

        setLoading(true);
        setMessage('');
        setError('');

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Something went wrong');
            } else {
                setMessage('Password reset successful! Redirecting to login...');
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="glass-panel-dark p-12 rounded-xl text-center max-w-md w-full animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">⚠️</span>
                </div>
                <h1 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">Invalid Token</h1>
                <p className="text-white/40 text-sm font-medium mb-8">
                    The reset link is invalid or has expired. Please request a new one.
                </p>
                <Link 
                    href="/login" 
                    className="inline-flex items-center gap-2 text-[#10b981] font-bold hover:text-white transition-colors"
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                    {t.auth.back_to_login}
                </Link>
            </div>
        )
    }

    return (
        <div className="glass-panel-dark max-w-md w-full mx-auto p-10 md:p-12 rounded-xl shadow-2xl relative z-10 animate-in fade-in duration-700">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase whitespace-nowrap">
                    {t.auth.reset_password_title}
                </h1>
                <p className="text-white/40 text-sm font-medium">
                    {t.auth.reset_password_subtitle}
                </p>
            </div>

            {message && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
                    <span className="text-emerald-500 text-lg flex-shrink-0">✓</span>
                    <span className="text-emerald-200 font-semibold text-xs">{message}</span>
                </div>
            )}

            {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 animate-shake">
                    <span className="text-red-500 text-lg flex-shrink-0">⚠</span>
                    <span className="text-red-200 font-semibold text-xs">{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <label className="label-dark px-1 !mb-0">{t.auth.password}</label>
                    <div className="relative group">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full input-dark pl-4"
                            placeholder="••••••••"
                            required
                            minLength={6}
                            disabled={loading}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="label-dark px-1 !mb-0">{t.auth.confirm_password}</label>
                    <div className="relative group">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full input-dark pl-4"
                            placeholder="••••••••"
                            required
                            minLength={6}
                            disabled={loading}
                        />
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[10px] text-white/30 hover:text-[#10b981] font-bold uppercase tracking-widest self-end transition-colors"
                >
                    {showPassword ? 'Hide Password' : 'Show Password'}
                </button>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="relative flex w-full items-center justify-center bg-[#10b981] hover:bg-[#059669] text-white py-4 px-8 rounded-xl text-sm font-bold uppercase tracking-[0.2em] shadow-[0_4px_20px_rgba(16,185,129,0.2)] hover:shadow-[0_6px_25px_rgba(16,185,129,0.4)] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-1"
                    >
                        {loading ? (
                            <span className="flex items-center gap-3">
                                <ArrowPathIcon className="animate-spin h-5 w-5 text-white" />
                                {t.common.loading}
                            </span>
                        ) : (
                            t.auth.reset_password_title
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function ResetPasswordPage() {
    const { t } = useLanguage();

    return (
        <main className="auth-page-bg min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            {/* Decorative Blur (Subtle) */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#10b981]/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Unified Auth Navbar */}
            <AuthNavbar backHref="/login" backLabel={t.auth.back_to_login} />

            <Suspense fallback={<div className="text-[#10b981] font-black text-xl animate-pulse tracking-widest uppercase">Initializing Reset...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </main>
    );
}

