import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { cookieFactory, IS_PUBLIC_KEY } from '@app/common';

import { EnvService } from '../../env/env.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly envService: EnvService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    const cookies = cookieFactory(res, req);

    const token = cookies.get('access_token');
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.envService.get('AT_JWT_SECRET'),
        ignoreExpiration: false,
      });

      req['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
