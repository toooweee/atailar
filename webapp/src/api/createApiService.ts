import { ApiService } from './apiService.ts';

export const createApiService = (baseUrl: string, timeOut?: number) => {
  const service = new ApiService(baseUrl, timeOut);
  return service;
};
