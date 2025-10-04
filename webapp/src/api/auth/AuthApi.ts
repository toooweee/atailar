import { env } from '../../env.ts';
import { createApiService } from '../createApiService.ts';
import type { ApiResponse } from '../types/apiResponse.ts';
import type { ApiService } from '../apiService.ts';
import type { LoginRequest } from './types/request/LoginRequest.ts';
import type { AuthResponse } from './types/response/AuthResponse.ts';

export class AuthApi {
  private api: ApiService;

  public endPoint = {
    login: env.REACT_APP_LOGIN,
    refresh: env.REACT_APP_REFRESH,
  }

  constructor() {
    this.api = createApiService(
      env.REACT_APP_HOST,
      10000
    );
  }

  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await this.api.post<AuthResponse>(
        authApi.endPoint.login,
        credentials
      );
      if (response.data?.token) {
        this.api.setAuthToken(response.data.token);
      }

      if (response.data?.refresh) {
        this.api.setRefreshToken(response.data.refresh);
      }
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Ошибка при входе в систему');
    }
  }

  async logout(): Promise<void> {
    try {
    } catch (error: any) {
    } finally {
      this.api.clearAuthToken();
    }
  }

  async refreshToken(refreshToken: string): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await this.api.post<AuthResponse>(authApi.endPoint.refresh, {refreshToken: refreshToken});
      if (response.data?.token) {
        this.api.setAuthToken(response.data.token);
      }
      return response;
    } catch (error: any) {
      this.api.clearAuthToken();
      throw new Error(error.message || 'Не удалось обновить токен');
    }
  }
}

export const authApi = new AuthApi();
