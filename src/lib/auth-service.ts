
import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';
import prisma from '@/lib/prisma';
import { config } from '@/config/unifiedConfig';
import crypto from 'crypto';

interface TokenPayload {
  userId: string;
  email: string;
}

export class AuthService {
  static generateTokens(user: { userId: string; email: string }) {
    const accessToken = jwt.sign(
      { userId: user.userId, email: user.email },
      config.auth.jwtSecret,
      { expiresIn: '15m' } // Short-lived access token
    );

    const refreshToken = crypto.randomBytes(32).toString('hex');

    return { accessToken, refreshToken };
  }

  static async createRefreshToken(userId: string, token: string) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    return await prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });
  }

  static async verifyRefreshToken(token: string) {
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!storedToken) return null;
    if (storedToken.revoked) {
      // Token reuse detection logic could go here (e.g., revoke all user tokens)
      return null;
    }
    if (new Date() > storedToken.expiresAt) {
        await prisma.refreshToken.delete({ where: { id: storedToken.id } }); // Cleanup
        return null;
    }

    return storedToken;
  }

  static async revokeRefreshToken(token: string) {
    try {
      await prisma.refreshToken.update({
        where: { token },
        data: { revoked: true },
      });
    } catch (error) {
      // Ignore if token not found (P2025)
      // This can happen if the token was already deleted or database was reset
      if ((error as any).code !== 'P2025') {
        throw error;
      }
    }
  }

  static async rotateRefreshToken(oldToken: string) {
    const storedToken = await this.verifyRefreshToken(oldToken);
    if (!storedToken) throw new Error('Invalid refresh token');

    // Revoke old token
    await this.revokeRefreshToken(oldToken);

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = this.generateTokens(storedToken.user);
    
    // Save new refresh token
    await this.createRefreshToken(storedToken.userId, newRefreshToken);

    return { accessToken, refreshToken: newRefreshToken };
  }

  static async createPasswordResetToken(email: string) {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    return await prisma.passwordResetToken.create({
      data: {
        token,
        email,
        expiresAt,
      },
    });
  }

  static async verifyPasswordResetToken(token: string) {
    const storedToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!storedToken) return null;
    if (new Date() > storedToken.expiresAt) {
      await prisma.passwordResetToken.delete({ where: { id: storedToken.id } });
      return null;
    }

    return storedToken;
  }

  static async deletePasswordResetToken(id: string) {
      await prisma.passwordResetToken.delete({ where: { id } });
  }
}
