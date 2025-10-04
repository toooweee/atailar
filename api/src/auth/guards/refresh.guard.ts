import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { cookieFactory } from '@app/common';
import { RefreshTokenPayload } from '../types/refresh.payload';
import { EnvService } from '../../env/env.service';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly envService: EnvService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    const cookies = cookieFactory(res, req);

    const token = cookies.get('refresh_token');
    if (!token) {
      throw new UnauthorizedException('Refresh Token not Found');
    }

    try {
      const payload: RefreshTokenPayload = await this.jwtService.verifyAsync(
        token,
        {
          secret: this.envService.get('RT_JWT_SECRET'),
          ignoreExpiration: true,
        },
      );

      req['user'] = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid Refresh Token');
    }
  }
}
