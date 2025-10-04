import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { EncryptionService } from '../encryption/encryption.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly encryptionService: EncryptionService,
  ) {}

  async createUser(dto: CreateUserDto) {
    const passwordHash = await this.encryptionService.hashPassword(dto.password);

    return this.prisma.user.create({
      data: {
        email: dto.email,
        role: dto.role,
        passwordHash,
      },
    });
  }

  async findOneByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }

  async findOneById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async validateUser(email: string, password: string) {
    const user = await this.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Email Or Password Not Valid');
    }

    const isValidPassword = await this.encryptionService.verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      throw new UnauthorizedException('Email Or Password Not Valid');
    }

    return user;
  }
}
