import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import jwtDecode from 'jwt-decode'; // Установи jwt-decode: npm install jwt-decode @types/jwt-decode

interface ApiResponse<T = any> {
  data: T;
  message?: string;
}

interface ApiError {
  message: string;
  status?: number;
}

interface DecodedToken {
  role?: string;
  [key: string]: any;
}

export class ApiService {
  private axiosInstance: AxiosInstance;

  constructor(baseUrl: string, timeout: number = 10000) {
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.axiosInstance.interceptors.request.use((config) => {
      const token = localStorage.getItem('authToken');
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
          errorMessage = 'Сессия истекла. Пожалуйста, войдите заново.';
          this.clearAuthToken(); //todo перезапрос токена
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

  async execute<T>(
    operation: () => Promise<T>,
    successMessage?: string,
    errorMessage?: string
  ): Promise<T> {
    try {
      const result = await operation();
      if (successMessage) {
      }
      return result;
    } catch (error: any) {
      const msg = errorMessage || error.message || 'Произошла ошибка при выполнении операции';
      throw error;
    }
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

  setAuthToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  clearAuthToken(): void {
    localStorage.removeItem('authToken');
  }
}

export const createApiService = (baseUrl: string, timeOut?: number) => {
  const service = new ApiService(baseUrl, timeOut);
  return service;
};
