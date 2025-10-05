import { env } from '../../env.ts';
import { createApiService } from '../createApiService.ts';
import type { ApiService } from '../apiService.ts';

export class SecretApi {
  private api: ApiService;

  public endPoint = {
  }

  constructor() {
    this.api = createApiService(
      env.REACT_APP_SECRETS,
      10000
    );
  }

  async getMySecrets(): Promise<Secret[]> {
    try {
      const response = await this.api.get<Secret[]>(
        this.endPoint.mySecrets,
      );
      if (response.data) {
        return response.data;
      }
      return []
    } catch (e) {
      return []
    }
  }

  async requestAccess(request: SecretRequest): Promise<{ requestId: string; status: string } | undefined> {
    try {
      const response = await this.api.post<{ requestId: string; status: string }, SecretRequest>(
        this.endPoint.requestAccess,
        request
      );
      if (response.data) {
        return response.data;
      }
      return undefined;
    } catch (e) {
      return undefined;
    }
  }

  async getSecretValue(secretId: string): Promise<string | undefined> {
    try {
      const response = await this.api.get<{ value: string }>(
        `${this.endPoint.getSecret}/${secretId}`,
      );
      if (response.data?.value) {
        return response.data.value;
      }
      return undefined;
    } catch (e) {
      return undefined;
    }
  }
}

export const secretApi = new SecretApi();
