import { PrismaClient } from '@prisma/client';
import { addDays, startOfDay } from 'date-fns';

const prisma = new PrismaClient();

async function main() {
  console.log('🎮 Starting mini-games seed...');

  // Start with yesterday, go up to +5 days
  const today = startOfDay(new Date());

  // Clear existing mini-games data
  console.log('🗑️ Clearing existing mini-games data...');
  await prisma.dailyTicTacToe.deleteMany();
  await prisma.dailyMissingXI.deleteMany();
  await prisma.dailyWhoAreYa.deleteMany();

  let successCount = 0;

  for (let i = -1; i <= 5; i++) {
    const gameDate = addDays(today, i);

    try {
      // 1. DailyTicTacToe (Mock Data)
      await prisma.dailyTicTacToe.create({
        data: {
          date: gameDate,
          rows: [
            { label: 'Arsenal', type: 'TEAM', value: 'arsenal' },
            { label: 'Man City', type: 'TEAM', value: 'mancity' },
            { label: 'Chelsea', type: 'TEAM', value: 'chelsea' }
          ],
          cols: [
            { label: 'English', type: 'NATION', value: 'england' },
            { label: 'Midfielder', type: 'POSITION', value: 'midfielder' },
            { label: 'Played for Real Madrid', type: 'CLUB_HISTORY', value: 'real_madrid' }
          ],
          solutions: {
            "0-0": ["Bukayo Saka", "Declan Rice"],
            "0-1": ["Martin Odegaard", "Thomas Partey"],
            "0-2": ["Mesut Ozil", "Dani Ceballos"],
            "1-0": ["Phil Foden", "Jack Grealish"],
            "1-1": ["Kevin De Bruyne", "Rodri"],
            "1-2": ["Brahim Diaz", "Robinho"],
            "2-0": ["Mason Mount", "Raheem Sterling"],
            "2-1": ["Enzo Fernandez", "Moises Caicedo"],
            "2-2": ["Eden Hazard", "Mateo Kovacic"]
          }
        }
      });

      // 2. DailyMissingXI (Mock Data)
      await prisma.dailyMissingXI.create({
        data: {
          date: gameDate,
          teamName: 'Manchester United (2008)',
          formation: '4-4-2',
          players: [
            { position: 'GK', name: 'Edwin van der Sar', x: 50, y: 10, isMissing: false },
            { position: 'RB', name: 'Wes Brown', x: 80, y: 30, isMissing: false },
            { position: 'CB', name: 'Rio Ferdinand', x: 65, y: 25, isMissing: true },
            { position: 'CB', name: 'Nemanja Vidic', x: 35, y: 25, isMissing: false },
            { position: 'LB', name: 'Patrice Evra', x: 20, y: 30, isMissing: false },
            { position: 'RM', name: 'Cristiano Ronaldo', x: 80, y: 60, isMissing: true },
            { position: 'CM', name: 'Paul Scholes', x: 60, y: 55, isMissing: false },
            { position: 'CM', name: 'Michael Carrick', x: 40, y: 55, isMissing: false },
            { position: 'LM', name: 'Ryan Giggs', x: 20, y: 60, isMissing: false },
            { position: 'ST', name: 'Wayne Rooney', x: 60, y: 85, isMissing: true },
            { position: 'ST', name: 'Carlos Tevez', x: 40, y: 85, isMissing: false }
          ]
        }
      });

      // 3. DailyWhoAreYa (Mock Data)
      await prisma.dailyWhoAreYa.create({
        data: {
          date: gameDate,
          playerId: `mock_player_${i}`,
          playerName: i % 2 === 0 ? 'Erling Haaland' : 'Lionel Messi',
          teamName: i % 2 === 0 ? 'Manchester City' : 'Inter Miami',
          blurredImage: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=200&auto=format&fit=crop',
          pixelateLevel: 20 - (i * 2) // Gradually gets clearer or changes diff logic
        }
      });

      successCount++;
    } catch (e) {
      console.error(`❌ Failed to seed mini-games for day ${i}:`, e);
    }
  }

  console.log(`\n🎉 Mini-games seeding complete! Added records for ${successCount} days.`);
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
