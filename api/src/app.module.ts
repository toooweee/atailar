import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { EncryptionModule } from './encryption/encryption.module';
import { EnvModule } from './env/env.module';
import { ConfigModule } from '@nestjs/config';
import { validate } from './env/env';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    EncryptionModule,
    EnvModule,
    PrismaModule,
    UsersModule,
    SeedModule,
  ],
})
export class AppModule {}
