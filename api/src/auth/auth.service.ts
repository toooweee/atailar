import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dtos/login.dto';
import { UserPayload } from './types/user.payload';
import { JwtService } from '@nestjs/jwt';
import { UserM } from './entities/user';
import { UsersService } from '../users/users.service';
import { EnvService } from '../env/env.service';
import { convertToMiliSecondsUtil } from '@app/common';
import { RefreshTokenPayload } from './types/refresh.payload';
import { addMilliseconds } from 'date-fns';
import { EncryptionService } from '../encryption/encryption.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly envService: EnvService,
    private readonly encryptionService: EncryptionService,
    private readonly prisma: PrismaService
  ) {}

  async login(dto: LoginDto) {
    const user = await this.usersService.validateUser(dto.email, dto.password);

    const { accessToken, refreshToken } = await this.issuingTokens(user);


    return { accessToken, refreshToken };
  }

  async me(userId: string) {
    const user = await this.usersService.findOneById(userId);

    if(user.isFirstLogin) {
      await this.prisma.user.update({
        where: {
          id: user.id
        },
        data: {
          isFirstLogin: false
        }
      })
    }

    return user;
  }

  async refreshTokens(userId: string, oldRefresh: string){
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: {
        userId
      }
    });
    if (!storedToken) {
      throw new UnauthorizedException('No Refresh Token Found');
    }
    const isVerifyTokens = await this.encryptionService.verifyPassword(
      oldRefresh,
      storedToken.tokenHash,
    );
    if (!isVerifyTokens) {
      throw new UnauthorizedException('Invalid Refresh Token');
    }

    const user = await this.usersService.findOneById(userId);

    return this.issuingTokens(user);
  }

  private async generateAt(userPayload: UserPayload): Promise<string> {
    const accessToken = await this.jwtService.signAsync(userPayload);
    return accessToken;
  }

  private getRtExp(): Date {
    const exp = convertToMiliSecondsUtil(this.envService.get('RT_EXPIRES_IN') as string);
    const expiresAt = addMilliseconds(new Date(), exp);
    return expiresAt;
  }

  private async generateRt(
    refreshTokenPayload: { userId: string | undefined; expiresAt: Date },
  ): Promise<string> {
    const refreshToken = await this.jwtService.signAsync(refreshTokenPayload, {
      secret: this.envService.get('RT_JWT_SECRET'),
      expiresIn: this.envService.get('RT_EXPIRES_IN'),
    });
    return refreshToken;
  }

  private async issuingTokens(user: UserM) {
    const accessToken = await this.generateAt({
      sub: user.id!,
      email: user.email,
      role: user.role!,
      isFirstLogin: user.isFirstLogin!
    });

    const expiresAt = this.getRtExp();

    const refreshToken = await this.generateRt({ userId: user.id, expiresAt });

    const tokenHash = await this.encryptionService.hashPassword(refreshToken);
    await this.prisma.refreshToken.upsert({
      where: {
        userId: user.id
      },
      update: {
        expiresAt,
        tokenHash,
        userId: user.id,
      },
       create: {
         expiresAt,
         tokenHash,
         userId: user.id,
       }
    });

    return { accessToken, refreshToken };
  }
}
