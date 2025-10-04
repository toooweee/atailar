import { Body, Controller, Get, Patch, Post, UseGuards,  Req } from '@nestjs/common';
import {Request} from 'express'

import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../../generated/prisma';
import { Roles } from '@app/common/decorators/roles.decorator';
import { ChangePasswordDto } from './dtos/change-password.dto';
import RequestWithUser from '../auth/requests/user.request';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(RolesGuard)
  @Roles([Role.ADMIN])
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @UseGuards(RolesGuard)
  @Roles([Role.ADMIN])
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Patch('update-password')
  changePassword(@Body() changePasswordDto: ChangePasswordDto, @Req() req: RequestWithUser) {
    const userId = req.user.sub;

    return this.usersService.changePassword(userId, changePasswordDto);
  }
}
