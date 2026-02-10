import DashboardHeader from '@/components/dashboard/DashboardHeader';

export default function CommunityLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen">
            <DashboardHeader />
            <main>
                {children}
            </main>
        </div>
    );
}
