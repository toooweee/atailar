import { Body, Controller, Get, Patch, Post, Param, UseGuards } from '@nestjs/common';

import { AccessRequestsService } from './access-requests.service';
import { CreateAccessRequestDto } from './dtos/create-access-request.dto';
import { Roles, User } from '@app/common';
import { UserPayload } from '../auth/types/user.payload';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../../generated/prisma';

@Controller('access-requests')
export class AccessRequestsController {
  constructor(private readonly accessRequestsService: AccessRequestsService) {}

  @Post()
  createAccessRequest(@Body() createAccessRequestDto: CreateAccessRequestDto, @User() currentUser: UserPayload) {
    return this.accessRequestsService.create(currentUser.sub, createAccessRequestDto);
  }

  @UseGuards(RolesGuard)
  @Roles([Role.ADMIN])
  @Get()
  getAllAccessRequests() {
    return this.accessRequestsService.findAll();
  }

  @Get('my')
  getMyAccessRequests(@User() user: UserPayload) {
    return this.accessRequestsService.findAllMy(user.sub);
  }

  @UseGuards(RolesGuard)
  @Roles([Role.ADMIN])
  @Patch('approve/:id')
  approveAccessRequest(@Param('id') id: string) {
    return this.accessRequestsService.approve(id);
  }

  @UseGuards(RolesGuard)
  @Roles([Role.ADMIN])
  @Patch('reject/:id')
  rejectAccessRequest(@Param('id') id: string) {
    return this.accessRequestsService.reject(id);
  }
}
