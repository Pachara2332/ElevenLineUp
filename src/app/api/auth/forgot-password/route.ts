
import { ApiHandler } from '@/lib/api-handler';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { AuthService } from '@/lib/auth-service';

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const POST = ApiHandler.handle(async (req) => {
  const body = await req.json();
  const { email } = forgotPasswordSchema.parse(body);

  const user = await prisma.user.findUnique({
    where: { email },
  });

  // Always return success to prevent email enumeration
  if (!user) {
    return ApiHandler.success({ message: 'If an account exists, a reset link has been sent.' });
  }

  const resetToken = await AuthService.createPasswordResetToken(email);

  // MOCK EMAIL SERVICE
  // In production, send this via email provider
  const resetLink = `http://localhost:3000/auth/reset-password?token=${resetToken.token}`;
  console.log('---------------------------------------------------');
  console.log(`[Mock Email Service] Password Reset Link for ${email}:`);
  console.log(resetLink);
  console.log('---------------------------------------------------');

  return ApiHandler.success({ message: 'If an account exists, a reset link has been sent.' });
});
