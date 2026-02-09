
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Start seeding from JSON...');

  const dataPath = path.join(process.cwd(), 'data', 'premierleague-2025-26.json');
  
  if (!fs.existsSync(dataPath)) {
    console.error(`Error: Data file not found at ${dataPath}`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const leagueData = JSON.parse(rawData);

  const leagueName = leagueData.name || 'Premier League';
  const season = leagueData.season || '2025-2026';

  console.log(`Processing ${leagueName} Season ${season}`);

  // Seed Standings
  for (const team of leagueData.standings) {
    await prisma.leagueStanding.upsert({
      where: {
        league_season_teamName: {
          league: leagueName,
          season: season,
          teamName: team.team,
        },
      },
      update: {
        position: team.position,
        played: team.played,
        won: team.won,
        drawn: team.drawn,
        lost: team.lost,
        goalsFor: team.goalsFor,
        goalsAgainst: team.goalsAgainst,
        points: team.points,
        form: team.form,
      },
      create: {
        league: leagueName,
        season: season,
        teamName: team.team,
        position: team.position,
        played: team.played,
        won: team.won,
        drawn: team.drawn,
        lost: team.lost,
        goalsFor: team.goalsFor,
        goalsAgainst: team.goalsAgainst,
        points: team.points,
        form: team.form,
      },
    });
  }
  console.log(`✅ Upserted ${leagueData.standings.length} standings.`);

  // Seed Fixtures
  if (leagueData.fixtures && leagueData.fixtures.length > 0) {
      const fixturesData = leagueData.fixtures.map((f: any) => ({
          league: leagueName,
          season: season,
          homeTeam: f.homeTeam,
          awayTeam: f.awayTeam,
          kickoff: new Date(f.dateUtc),
          status: f.status || 'scheduled'
      }));

      // Use createMany with skipDuplicates for better performance and safety
      const createdFixtures = await prisma.fixture.createMany({
          data: fixturesData,
          skipDuplicates: true
      });

      console.log(`✅ Processed fixtures. Created: ${createdFixtures.count} new fixtures.`);
  }

  console.log('🏁 Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
