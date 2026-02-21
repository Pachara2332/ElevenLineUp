import prisma from '@/lib/prisma';
import FixturesClient from './FixturesClient';

export default async function AdminFixturesPage() {
    const fixtures = await prisma.fixture.findMany({
        orderBy: { kickoff: 'asc' },
    });

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Manage Fixtures</h1>
            <FixturesClient initialFixtures={fixtures} />
        </div>
    );
}
