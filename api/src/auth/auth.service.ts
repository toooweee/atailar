import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dtos/login.dto';
import { UserPayload } from './types/user.payload';
import { EncryptionService } from '../encryption/encryption.service';
import { JwtService } from '@nestjs/jwt';
import { UserM } from './entities/user';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly encryptionService: EncryptionService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) {
      throw new UnauthorizedException('Email Or Password Not Valid');
    }

    const isValidPassword = await this.encryptionService.verifyPassword(user.passwordHash, dto.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Email Or Password Not Valid');
    }

    return this.issuingTokens(user);
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    return user;
  }

  private async generateAt(userPayload: UserPayload): Promise<string> {
    const accessToken = await this.jwtService.signAsync(userPayload);
    return accessToken;
  }

  private async issuingTokens(user: UserM) {
    const accessToken = await this.generateAt({
      sub: user.id!,
      email: user.email,
      role: user.role!,
    });

    return { accessToken };
  }
}
