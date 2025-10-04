import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { convertToMiliSecondsUtil,  Public } from '@app/common';
import {  Response } from 'express';

import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { EnvService } from '../env/env.service';
import RequestWithUser from './requests/user.request';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly envService: EnvService,
  ) {}

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken } = await this.authService.login(loginDto);

    const at_exp = this.envService.get('AT_EXPIRES_IN') ?? '';

    res.cookie('access_token', accessToken, {
      maxAge: convertToMiliSecondsUtil(at_exp),
      httpOnly: true,
      sameSite: 'strict',
    });

    return { accessToken };
  }

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
}
