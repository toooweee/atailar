import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { SecretsService } from './secrets.service';
import { CreateSecretDto } from './dtos/create-secret.dto';
import { UserPayload } from '../auth/types/user.payload';
import { Roles, User } from '@app/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../../generated/prisma';
import { ApprovedRequestGuard } from './guards/approved-request.guard';

@Controller('secrets')
export class SecretsController {
  constructor(private readonly secretsService: SecretsService) {}

  @UseGuards(RolesGuard)
  @Roles([Role.ADMIN])
  @Post()
  create(@Body() createSecretDto: CreateSecretDto, @User() user: UserPayload) {
    return this.secretsService.createSecret(user.sub, createSecretDto);
  }

  @Get()
  getAll() {
    return this.secretsService.getAllSecrets();
  }

  @UseGuards(ApprovedRequestGuard)
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.secretsService.getOne(id);
  }
}
