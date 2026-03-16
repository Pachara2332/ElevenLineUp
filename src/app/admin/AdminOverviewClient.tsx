'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { UsersIcon, ViewColumnsIcon, ChatBubbleLeftRightIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

type OverviewProps = {
    usersCount: number;
    lineupsCount: number;
    postsCount: number;
    fixturesCount: number;
};

export default function AdminOverviewClient({ usersCount, lineupsCount, postsCount, fixturesCount }: OverviewProps) {
    const { t } = useLanguage();

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-4xl font-black text-emerald-950 dark:text-emerald-500 drop-shadow-sm tracking-tight mb-2">
                    {t.admin.dashboard.title}
                </h1>
                <p className="text-emerald-700/80 dark:text-emerald-200/60 font-medium text-lg">
                    {t.admin.dashboard.subtitle}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title={t.admin.dashboard.total_users} value={usersCount} icon={<UsersIcon className="w-8 h-8 text-blue-500" />} />
                <StatCard title={t.admin.dashboard.total_lineups} value={lineupsCount} icon={<ViewColumnsIcon className="w-8 h-8 text-emerald-500" />} />
                <StatCard title={t.admin.dashboard.total_posts} value={postsCount} icon={<ChatBubbleLeftRightIcon className="w-8 h-8 text-purple-500" />} />
                <StatCard title={t.admin.dashboard.total_fixtures} value={fixturesCount} icon={<CalendarDaysIcon className="w-8 h-8 text-orange-500" />} />
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                <ActionCard
                    href="/admin/standings"
                    title={t.admin.dashboard.manage_standings}
                    desc={t.admin.dashboard.manage_standings_desc}
                    colorClass="bg-emerald-50 text-emerald-900 border-emerald-200 hover:border-emerald-400 group-hover:bg-emerald-100"
                />
                <ActionCard
                    href="/admin/fixtures"
                    title={t.admin.dashboard.manage_fixtures}
                    desc={t.admin.dashboard.manage_fixtures_desc}
                    colorClass="bg-blue-50 text-blue-900 border-blue-200 hover:border-blue-400 group-hover:bg-blue-100"
                />
                <ActionCard
                    href="/admin/users"
                    title={t.admin.dashboard.manage_users}
                    desc={t.admin.dashboard.manage_users_desc}
                    colorClass="bg-purple-50 text-purple-900 border-purple-200 hover:border-purple-400 group-hover:bg-purple-100"
                />
                <ActionCard
                    href="/admin/posts"
                    title={t.admin.dashboard.moderate_posts}
                    desc={t.admin.dashboard.moderate_posts_desc}
                    colorClass="bg-red-50 text-red-900 border-red-200 hover:border-red-400 group-hover:bg-red-100"
                />
            </div>
        </div>
    );
}

function StatCard({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-emerald-100 dark:border-gray-700 hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                <div className="w-32 h-32">{icon}</div>
            </div>
            <div className="flex justify-between items-start relative z-10">
                <div>
                    <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">{title}</h3>
                    <p className="text-4xl font-black text-gray-900 dark:text-gray-100">{value}</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                    {icon}
                </div>
            </div>
        </div>
    );
}

function ActionCard({ href, title, desc, colorClass }: { href: string, title: string, desc: string, colorClass: string }) {
    return (
        <Link href={href} className={`block p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border ${colorClass.split(' ')[2]} dark:bg-gray-800 group relative overflow-hidden`}>
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${colorClass.split(' ')[0]}`}></div>
            <h2 className={`text-2xl font-bold mb-3 ${colorClass.split(' ')[1]} dark:text-gray-100 flex items-center justify-between`}>
                {title}
                <span className="opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300 text-xl">→</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 font-medium">{desc}</p>
        </Link>
    );
}
