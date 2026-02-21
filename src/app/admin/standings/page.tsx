import prisma from '@/lib/prisma';
import StandingsClient from './StandingsClient';

export default async function AdminStandingsPage() {
    const standings = await prisma.leagueStanding.findMany({
        orderBy: { position: 'asc' },
    });

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Manage League Standings</h1>
            <StandingsClient initialStandings={standings} />
        </div>
    );
}
