
import { NextResponse } from 'next/server';
import { ApiHandler } from '@/lib/api-handler';
import { cookies } from 'next/headers';
import { config } from '@/config/unifiedConfig';

export const POST = ApiHandler.handle(async (req) => {
  (await cookies()).delete(config.auth.cookieName);
  return ApiHandler.success({ message: 'Logged out successfully' });
});
