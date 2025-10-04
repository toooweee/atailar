import { env } from '../../env.ts';
import { createApiService } from '../createApiService.ts';
import type { ApiService } from '../apiService.ts';
import type { UserInfo } from './types/response/UserInfo.ts';
import type { CreateUser } from './types/request/CreateUser.ts';
import type { ChangePassword } from './types/request/ChangePassword.ts';
import type { UserPayload } from './types/response/UserPayload.ts';

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
        '',
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
    const response = await this.api.post<UserPayload, CreateUser>(
      '',
      createUser
    );
    if(response) {
      return {
        email: response.data.email,
        fullName: response.data.fullName,
        id: response.data.sub,
      }
    }
    return undefined;
  }

  async changePassword(changePassword: ChangePassword): Promise<UserPayload | undefined> {
    const response = await this.api.post<UserPayload, ChangePassword>(
      usersApi.endPoint.changePassword,
      changePassword
    );
    if(response.data) {
      return response.data
    }
    return undefined;
  }

}

export const usersApi = new UsersApi();
