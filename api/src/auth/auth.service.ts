import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dtos/login.dto';
import { UserPayload } from './types/user.payload';
import { JwtService } from '@nestjs/jwt';
import { UserM } from './entities/user';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.usersService.validateUser(dto.email, dto.password);

    const { accessToken } = await this.issuingTokens(user);
    return { accessToken };
  }

  async me(userId: string) {
    const user = await this.usersService.findOneById(userId);

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
