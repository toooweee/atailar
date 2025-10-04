import type { Roles } from '../eunms/Roles.ts';

export interface MeResponse {
  id: string;
  email: string;
  role: Roles
}
