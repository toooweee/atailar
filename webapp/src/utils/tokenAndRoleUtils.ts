import { getCookie } from './cookieService.ts';
import type { Roles } from '../api/auth/types/eunms/Roles.ts';

export const getAccessToken = () => {
  return getCookie('authToken');
}

export const getCurrentRole = () => {
  return getCookie('userRole') as Roles | null;
}
