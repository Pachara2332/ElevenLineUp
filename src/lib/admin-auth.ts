import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { config } from '@/config/unifiedConfig';

export async function checkAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(config.auth.cookieName)?.value;

  if (!token) return false;

  try {
    const decoded = jwt.verify(token, config.auth.jwtSecret) as { userId: string; role: string };
    return decoded.role === 'ADMIN';
  } catch (error) {
    return false;
  }
}
