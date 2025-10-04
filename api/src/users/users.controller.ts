import { Body, Controller, Get, Post } from '@nestjs/common';
import { Public } from '@app/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // admin
  @Public()
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
