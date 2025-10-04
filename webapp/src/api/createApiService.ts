import { ApiService } from './apiService.ts';
import { env } from '../env.ts';

export const createApiService = (url: string, timeOut?: number) => {
  const baseUrl = env.REACT_APP_HOST;
  const service = new ApiService(`${baseUrl}${url}`, timeOut);
  return service;
};
