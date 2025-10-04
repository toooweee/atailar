import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { EnvService } from '../env/env.service';
import { EnvModule } from '../env/env.module';
import { UsersModule } from '../users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [EnvModule],
      useFactory: (envService: EnvService) => ({
        global: true,
        secret: envService.get('AT_JWT_SECRET'),
        signOptions: {
          expiresIn: envService.get('AT_EXPIRES_IN'),
        },
      }),
      inject: [EnvService],
    }),
  ],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
