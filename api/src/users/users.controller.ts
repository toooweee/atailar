import { Body, Controller, Get, Patch, Post, UseGuards, Param } from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../../generated/prisma';
import { Roles } from '@app/common/decorators/roles.decorator';
import { ChangePasswordDto } from './dtos/change-password.dto';

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

  @Patch(':id')
  changePassword(@Param('id') id: string, @Body() changePasswordDto: ChangePasswordDto) {
    return this.usersService.changePassword(id, changePasswordDto);
  }
}
