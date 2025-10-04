import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSecretDto } from './dtos/create-secret.dto';
import { PrismaService } from '../prisma/prisma.service';
import { StatusRequest } from '../../generated/prisma';

@Injectable()
export class SecretsService {
  constructor(private readonly prisma: PrismaService) {}

  async createSecret(userId: string, dto: CreateSecretDto) {
    const secret = await this.prisma.secret.findUnique({
      where: {
        name: dto.name,
      },
    });
    if (secret) {
      throw new ConflictException('Name already exists');
    }

    return this.prisma.secret.create({
      data: {
        name: dto.name,
        encryptedValue: dto.encryptionValue,
        ownerId: userId,
      },
    });
  }

  getAllSecrets() {
    return this.prisma.secret.findMany();
  }

  async getOne(id: string) {
    const secret = await this.prisma.secret.findUnique({
      where: {
        id,
      },
    });
    if (!secret) {
      throw new NotFoundException('Secret not found');
    }

    return secret;
  }

  async validateSecret(secretId: string, userId: string): Promise<boolean> {
    const accessRequest = await this.prisma.accessRequest.findFirst({
      where: {
        secretId,
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    if (!accessRequest) {
      throw new BadRequestException('Access request has not yet been submitted');
    }

    return accessRequest.status === StatusRequest.APPROVED;
  }
}
