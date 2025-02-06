import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class RefreshTokenService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  async refreshTokens(refreshToken: string) {
    const tokenData = await this.prisma.verifyResetToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!tokenData || tokenData.expiresAt < new Date()) {
      throw new Error('Invalid or expired refresh token');
    }
    const payload = {
      id: tokenData.user.id,
      name: tokenData.user.name,
      roles: tokenData.user.roles,
    };

    const newRefreshToken = this.jwtService.sign(payload, {
      expiresIn: '1h',
    });
    await this.prisma.verifyResetToken.delete({
      where: { userId: tokenData.user.id },
    });

    await this.prisma.verifyResetToken.create({
      data: {
        token: newRefreshToken,
        userId: tokenData.user.id,
        expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      },
    });
  }

  OnModuleInit() {
    this.scheduleTokenCleanup();
  }

  private scheduleTokenCleanup() {
    const interval = setInterval(
      () => this.deleteExpiredTokens(),
      60 * 60 * 1000,
    );
    this.schedulerRegistry.addInterval('tokenCleanup', interval);
  }

  async deleteExpiredTokens() {
    await this.prisma.verifyResetToken.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
  }
}
