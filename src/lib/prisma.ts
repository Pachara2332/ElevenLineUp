
import { PrismaClient } from '@prisma/client';
import { config } from '@/config/unifiedConfig';

const prismaClientSingleton = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: config.db.url,
      },
    },
  });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
