import { env } from '../../env.ts';
import { createApiService } from '../createApiService.ts';
import type { ApiResponse } from '../types/apiResponse.ts';
import type { ApiService } from '../apiService.ts';
import type { LoginRequest } from './types/request/LoginRequest.ts';
import type { AuthResponse } from './types/response/AuthResponse.ts';
import type { MeResponse } from './types/response/MeResponse.ts';

export class AuthApi {
  private api: ApiService;

  public endPoint = {
    me: env.REACT_APP_AUTH_ME,
    login: env.REACT_APP_AUTH_LOGIN,
    refresh: env.REACT_APP_AUTH_REFRESH,
  }

  constructor() {
    this.api = createApiService(
      env.REACT_APP_AUTH,
      10000
    );
  }

  async login(credentials: LoginRequest): Promise<boolean> {
    try {
      const response = await this.api.post<AuthResponse, LoginRequest>(
        authApi.endPoint.login,
        credentials
      );
      if (response.data?.accessToken) {
        this.api.setAuthToken(response.data?.accessToken);
        if (response.data?.refreshToken) {
          this.api.setRefreshToken(response.data?.refreshToken);
          return true
        }
        return true
      }
      return false
    } catch (e) {
      //throw new Error(error.message || 'Ошибка при входе в систему');
      return false
    }
  }

  async getMeInformation(): Promise<MeResponse | undefined> {
    const response = await this.api.get<MeResponse>(
      authApi.endPoint.me,
    );
    if(response) {
      this.api.setRoleFromToken(response.data?.role);
      return response.data
    }
    return undefined;
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
      const response = await this.api.post<AuthResponse, {refreshToken: string}>(authApi.endPoint.refresh, {refreshToken: refreshToken});
      if (response.data?.accessToken) {
        this.api.setAuthToken(response.data.accessToken);
      }
      return response;
    } catch (error: any) {
      this.api.clearAuthToken();
      throw new Error(error.message || 'Не удалось обновить токен');
    }
  }
}

export const authApi = new AuthApi();
