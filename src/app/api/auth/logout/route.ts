
import { ApiHandler } from '@/lib/api-handler';
import { cookies } from 'next/headers';
import { config } from '@/config/unifiedConfig';
import { AuthService } from '@/lib/auth-service';

export const POST = ApiHandler.handle(async (req) => {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refresh_token')?.value;

  if (refreshToken) {
    await AuthService.revokeRefreshToken(refreshToken);
  }

  cookieStore.delete(config.auth.cookieName);
  cookieStore.delete('refresh_token');
  
  return ApiHandler.success({ message: 'Logged out successfully' });
});
