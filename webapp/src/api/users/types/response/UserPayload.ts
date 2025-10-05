import type { Roles } from '../../../auth/types/eunms/Roles.ts';

export interface UserPayload {
  sub: string;
  email: string;
  fullName: string;
  role: Roles;
  isFirstLogin: boolean;
}
