import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EncryptionService } from '../encryption/encryption.service';
import { Role } from 'generated/prisma';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly encryptionService: EncryptionService,
  ) {}

  async onModuleInit() {
    await this.seedUsers();
  }

  private async seedUsers() {
    const passwordHash = await this.encryptionService.hashPassword('asdfjkl');

    const users = [{ id: 'uuid', email: 'admin@gmail.com', passwordHash, role: Role.ADMIN }];

    for (const user of users) {
      await this.prisma.user.upsert({
        where: { id: user.id },
        update: {},
        create: { ...user },
      });
    }
    this.logger.log('Admin successfully seeded');
  }
}
