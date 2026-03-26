'use client';

import RegisterForm from '@/features/auth/components/RegisterForm';
import { useLanguage } from '@/contexts/LanguageContext';
import AuthNavbar from '@/components/AuthNavbar';

export default function RegisterPage() {
    const { t } = useLanguage();

    return (
        <main className="auth-page-bg min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            {/* Decorative Blur (Subtle) */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#10b981]/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Unified Auth Navbar */}
            <AuthNavbar backHref="/" backLabel={t.common.home} />

            {/* Main content */}
            <RegisterForm />
        </main>
    );
}