'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

function ResetPasswordForm() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
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
            <div className="text-center">
                <h1 className="text-2xl font-bold text-red-600">Invalid Token</h1>
                <p className="text-emerald-800">Please check your link and try again.</p>
                <Link href="/login" className="mt-4 inline-block text-emerald-600 underline">Back to Login</Link>
            </div>
        )
    }

    return (
        <div className="glass-panel max-w-md w-full mx-auto p-8 md:p-12 rounded-[2rem] shadow-2xl relative overflow-hidden z-10">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-black text-emerald-900 mb-2 uppercase tracking-tight">
                    Reset Password
                </h1>
                <p className="text-emerald-800 font-medium">
                    Enter your new password below
                </p>
            </div>

            {message && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-50 border-2 border-emerald-200 flex items-center gap-3">
                    <span className="text-emerald-600 text-xl">✅</span>
                    <span className="text-emerald-800 font-semibold text-sm">{message}</span>
                </div>
            )}

            {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border-2 border-red-200 flex items-center gap-3 animate-shake">
                    <span className="text-red-600 text-xl">⚠</span>
                    <span className="text-red-800 font-semibold text-sm">{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-emerald-900 mb-2 uppercase tracking-wide">
                        New Password
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 text-xl">
                            🔒
                        </span>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/50 border-2 border-white/30 focus:border-emerald-500 focus:bg-white transition-all outline-none font-medium text-emerald-900"
                            placeholder="New Password"
                            required
                            minLength={6}
                            disabled={loading}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-emerald-900 mb-2 uppercase tracking-wide">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 text-xl">
                            🔒
                        </span>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/50 border-2 border-white/30 focus:border-emerald-500 focus:bg-white transition-all outline-none font-medium text-emerald-900"
                            placeholder="Confirm Password"
                            required
                            minLength={6}
                            disabled={loading}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl bg-emerald-600 text-white font-bold text-lg uppercase tracking-widest shadow-lg hover:bg-emerald-500 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Resetting...' : 'Reset Password'}
                </button>
            </form>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <main className="auth-page-bg min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

            {/* Back to Login */}
            <Link
                href="/login"
                className="absolute top-8 left-8 z-20 flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-lg text-emerald-900 font-bold transition-all duration-300 border border-white/50 group"
            >
                <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
                <span>Back to Login</span>
            </Link>

            <Suspense fallback={<div className="text-white font-bold text-xl">Loading...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </main>
    );
}
