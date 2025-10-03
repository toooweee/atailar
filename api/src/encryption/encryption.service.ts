import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class EncryptionService {
  private readonly logger = new Logger(EncryptionService.name);

  async hashPassword(rawPassword: string): Promise<string> {
    if (!rawPassword) {
      this.logger.error('Password is required');
      throw new BadRequestException('Password is required');
    }

    try {
      return await argon2.hash(rawPassword);
    } catch (err: unknown) {
      this.logger.error('Failed to hash password', err);
      throw new InternalServerErrorException('Failed to hash password');
    }
  }

  async verifyPassword(rawPassword: string = '', hashedPassword: string): Promise<boolean> {
    if (!rawPassword) {
      this.logger.error('Password is required');
      throw new BadRequestException('Password is required');
    }

    try {
      return await argon2.verify(hashedPassword, rawPassword);
    } catch (err: unknown) {
      this.logger.error('Failed to verify password', err);
      throw new InternalServerErrorException('Failed to verify password');
    }
  }
}
