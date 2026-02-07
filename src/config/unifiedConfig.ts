
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  NEXT_PUBLIC_API_URL: z.string().url().optional().default('http://localhost:3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

const processEnv = {
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NODE_ENV: process.env.NODE_ENV,
};

// Parse and validate environment variables
// Ensure this runs only on the server or use a more robust isomorphic env handler if needed specifically for client vars
const parsedEnv = envSchema.safeParse(processEnv);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:', parsedEnv.error.flatten().fieldErrors);
  // In a real app, you might want to throw here to fail fast on startup
  // throw new Error('Invalid environment variables');
}

export const config = {
  db: {
    url: process.env.DATABASE_URL!,
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'default-secret-do-not-use-in-production',
    cookieName: 'auth_token',
  },
  app: {
    url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    env: process.env.NODE_ENV || 'development',
  },
};
