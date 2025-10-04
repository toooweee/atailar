import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAccessRequestDto } from './dtos/create-access-request.dto';

@Injectable()
export class AccessRequestsService {
  constructor(private readonly prisma: PrismaService) {
  }

  create(dto: CreateAccessRequestDto) {
    // сохранить заявку в бд
    // отправить на email заявка с кнопками на одобрение и отклонение заявки
  }

  findAll() {
    return this.prisma.accessRequest.findMany();
  }

  approve(accessRequestId: string) {}

  reject(accessRequestId: string) {}
}
