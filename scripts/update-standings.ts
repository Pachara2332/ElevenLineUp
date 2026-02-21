import prisma from '../src/lib/prisma';

const seedStandings = [
  { teamName: 'Arsenal', position: 1, played: 27, won: 17, drawn: 7, lost: 3, goalsFor: 52, goalsAgainst: 20 },
  { teamName: 'Manchester City', position: 2, played: 26, won: 16, drawn: 5, lost: 5, goalsFor: 54, goalsAgainst: 24 },
  { teamName: 'Aston Villa', position: 3, played: 26, won: 15, drawn: 5, lost: 6, goalsFor: 37, goalsAgainst: 27 },
  { teamName: 'Manchester United', position: 4, played: 26, won: 12, drawn: 9, lost: 5, goalsFor: 47, goalsAgainst: 37 },
  { teamName: 'Chelsea', position: 5, played: 26, won: 12, drawn: 8, lost: 6, goalsFor: 47, goalsAgainst: 30 },
  { teamName: 'Liverpool', position: 6, played: 26, won: 12, drawn: 6, lost: 8, goalsFor: 41, goalsAgainst: 35 },
  { teamName: 'Brentford', position: 7, played: 26, won: 12, drawn: 4, lost: 10, goalsFor: 40, goalsAgainst: 35 },
  { teamName: 'Everton', position: 8, played: 26, won: 10, drawn: 7, lost: 9, goalsFor: 29, goalsAgainst: 30 },
  { teamName: 'Bournemouth', position: 9, played: 26, won: 9, drawn: 10, lost: 7, goalsFor: 43, goalsAgainst: 45 },
  { teamName: 'Newcastle United', position: 10, played: 26, won: 10, drawn: 6, lost: 10, goalsFor: 37, goalsAgainst: 37 },
  { teamName: 'Sunderland', position: 11, played: 26, won: 9, drawn: 9, lost: 8, goalsFor: 27, goalsAgainst: 30 },
  { teamName: 'Fulham', position: 12, played: 26, won: 10, drawn: 4, lost: 12, goalsFor: 35, goalsAgainst: 40 },
  { teamName: 'Crystal Palace', position: 13, played: 26, won: 8, drawn: 8, lost: 10, goalsFor: 28, goalsAgainst: 32 },
  { teamName: 'Brighton', position: 14, played: 26, won: 7, drawn: 10, lost: 9, goalsFor: 34, goalsAgainst: 34 },
  { teamName: 'Leeds United', position: 15, played: 26, won: 7, drawn: 9, lost: 10, goalsFor: 36, goalsAgainst: 45 },
  { teamName: 'Tottenham Hotspur', position: 16, played: 26, won: 7, drawn: 8, lost: 11, goalsFor: 36, goalsAgainst: 37 },
  { teamName: 'Nottingham Forest', position: 17, played: 26, won: 7, drawn: 6, lost: 13, goalsFor: 25, goalsAgainst: 38 },
  { teamName: 'West Ham United', position: 18, played: 26, won: 6, drawn: 6, lost: 14, goalsFor: 32, goalsAgainst: 49 },
  { teamName: 'Burnley', position: 19, played: 26, won: 4, drawn: 6, lost: 16, goalsFor: 28, goalsAgainst: 51 },
  { teamName: 'Wolverhampton Wanderers', position: 20, played: 27, won: 1, drawn: 7, lost: 19, goalsFor: 18, goalsAgainst: 50 },
];

async function main() {
  const league = 'Premier League';
  const season = '2023/24'; // Adjust as necessary

  for (const team of seedStandings) {
    const goalDifference = team.goalsFor - team.goalsAgainst;
    const points = (team.won * 3) + (team.drawn * 1);

    await prisma.leagueStanding.upsert({
      where: {
        league_season_teamName: {
          league,
          season,
          teamName: team.teamName,
        }
      },
      update: {
        position: team.position,
        played: team.played,
        won: team.won,
        drawn: team.drawn,
        lost: team.lost,
        goalsFor: team.goalsFor,
        goalsAgainst: team.goalsAgainst,
        goalDifference,
        points,
      },
      create: {
        league,
        season,
        teamName: team.teamName,
        position: team.position,
        played: team.played,
        won: team.won,
        drawn: team.drawn,
        lost: team.lost,
        goalsFor: team.goalsFor,
        goalsAgainst: team.goalsAgainst,
        goalDifference,
        points,
      }
    });
  }

  console.log('Successfully updated League Standings!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
