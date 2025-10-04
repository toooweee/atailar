import { SeedService } from './seed.service';
import { Module } from '@nestjs/common';
import { EncryptionModule } from '../encryption/encryption.module';

@Module({
  imports: [EncryptionModule],
  providers: [SeedService],
})
export class SeedModule {}
