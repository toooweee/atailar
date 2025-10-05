import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, AxiosError } from 'axios';
import { jwtDecode } from 'jwt-decode'; // Установи jwt-decode: npm install jwt-decode @types/jwt-decode
import { eraseCookie, getCookie, setCookie } from '../utils/cookieService';
import type { ApiResponse } from './types/apiResponse.ts';
import type { DecodedToken } from './types/decodedToken.ts';
import type { ApiError } from './types/apiError.ts';
import { authApi } from './auth/AuthApi.ts';

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

  async request<T = any>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.request<ApiResponse<T>>(config);
    return response.data;
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'GET', url, ...config });
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'POST', url, data, ...config });
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'PUT', url, data, ...config });
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'DELETE', url, ...config });
  }

  getRoleFromToken(token: string): string | null {
    try {
      const decoded: DecodedToken = jwtDecode(token);
      return decoded.role || null;
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  }

  getCurrentRole(): string | null {
    let role = getCookie('userRole');
    if (!role) {
      const token = getCookie('authToken');
      if (token) {
        role = this.getRoleFromToken(token);
        if (role) {
          setCookie('userRole', role, 7);
        }
      }
    }
    return role;
  }

  setAuthToken(token: string): void {
    setCookie('authToken', token, 7);
    const role = this.getRoleFromToken(token);
    if (role) {
      setCookie('userRole', role, 7);
    }
  }

  setRefreshToken(refreshToken: string): void {
    setCookie('refreshToken', refreshToken, 7);
  }

  clearAuthToken(): void {
    eraseCookie('authToken');
    eraseCookie('refreshToken');
    eraseCookie('userRole');
  }
}

