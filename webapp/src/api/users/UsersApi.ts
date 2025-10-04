import { env } from '../../env.ts';
import { createApiService } from '../createApiService.ts';
import type { ApiResponse } from '../types/apiResponse.ts';
import type { ApiService } from '../apiService.ts';
import type { UserInfo } from './types/response/UserInfo.ts';
import type { CreateUser } from './types/request/CreateUser.ts';

export class UsersApi {
  private api: ApiService;

  public endPoint = {
    changePassword: env.REACT_APP_USERS_CHANGE_PASSWORD,
  }

  constructor() {
    this.api = createApiService(
      env.REACT_APP_USERS,
      10000
    );
  }

  async findAllUsers(): Promise<UserInfo[]> {
    try {
      const response = await this.api.get<UserInfo[]>(
        authApi.endPoint.login,
      );
      if (response.data) {
        return response.data;
      }
      return []
    } catch (e) {
      //throw new Error(error.message || 'Ошибка при входе в систему');
      return []
    }
  }

  async createUser(createUser: CreateUser): Promise<UserInfo | undefined> {
    const response = await this.api.post<UserInfo>(
      '',
      createUser
    );
    if(response) {
      this.api.setRoleFromToken(response.data?.role);
      return response.data
    }
    return undefined;
  }

  async changePassword(): Promise<void> {
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
