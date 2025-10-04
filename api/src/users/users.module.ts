import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { EncryptionModule } from '../encryption/encryption.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    EncryptionModule,
    MailModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
