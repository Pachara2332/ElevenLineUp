
import prisma from '../lib/prisma';

async function main() {
  console.log('🔍 Checking Mini Games Data...');
  
  const ticTacToe = await prisma.dailyTicTacToe.findMany();
  console.log(`❌⭕ TicTacToe Games: ${ticTacToe.length}`);
  ticTacToe.forEach(g => console.log(` - ID: ${g.id}, Date: ${g.date}`));

  const missingXI = await prisma.dailyMissingXI.findMany();
  console.log(`👕 Missing XI Games: ${missingXI.length}`);
  missingXI.forEach(g => console.log(` - ID: ${g.id}, Date: ${g.date}, Team: ${g.teamName}`));

  const whoAreYa = await prisma.dailyWhoAreYa.findMany();
  console.log(`🕵️ Who Are Ya Games: ${whoAreYa.length}`);
  whoAreYa.forEach(g => console.log(` - ID: ${g.id}, Date: ${g.date}, Player: ${g.playerName}`));
  
  const now = new Date();
  console.log('🕒 Server Time:', now.toISOString());
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    // await prisma.$disconnect();
  });
