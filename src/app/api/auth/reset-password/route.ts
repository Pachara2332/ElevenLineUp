
import { ApiHandler } from '@/lib/api-handler';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { AuthService } from '@/lib/auth-service';

const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(6),
});

export const POST = ApiHandler.handle(async (req) => {
  const body = await req.json();
  const { token, password } = resetPasswordSchema.parse(body);

  const resetToken = await AuthService.verifyPasswordResetToken(token);

  if (!resetToken) {
    return ApiHandler.error('Invalid or expired reset token', 400, 'INVALID_TOKEN');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Update User Password
  await prisma.user.update({
    where: { email: resetToken.email },
    data: { password: hashedPassword },
  });

  // Delete Token
  await AuthService.deletePasswordResetToken(resetToken.id);

  return ApiHandler.success({ message: 'Password has been reset successfully.' });
});
