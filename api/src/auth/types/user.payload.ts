import { Role } from 'generated/prisma';

export class UserPayload {
  sub: string;
  email: string;
  role: Role;
}
