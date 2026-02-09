
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { config } from '@/config/unifiedConfig';
import prisma from '@/lib/prisma';

export async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(config.auth.cookieName)?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, config.auth.jwtSecret) as { userId: string };
    
    // Optional: Check if user still exists in DB if strict consistency is needed
    // For performance, we might verify only token signature, but looking up ensures user isn't banned/deleted
    const user = await prisma.user.findUnique({
      where: { userId: decoded.userId },
      select: { userId: true, name: true, email: true }, // Select minimal fields
    });

    return user;
  } catch (error) {
    return null;
  }
}
