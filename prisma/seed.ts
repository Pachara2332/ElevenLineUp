
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TEAMS = [
  { name: 'Arsenal', logo: 'arsenal.png', players: [] },
  { name: 'Manchester City', logo: 'man-city.png', players: [] },
  { name: 'Liverpool', logo: 'liverpool.png', players: [] },
  { name: 'Chelsea', logo: 'chelsea.png', players: [] },
  { name: 'Manchester United', logo: 'man-utd.png', players: [] },
  { name: 'Tottenham', logo: 'tottenham.png', players: [] },
];

async function main() {
  console.log('Start seeding ...');
  
  for (const team of TEAMS) {
    const t = await prisma.premierTeam.create({
      data: {
        name: team.name,
        logo: team.logo,
        players: team.players,
      },
    });
    console.log(`Created team with id: ${t.id}`);
  }

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
