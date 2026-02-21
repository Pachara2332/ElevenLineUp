import prisma from '../src/lib/prisma';

const seedFixtures = [
  { league: 'Premier League', season: '2023/24', homeTeam: 'Aston Villa', awayTeam: 'Leeds United', kickoff: new Date(new Date().setHours(22, 0, 0, 0)), status: 'scheduled' },
  { league: 'Premier League', season: '2023/24', homeTeam: 'Brentford', awayTeam: 'Brighton', kickoff: new Date(new Date().setHours(22, 0, 0, 0)), status: 'scheduled' },
  { league: 'Premier League', season: '2023/24', homeTeam: 'Chelsea', awayTeam: 'Burnley', kickoff: new Date(new Date().setHours(22, 0, 0, 0)), status: 'scheduled' },
  { league: 'Premier League', season: '2023/24', homeTeam: 'West Ham United', awayTeam: 'Bournemouth', kickoff: new Date(new Date(Date.now() + 86400000).setHours(0, 30, 0, 0)), status: 'scheduled' },
  { league: 'Premier League', season: '2023/24', homeTeam: 'Manchester City', awayTeam: 'Newcastle United', kickoff: new Date(new Date(Date.now() + 86400000).setHours(3, 0, 0, 0)), status: 'scheduled' },
  { league: 'Premier League', season: '2023/24', homeTeam: 'Nottingham Forest', awayTeam: 'Liverpool', kickoff: new Date(new Date(Date.now() + 86400000).setHours(21, 0, 0, 0)), status: 'scheduled' },
  { league: 'Premier League', season: '2023/24', homeTeam: 'Crystal Palace', awayTeam: 'Wolverhampton Wanderers', kickoff: new Date(new Date(Date.now() + 86400000).setHours(21, 0, 0, 0)), status: 'scheduled' },
  { league: 'Premier League', season: '2023/24', homeTeam: 'Sunderland', awayTeam: 'Fulham', kickoff: new Date(new Date(Date.now() + 86400000).setHours(21, 0, 0, 0)), status: 'scheduled' },
  { league: 'Premier League', season: '2023/24', homeTeam: 'Tottenham Hotspur', awayTeam: 'Arsenal', kickoff: new Date(new Date(Date.now() + 86400000).setHours(23, 30, 0, 0)), status: 'scheduled' },
  { league: 'Premier League', season: '2023/24', homeTeam: 'Everton', awayTeam: 'Manchester United', kickoff: new Date(new Date(Date.now() + 2 * 86400000).setHours(3, 0, 0, 0)), status: 'scheduled' },
];

async function main() {
  for (const fixture of seedFixtures) {
    await prisma.fixture.upsert({
      where: {
        league_season_homeTeam_awayTeam_kickoff: {
          league: fixture.league,
          season: fixture.season,
          homeTeam: fixture.homeTeam,
          awayTeam: fixture.awayTeam,
          kickoff: fixture.kickoff,
        }
      },
      update: { status: fixture.status },
      create: fixture
    });
  }
  console.log('Successfully seeded fixtures!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
