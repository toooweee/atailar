import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { convertToMiliSecondsUtil, cookieFactory, Public } from '@app/common';
import {  Response, Request } from 'express';

import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { EnvService } from '../env/env.service';
import RequestWithUser from './requests/user.request';
import { RefreshTokenGuard } from './guards/refresh.guard';
import { RefreshTokenPayload } from './types/refresh.payload';

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
  async getAuthenticateUser(@Req() req: RequestWithUser) {
    const userId = req.user.sub;
    const user = await this.authService.me(userId);

    return user;
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refreshTokens(@Req() req: Request & { user: RefreshTokenPayload}, @Res({passthrough: true}) res: Response) {
    const cookies = cookieFactory(res, req);

    const userId = req.user['userId'];
    const oldRefresh = cookies.get('refresh_token') ?? '';

    const { accessToken, refreshToken } = await this.authService.refreshTokens(
      userId,
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
