import { Exclude } from 'class-transformer';

import { Role } from 'generated/prisma';

export class UserM {
  readonly id?: string;
  email: string;
  @Exclude()
  passwordHash: string;
  role?: Role;
  isFirstLogin?: boolean;

  createdAt?: Date;
}
