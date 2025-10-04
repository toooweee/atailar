import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { Public } from '@app/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../../generated/prisma';
import { Roles } from '@app/common/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // admin
  @UseGuards(RolesGuard)
  @Roles([Role.ADMIN])
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  // admin
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}
