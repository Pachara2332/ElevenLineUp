import prisma from '../src/lib/prisma';

async function main() {
  const email = 'Pachara@gmail.com';
  
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    console.log(`User with email ${email} not found.`);
    return;
  }

  const updatedUser = await prisma.user.update({
    where: { email },
    data: { role: 'ADMIN' }
  });

  console.log(`Successfully elevated ${updatedUser.email} to ADMIN role.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
