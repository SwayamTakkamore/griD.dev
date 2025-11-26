import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `${API_URL}/api`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token and wallet address
    this.client.interceptors.request.use(
      (config) => {
        if (typeof window !== 'undefined') {
          const authStorage = localStorage.getItem('auth-storage');
          if (authStorage) {
            const { token, user } = JSON.parse(authStorage).state;
            if (token) {
              config.headers.Authorization = `Bearer ${token}`;
            }
            if (user?.walletAddress) {
              config.headers['x-wallet'] = user.walletAddress;
            }
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        // Only logout on 401 if it's from the auth endpoints
        if (error.response?.status === 401 && error.config?.url?.includes('/auth/')) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth-storage');
            window.location.href = '/';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Generic methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url, config);
    return response.data;
  }

  // Auth endpoints
  async getNonce(walletAddress: string) {
    return this.post('/auth/nonce', { walletAddress });
  }

  async login(walletAddress: string, signature: string) {
    return this.post('/auth/login', { walletAddress, signature });
  }

  async verifyToken() {
    return this.get('/auth/verify');
  }

  async logout() {
    return this.post('/auth/logout');
  }

  // Repository endpoints
  async createRepository(formData: FormData) {
    return this.post('/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async getRepository(repoId: string) {
    return this.get(`/repo/${repoId}`);
  }

  async getUserRepositories(walletAddress: string) {
    return this.get(`/repo/user/${walletAddress}`);
  }

  async getAllRepositories(params?: {
    page?: number;
    limit?: number;
    search?: string;
    license?: string;
  }) {
    return this.get('/repo', { params });
  }

  async createCommit(formData: FormData) {
    return this.post('/repo/commit', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // User endpoints
  async getUserProfile(walletAddress: string) {
    return this.get(`/user/${walletAddress}`);
  }

  async updateUserProfile(walletAddress: string, data: any) {
    return this.put(`/user/${walletAddress}`, data);
  }

  async getUserStats(walletAddress: string) {
    return this.get(`/user/${walletAddress}/stats`);
  }
}

export const apiClient = new ApiClient();
