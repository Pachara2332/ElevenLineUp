import { redirect } from 'next/navigation';
import { checkAdmin } from '@/lib/admin-auth';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
        redirect('/');
    }

    return (
        <div className="flex min-h-screen bg-emerald-50 dark:bg-gray-900 font-outfit">
            <AdminSidebar />

            {/* Main Content */}
            <main className="flex-1 p-8 lg:p-12 overflow-auto text-gray-800 dark:text-gray-100">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
