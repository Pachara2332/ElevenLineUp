import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🧠 Seeding Brain Games Quizzes...');

    await prisma.quiz.deleteMany();

    const quizzes = [
        // WHO AM I
        {
            type: 'WHO_AM_I' as const,
            difficulty: 'CASUAL' as const,
            answer: 'Mohamed Salah',
            options: [
                'I started my career in Egypt.',
                'I had a brief spell at Chelsea but struggled to find form.',
                'I moved to Italy to play for Fiorentina and Roma.',
                'I returned to England and broke the Premier League scoring record.'
            ]
        },
        {
            type: 'WHO_AM_I' as const,
            difficulty: 'COMPETITIVE' as const,
            answer: 'Son Heung-min',
            options: [
                'I arrived in Europe as a teenager to play in Germany.',
                'I transferred to the Premier League in 2015.',
                'I have won the Puskás Award.',
                'I formed a lethal striking partnership with Harry Kane.'
            ]
        },
        {
            type: 'WHO_AM_I' as const,
            difficulty: 'HARDCORE' as const,
            answer: 'Gareth Bale',
            options: [
                'I started my career as a left-back.',
                'I scored a famous hat-trick against Inter Milan in the Champions League.',
                'I was once the most expensive player in the world.',
                'I "love golf".'
            ]
        },
        // GUESS THE PLAYER
        {
            type: 'IMAGE' as const,
            difficulty: 'CASUAL' as const,
            answer: 'Erling Haaland',
            imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=600&auto=format&fit=crop' // placeholder abstract sports img 
        },
        {
            type: 'IMAGE' as const,
            difficulty: 'COMPETITIVE' as const,
            answer: 'Kevin De Bruyne',
            imageUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=600&auto=format&fit=crop'
        },
        {
            type: 'IMAGE' as const,
            difficulty: 'HARDCORE' as const,
            answer: 'Raheem Sterling',
            imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=600&auto=format&fit=crop'
        },
    ];

    for (const q of quizzes) {
        await prisma.quiz.create({
            data: q
        });
    }

    console.log(`✅ Seeded ${quizzes.length} Quizzes.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
