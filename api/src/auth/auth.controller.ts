import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { convertToMiliSecondsUtil, cookieFactory } from '@app/common';
import { EnvService } from '../env/env.service';
import RequestWithUser from './requests/user.request';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly envService: EnvService,
  ) {}

  @Post()
  async login(@Body() loginDto: LoginDto, @Res() res: Response, @Req() req: Request) {
    const { accessToken } = await this.authService.login(loginDto);

    const cookies = cookieFactory(res, req);
    const at_exp = this.envService.get('AT_EXPIRES_IN') ?? '';
    cookies.set('access_token', accessToken, convertToMiliSecondsUtil(at_exp));

    return { accessToken };
  }

  @Post('logout')
  async logout(@Res() res: Response, @Req() req: Request) {
    const cookies = cookieFactory(res, req);

    cookies.remove('access_token');

    return { success: true };
  }

  @Get('me')
  async getAuthenticateUser(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    const user = await this.authService.me(userId);

    return user;
  }
}
