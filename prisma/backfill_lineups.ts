import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Function to generate a simple slug from lineup name and formation
// e.g., "Arsenal 4-3-3" -> "arsenal-4-3-3-randomhash"
function generateSlug(name: string, formation: string): string {
  const base = `${name}-${formation}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const uniqueId = Math.random().toString(36).substring(2, 8);
  return `${base}-${uniqueId}`;
}

async function main() {
  console.log('Starting lineup slug backfill...');
  
  // @ts-ignore - slug is added to the schema but client might not be generated yet
  const lineups = await prisma.lineup.findMany({
    where: { slug: null },
  });

  console.log(`Found ${lineups.length} lineups to backfill.`);

  for (const lineup of lineups) {
    const slug = generateSlug(lineup.name, lineup.formation);
    
    // @ts-ignore
    await prisma.lineup.update({
      where: { lineupId: lineup.lineupId },
      data: { slug },
    });
    
    console.log(`Updated lineup ${lineup.lineupId} with slug: ${slug}`);
  }

  console.log('Backfill complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
