import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { convertToMiliSecondsUtil, cookieFactory, Public, User } from '@app/common';
import {  Response, Request } from 'express';

import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { EnvService } from '../env/env.service';
import { RefreshTokenGuard } from './guards/refresh.guard';
import { RefreshTokenPayload } from './types/refresh.payload';
import { UserPayload } from './types/user.payload';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly envService: EnvService,
  ) {}

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } = await this.authService.login(loginDto);

    const at_exp = this.envService.get('AT_EXPIRES_IN') ?? '';

    res.cookie('access_token', accessToken, {
      maxAge: convertToMiliSecondsUtil(at_exp),
      httpOnly: true,
      sameSite: 'strict',
    });

    const rt_exp = this.envService.get('RT_EXPIRES_IN') ?? '';

    res.cookie('refresh_token', refreshToken, {
      maxAge: convertToMiliSecondsUtil(rt_exp),
      httpOnly: true,
      sameSite: 'strict',
    });

    return { accessToken, refreshToken };
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.cookie('access_token', '', {
      maxAge: 0,
      httpOnly: true,
      sameSite: 'strict',
    });

    return { success: true };
  }

  @Get('me')
  async getAuthenticateUser(@User() currentUser: UserPayload) {
    const user = await this.authService.me(currentUser.sub);

    return user;
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refreshTokens(@User() currentUser:  RefreshTokenPayload, @Res({passthrough: true}) res: Response, @Req() req: Request) {
    const cookies = cookieFactory(res, req);

    const oldRefresh = cookies.get('refresh_token') ?? '';

    const { accessToken, refreshToken } = await this.authService.refreshTokens(
      currentUser.userId,
      oldRefresh,
    );

    const at_exp = this.envService.get('AT_EXPIRES_IN') ?? '';

    res.cookie('access_token', accessToken, {
      maxAge: convertToMiliSecondsUtil(at_exp),
      httpOnly: true,
      sameSite: 'strict',
    });

    const rt_exp = this.envService.get('RT_EXPIRES_IN') ?? '';

    res.cookie('refresh_token', refreshToken, {
      maxAge: convertToMiliSecondsUtil(rt_exp),
      httpOnly: true,
      sameSite: 'strict',
    });

    return { accessToken, refreshToken };
  }
}
