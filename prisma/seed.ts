import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

interface ScrapedPlayer {
  name: string;
  position: string;
  number: string;
  wiki_url?: string;
  image_url?: string;
}

interface ScrapedTeam {
  name: string;
  league: string;
  logo_url: string;
  players: ScrapedPlayer[];
}

async function main() {
  console.log('🌱 Starting database seed...');

  // Read the scraped data
  const dataPath = path.join(__dirname, 'scraped_data.json');
  
  if (!fs.existsSync(dataPath)) {
    console.error('❌ scraped_data.json not found! Run the scraper first.');
    process.exit(1);
  }

  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const scrapedTeams: ScrapedTeam[] = JSON.parse(rawData);

  console.log(`📊 Found ${scrapedTeams.length} teams to seed`);

  // Clear existing teams
  console.log('🗑️ Clearing existing teams...');
  await prisma.team.deleteMany();

  // Insert teams with players as JSON
  let successCount = 0;
  for (const team of scrapedTeams) {
    try {
      // Format players for the JSON field
      const players = team.players.map((p, idx) => ({
        id: `${team.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${idx + 1}`,
        name: p.name,
        position: p.position,
        number: parseInt(p.number) || 0,
        image: p.image_url || null,
        nationality: '',
        age: 0,
        rating: 75,
      }));

      await prisma.team.create({
        data: {
          name: team.name,
          league: team.league,
          logo: team.logo_url,
          players: players,
        },
      });

      successCount++;
      console.log(`  ✅ ${team.name} (${team.league}) - ${players.length} players`);
    } catch (error) {
      console.error(`  ❌ Failed to insert ${team.name}:`, error);
    }
  }

  console.log(`\n🎉 Seeding complete! ${successCount}/${scrapedTeams.length} teams inserted.`);
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });