import { env } from '../../env.ts';
import { createApiService } from '../createApiService.ts';
import type { ApiService } from '../apiService.ts';
import type { AccessRequest } from './types/response/AccessRequest.ts';
import type { CreateAccessRequest } from './types/request/CreateAccessRequest.ts';

export class AccessRequestApi {
  private api: ApiService;

  public endPoint = {
    approve: env.REACT_APP_ACCESS_REQUEST_APPROVE,
    reject: env.REACT_APP_ACCESS_REQUEST_REJECT,
  }

  constructor() {
    this.api = createApiService(
      env.REACT_APP_ACCESS_REQUEST,
      10000
    );
  }

  async getAllAccessRequest(): Promise<AccessRequest[]> {
    try {
      const response = await this.api.get<AccessRequest[]>(
        '',
      );
      if (response.data) {
        return response.data;
      }
      return []
    } catch (e) {
      return []
    }
  }

  async getMyAccessRequests(): Promise<AccessRequest[]> {
    try {
      const response = await this.api.get<AccessRequest[]>(
        '/my',
      );
      if (response.data) {
        return response.data;
      }
      return []
    } catch (e) {
      return []
    }
  }

  async createAccessRequest(request: CreateAccessRequest): Promise<AccessRequest | undefined> {
    try {
      const response = await this.api.post<AccessRequest, typeof request>(
        '',
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

  async approveAccessRequest(id: string): Promise<AccessRequest | undefined> {
    const response = await this.api.patch<AccessRequest, unknown>(
      `${accessRequestApi.endPoint.approve}/${id}`,
    );
    if(response.data) {
      return response.data;
    }
    return undefined;
  }

  async rejectAccessRequest(id: string): Promise<AccessRequest | undefined> {
    const response = await this.api.patch<AccessRequest, unknown>(
      `${accessRequestApi.endPoint.reject}/${id}`,
    );
    if(response.data) {
      return response.data;
    }
    return undefined;
  }

}

export const accessRequestApi = new AccessRequestApi();
