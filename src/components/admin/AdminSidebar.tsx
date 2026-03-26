'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import LogoutButton from '@/components/LogoutButton';

export default function AdminSidebar() {
    const pathname = usePathname();
    const { t } = useLanguage();

    const getLinkClass = (path: string) => {
        const isActive = pathname === path || pathname?.startsWith(`${path}/`);
        // Only exact match for dashboard /admin
        if (path === '/admin' && pathname !== '/admin') return 'block p-3 rounded-xl transition-all text-emerald-100 hover:bg-white/10 hover:text-white font-medium';

        return isActive
            ? 'block p-3 rounded-xl transition-all bg-white text-emerald-900 font-bold shadow-md'
            : 'block p-3 rounded-xl transition-all text-emerald-100 hover:bg-white/10 hover:text-white font-medium';
    };

    return (
        <aside className="w-72 bg-emerald-900 border-r border-emerald-800 flex flex-col relative text-white">
            {/* Brand Header */}
            <div className="p-8 pb-4">
                <h2 className="text-2xl font-black tracking-tight">{t.admin.panel_title}</h2>
                <p className="text-emerald-400 text-xs uppercase tracking-widest font-bold mt-1 font-brand">Eleven Lineup</p>
            </div>

            {/* Navigation */}
            <nav className="mt-6 flex flex-col gap-2 px-6 flex-1">
                <Link href="/admin" className={getLinkClass('/admin')}>
                    {t.admin.menu.dashboard}
                </Link>
                <Link href="/admin/standings" className={getLinkClass('/admin/standings')}>
                    {t.admin.menu.standings}
                </Link>
                <Link href="/admin/fixtures" className={getLinkClass('/admin/fixtures')}>
                    {t.admin.menu.fixtures}
                </Link>
                <div className="my-2 border-t border-emerald-800/50" />
                <Link href="/admin/users" className={getLinkClass('/admin/users')}>
                    {t.admin.menu.users}
                </Link>
                <Link href="/admin/posts" className={getLinkClass('/admin/posts')}>
                    {t.admin.menu.posts}
                </Link>
            </nav>

            {/* Footer / Back Link */}
            <div className="p-6 border-t border-emerald-800 space-y-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="text-sm text-emerald-300 hover:text-white transition font-semibold">
                        {t.admin.menu.back}
                    </Link>
                    <LanguageSwitcher />
                </div>
                <LogoutButton className="w-full bg-emerald-800/50 hover:bg-emerald-700/50 text-emerald-100 border border-emerald-700 hover:border-emerald-600" />
            </div>
        </aside>
    );
}
