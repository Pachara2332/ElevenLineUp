import prisma from '@/lib/prisma';
import AdminOverviewClient from './AdminOverviewClient';

export default async function AdminDashboard() {
    const usersCount = await prisma.user.count();
    const lineupsCount = await prisma.lineup.count();
    const postsCount = await prisma.post.count();
    const fixturesCount = await prisma.fixture.count();

    return (
        <AdminOverviewClient
            usersCount={usersCount}
            lineupsCount={lineupsCount}
            postsCount={postsCount}
            fixturesCount={fixturesCount}
        />
    );
}
