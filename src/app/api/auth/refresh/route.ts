
import { ApiHandler } from '@/lib/api-handler';
import { cookies } from 'next/headers';
import { AuthService } from '@/lib/auth-service';
import { config } from '@/config/unifiedConfig';

export const POST = ApiHandler.handle(async (req) => {
  const cookieStore = await cookies();
  const oldRefreshToken = cookieStore.get('refresh_token')?.value;

  if (!oldRefreshToken) {
    return ApiHandler.error('No refresh token provided', 401, 'NO_REFRESH_TOKEN');
  }

  try {
    const { accessToken, refreshToken } = await AuthService.rotateRefreshToken(oldRefreshToken);

    // Update Cookies
    cookieStore.set(config.auth.cookieName, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60, // 15 minutes
      path: '/',
    });

    cookieStore.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return ApiHandler.success({ message: 'Token refreshed' });

  } catch (error) {
    // If rotation fails (e.g., invalid/revoked/expired token), clear cookies
    cookieStore.delete(config.auth.cookieName);
    cookieStore.delete('refresh_token');
    return ApiHandler.error('Invalid refresh token', 401, 'INVALID_REFRESH_TOKEN');
  }
});
