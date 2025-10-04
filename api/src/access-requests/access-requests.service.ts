import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AccessRequestsService {
  constructor(private readonly prisma: PrismaService) {
  }

  create() {
    // отправить на email
  }

  findAll() {}

  approve(accessRequestId: string) {}

  reject(accessRequestId: string) {}
}
