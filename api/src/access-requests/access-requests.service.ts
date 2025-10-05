import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateAccessRequestDto } from './dtos/create-access-request.dto';
import { StatusRequest } from 'generated/prisma';

@Injectable()
export class AccessRequestsService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: string, dto: CreateAccessRequestDto) {
    return this.prisma.accessRequest.create({
      data: {
        userId,
        secretId: dto.secretId,
        comment: dto.comment,
      },
    });
  }

  findAll() {
    return this.prisma.accessRequest.findMany();
  }

  findAllMy(userId: string) {
    return this.prisma.accessRequest.findMany({
      where: {
        userId,
      },
    });
  }

  async approve(accessRequestId: string) {
    const accessRequest = await this.prisma.accessRequest.findUnique({
      where: {
        id: accessRequestId,
      },
    });
    if (!accessRequest) {
      throw new NotFoundException('Access request not found');
    }

    // отправить уведомление пользователю
    return this.prisma.accessRequest.update({
      where: {
        id: accessRequestId,
      },
      data: {
        status: StatusRequest.APPROVED,
      },
    });
  }

  async reject(accessRequestId: string) {
    const accessRequest = await this.prisma.accessRequest.findUnique({
      where: {
        id: accessRequestId,
      },
    });
    if (!accessRequest) {
      throw new NotFoundException('Access request not found');
    }

    // отправить уведомление пользователю
    return this.prisma.accessRequest.update({
      where: {
        id: accessRequestId,
      },
      data: {
        status: StatusRequest.REJECTED,
      },
    });
  }
}
