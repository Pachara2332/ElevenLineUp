
import prisma from '../lib/prisma';

async function main() {
  console.log('🌱 Seeding Mini Games...');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 1. Tic-Tac-Toe
  await prisma.dailyTicTacToe.upsert({
    where: { date: today },
    update: {},
    create: {
      date: today,
      rows: [
        { label: 'Arsenal', type: 'TEAM', value: 'Arsenal' },
        { label: 'Man City', type: 'TEAM', value: 'Man City' },
        { label: 'Liverpool', type: 'TEAM', value: 'Liverpool' }
      ],
      cols: [
        { label: 'England', type: 'NATION', value: 'England' },
        { label: 'Brazil', type: 'NATION', value: 'Brazil' },
        { label: 'Real Madrid', type: 'TEAM', value: 'Real Madrid' }
      ],
      solutions: {
        "0-0": ["Bukayo Saka", "Declan Rice", "Aaron Ramsdale"], // Arsenal x England
        "0-1": ["Gabriel Jesus", "Gabriel Martinelli", "Gabriel Magalhães"], // Arsenal x Brazil
        "0-2": ["Mesut Özil", "Nicolas Anelka", "Martin Ødegaard"], // Arsenal x Real Madrid (Ødegaard played for both)
        "1-0": ["Phil Foden", "Jack Grealish", "Kyle Walker"], // City x England
        "1-1": ["Ederson", "Savinho"], // City x Brazil
        "1-2": ["Mateo Kovačić", "Brahim Díaz", "Emmanuel Adebayor"], // City x Real Madrid
        "2-0": ["Trent Alexander-Arnold", "Curtis Jones"], // Liverpool x England
        "2-1": ["Alisson Becker", "Roberto Firmino"], // Liverpool x Brazil
        "2-2": ["Michael Owen", "Xabi Alonso", "Jerzy Dudek"] // Liverpool x Real Madrid
      }
    }
  });
  console.log('✅ Created Daily Tic-Tac-Toe');

  // 2. Missing XI (Barcelona 2009 UCL Final vs Man Utd)
  await prisma.dailyMissingXI.upsert({
    where: { date: today },
    update: {},
    create: {
      date: today,
      teamName: 'Barcelona (2009 UCL Final)',
      formation: '4-3-3',
      players: [
        { name: "Victor Valdés", position: "GK", x: 50, y: 88, isMissing: false },
        { name: "Carles Puyol", position: "RB", x: 80, y: 70, isMissing: false },
        { name: "Yaya Touré", position: "CB", x: 60, y: 75, isMissing: true }, // MISSING
        { name: "Gerard Piqué", position: "CB", x: 40, y: 75, isMissing: false },
        { name: "Sylvinho", position: "LB", x: 20, y: 70, isMissing: false },
        { name: "Sergio Busquets", position: "CDM", x: 50, y: 60, isMissing: false },
        { name: "Xavi", position: "CM", x: 70, y: 50, isMissing: false },
        { name: "Andrés Iniesta", position: "CM", x: 30, y: 50, isMissing: true }, // MISSING
        { name: "Lionel Messi", position: "RW", x: 80, y: 30, isMissing: false },
        { name: "Samuel Eto'o", position: "ST", x: 50, y: 25, isMissing: true }, // MISSING
        { name: "Thierry Henry", position: "LW", x: 20, y: 30, isMissing: false }
      ]
    }
  });
  console.log('✅ Created Daily Missing XI');

  // 3. Who Are Ya? (Guess based on blurred image)
  await prisma.dailyWhoAreYa.upsert({
    where: { date: today },
    update: {},
    create: {
      date: today,
      playerName: "Erling Haaland",
      teamName: "Manchester City",
      blurredImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Erling_Haaland_2023.jpg/800px-Erling_Haaland_2023.jpg",
      pixelateLevel: 20
    }
  });
  console.log('✅ Created Daily Who Are Ya?');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
