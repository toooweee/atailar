import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSecretDto } from './dtos/create-secret.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SecretsService {
  constructor(private readonly prisma: PrismaService) {
  }

  async createSecret(dto: CreateSecretDto) {
    const secret = await this.prisma.secret.findUnique({
      where: {
        name: dto.name
      }
    });
    if(secret) {
      throw new ConflictException('Name already exists');
    }

    return this.prisma.secret.create({
      data: {
        name: dto.name,
        encryptedValue: dto.encryptionValue
      }
    })
  }

  getAllSecrets() {
    return this.prisma.secret.findMany();
  }

  // поставить ограничение если заявка не одобрена
  async getOne(id: string) {
    const secret = await this.prisma.secret.findUnique({
      where: {
        id
      }
    });
    if(!secret) {
      throw new NotFoundException('Secret not found')
    }

    return secret;
  }
}
