import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AccessRequestsService {
  constructor(private readonly prisma: PrismaService) {
  }

  create() {
    // сохранить заявку в бд
    // отправить на email заявка с кнопками на одобрение и отклонение заявки
  }

  findAll() {}

  approve(accessRequestId: string) {}

  reject(accessRequestId: string) {}
}
