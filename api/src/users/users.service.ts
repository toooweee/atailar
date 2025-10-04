import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { EncryptionService } from '../encryption/encryption.service';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly encryptionService: EncryptionService,
    private readonly mailService: MailService
  ) {}

  async createUser(dto: CreateUserDto) {
    const passwordHash = await this.encryptionService.hashPassword(dto.password);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
      },
    });

    // send credentials to email
    await this.mailService.sendEmail({
      to: dto.email,
      subject: 'Добро пожаловать в Secret Desc!',
       from: 'SECRET DESC',
      html: `
  <div style="font-family: Arial, sans-serif; background-color: #f7f9fc; padding: 24px;">
    <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 10px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
      <h2 style="color: #333333; text-align: center;">🎉 Добро пожаловать в Secret Desc!</h2>
      <p style="color: #555555; font-size: 15px; line-height: 1.6;">
        Ваш аккаунт успешно создан. Ниже указаны ваши данные для входа:
      </p>

      <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; color: #333;">
          <strong>Email:</strong> ${dto.email}<br>
          <strong>Пароль:</strong> ${dto.password}
        </p>
      </div>

      <p style="color: #555555; font-size: 15px; line-height: 1.6;">
        Пожалуйста, сохраните эти данные в безопасном месте и не передавайте их третьим лицам.
      </p>

      <div style="text-align: center; margin-top: 24px;">
        <a href="http://localhost:5174/login" 
           style="background-color: #4f46e5; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold;">
          Войти в аккаунт
        </a>
      </div>

      <p style="color: #999999; font-size: 13px; text-align: center; margin-top: 20px;">
        Если вы не создавали аккаунт — просто проигнорируйте это письмо.
      </p>
    </div>
  </div>
  `,
    });


    return user;
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

  async changePassword(id: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        id
      }
    })
    if(!user) {
      throw new NotFoundException('User not found')
    }

    const passwordHash = await this.encryptionService.hashPassword(dto.newPassword);

    return this.prisma.user.update({
      where: {
        id
      },
      data: {
        passwordHash
      }
    });
  }

  async validateUser(email: string, password: string) {
    const user = await this.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('Email Or Password Not Valid');
    }

    const isValidPassword = await this.encryptionService.verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      throw new BadRequestException('Email Or Password Not Valid');
    }

    return user;
  }
}
