import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, AxiosError } from 'axios';
import { eraseCookie, getCookie, setCookie } from '../utils/cookieService';
import type { ApiResponse } from './types/apiResponse.ts';
import type { ApiError } from './types/apiError.ts';
import { authApi } from './auth/AuthApi.ts';
import type { Roles } from './auth/types/eunms/Roles.ts';

export class ApiService {
  private axiosInstance: AxiosInstance;

  constructor(baseUrl: string, timeout: number = 10000) {
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      timeout,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    this.axiosInstance.interceptors.request.use((config) => {
      const token = getCookie('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse<any>>) => response,
      (error: AxiosError<ApiResponse<ApiError>>) => {
        let errorMessage = 'Произошла неизвестная ошибка';
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response?.status === 401) {
          const refreshToken = getCookie('refreshToken');
          if(refreshToken) {
            try {
              authApi.refreshToken(refreshToken);
            }
            catch (error) {
              errorMessage = 'Сессия истекла. Пожалуйста, войдите заново.';
              this.clearAuthToken();
            }
          }
        } else if (error.response?.status === 403) {
          errorMessage = 'Доступ запрещен.';
        } else if (error.response?.status === 404) {
          errorMessage = 'Ресурс не найден.';
        } else if (error.message) {
          errorMessage = error.message;
        }

        return Promise.reject(new Error(errorMessage));
      }
    );
  }

  async request<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.request<ApiResponse<T>>(config);
    console.log(response);
    return response.data;
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.get<T>(url, config);
    return {
      data: response.data,
      message: response.statusText,
    }
  }

  async post<T, R>(url: string, data?: R, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return {
      data: response.data,
      message: response.statusText,
    }
  }

  async put<T, R>(url: string, data?: R, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.put<T>(url, data, config);
    return {
      data: response.data,
      message: response.statusText,
    }
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.delete<T>(url, config);
    return {
      data: response.data,
      message: response.statusText,
    }
  }

  setAuthToken(token: string): void {
    setCookie('authToken', token, 7);
  }

  setRefreshToken(refreshToken: string): void {
    setCookie('refreshToken', refreshToken, 30);
  }

  setRoleFromToken(role: Roles): void {
    setCookie('userRole', role, 30)
  }

  clearAuthToken(): void {
    eraseCookie('authToken');
    eraseCookie('refreshToken');
    eraseCookie('userRole');
  }
}

