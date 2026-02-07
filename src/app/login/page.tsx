import LoginForm from '@/features/auth/components/LoginForm';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

export default function LoginPage() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.1),transparent_50%)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(6,182,212,0.1),transparent_50%)]"></div>
            </div>

            {/* Floating elements */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>

            {/* Back button */}
            <div className="absolute top-8 left-8 z-20">
                <Link
                    href="/"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-lg text-emerald-900 font-bold transition-all duration-300 border border-emerald-100 group"
                >
                    <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
                    <span>Home</span>
                </Link>
            </div>

            {/* Content container */}
            <div className="relative z-10 w-full max-w-md space-y-8">
                {/* Logo and title */}
                <div className="text-center space-y-3">
                    <div className="inline-block p-4 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl shadow-xl mb-4">
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter">
                        <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                            Eleven
                        </span>
                        <span className="bg-gradient-to-r from-emerald-900 to-teal-900 bg-clip-text text-transparent">
                            LineUp
                        </span>
                    </h1>
                    <p className="text-emerald-700 font-medium">เข้าสู่ระบบเพื่อจัดการทีมของคุณ</p>
                </div>

                {/* Login form with card */}
                <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/50 p-8 space-y-6">
                    <LoginForm />

                    {/* Register link */}
                    <div className="text-center pt-6 border-t border-emerald-100">
                        <p className="text-sm text-gray-600">
                            ยังไม่มีบัญชี?{' '}
                            <Link
                                href="/register"
                                className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
                            >
                                สมัครสมาชิก
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Additional info */}
                <p className="text-center text-sm text-emerald-700/70">
                    ระบบจัดการทีมฟุตบอลที่ทรงพลัง 🏆
                </p>
            </div>
        </main>
    );
}