import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { EnvService } from '../env/env.service';
import { EnvModule } from '../env/env.module';
import { EncryptionModule } from '../encryption/encryption.module';

@Module({
  imports: [
    EncryptionModule,
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
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
