import { Body, Controller, Get, Patch, Post, UseGuards,  Req } from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../../generated/prisma';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { Roles, User } from '@app/common';
import { UserPayload } from '../auth/types/user.payload';

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
  changePassword(@Body() changePasswordDto: ChangePasswordDto, @User() currentUser: UserPayload) {
    return this.usersService.changePassword(currentUser.sub, changePasswordDto);
  }
}
