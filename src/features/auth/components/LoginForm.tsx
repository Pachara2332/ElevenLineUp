
'use client';

import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Link from 'next/link';
import { EnvelopeIcon, LockClosedIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { EyeIcon, EyeSlashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login, isLoading, error } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await login(email, password);
    };

    return (
        <div className="w-full max-w-md mx-auto p-8 glass-panel rounded-3xl animate-in fade-in zoom-in duration-500">
            <h2 className="text-3xl font-black text-center mb-2 text-emerald-900 uppercase tracking-tighter">Welcome Back</h2>
            <p className="text-center text-emerald-800 mb-8 font-medium">Sign in to manage your dream team</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-emerald-900 uppercase tracking-wide ml-1">Email</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-emerald-600">
                            <EnvelopeIcon className="w-5 h-5" />
                        </div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl glass-input bg-white/40 border border-white/50 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 text-emerald-900 font-bold placeholder:text-emerald-900/40 transition-all duration-300"
                            placeholder="manager@elevenlineup.com"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-emerald-900 uppercase tracking-wide ml-1">Password</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-emerald-600">
                            <LockClosedIcon className="w-5 h-5" />
                        </div>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-12 pr-12 py-4 rounded-2xl glass-input bg-white/40 border border-white/50 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 text-emerald-900 font-bold placeholder:text-emerald-900/40 transition-all duration-300"
                            placeholder="••••••••"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-emerald-600 hover:text-emerald-800 focus:outline-none"
                        >
                            {showPassword ? (
                                <EyeSlashIcon className="w-5 h-5" />
                            ) : (
                                <EyeIcon className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="p-4 rounded-xl bg-red-100/80 border-2 border-red-500/20 text-red-900 font-bold text-center text-sm shadow-inner flex items-center justify-center gap-2">
                        <ExclamationTriangleIcon className="w-5 h-5" />
                        {error instanceof Error ? error.message : 'Login failed'}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 rounded-2xl glass-button text-lg disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] shadow-emerald-900/10 hover:shadow-emerald-900/20"
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <ArrowPathIcon className="animate-spin h-5 w-5 text-emerald-900" />
                            Signing In...
                        </span>
                    ) : 'Sign In'}
                </button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-emerald-900 font-medium">
                    Don't have an account?{' '}
                    <Link href="/register" className="font-extrabold underline decoration-2 underline-offset-4 hover:text-white transition-colors">
                        Register Here
                    </Link>
                </p>
            </div>
        </div>
    );
}
