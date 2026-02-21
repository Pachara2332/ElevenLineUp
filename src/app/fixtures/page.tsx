import prisma from '@/lib/prisma';
import FixturesList from './FixturesList';

export default async function PublicFixturesPage() {
    // Fetch all fixtures ordered by kickoff time
    const fixtures = await prisma.fixture.findMany({
        orderBy: { kickoff: 'asc' },
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 p-6 bg-gradient-to-r from-emerald-800 to-emerald-900 rounded-3xl shadow-xl text-white">
                <h1 className="text-4xl font-black tracking-tight mb-2">Match Fixtures</h1>
                <p className="text-emerald-100/80">View the latest schedules, live scores, and past results.</p>
            </div>

            <FixturesList fixtures={fixtures} />
        </div>
    );
}
