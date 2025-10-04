import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateAccessRequestDto } from './dtos/create-access-request.dto';
import { StatusRequest } from 'generated/prisma';

@Injectable()
export class AccessRequestsService {
  constructor(private readonly prisma: PrismaService) {
  }

  create(userId: string, dto: CreateAccessRequestDto) {
    return this.prisma.accessRequest.create({
      data: {
        userId,
        secretId: dto.secretId,
        comment: dto.comment
      }
    })
  }

  findAll() {
    return this.prisma.accessRequest.findMany();
  }

  approve(accessRequestId: string) {
    return this.prisma.accessRequest.update({
      where: {
        id: accessRequestId
      },
      data: {
        status: StatusRequest.APPROVED
      }
    })
  }

  reject(accessRequestId: string) {
    return this.prisma.accessRequest.update({
      where: {
        id: accessRequestId
      },
      data: {
        status: StatusRequest.REJECTED
      }
    })
  }
}
