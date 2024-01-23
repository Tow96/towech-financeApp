import axios, { AxiosError, AxiosInstance, HttpStatusCode } from 'axios';

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '/api';

export class apiClient {
  axiosInstance: AxiosInstance;
  private generateConfig = (token?: string) => ({ headers: { Authorization: `Bearer ${token}` } });

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: BASE_URL,
    });
    this.addErrorInterceptor(this.axiosInstance);
  }

  protected addErrorInterceptor(instance: AxiosInstance) {
    instance.interceptors.response.use(
      // Intercept
      res => res,
      // On error
      (e: AxiosError<any>) => {
        const status = e.response?.status || 500;
        const message = e.response?.data?.message || HttpStatusCode[status];

        const error = { message, status };
        throw error;
      }
    );
  }

  async delete<T>(url: string, token?: string): Promise<T> {
    return (await this.axiosInstance.delete<T>(url, this.generateConfig(token))).data;
  }
  async get<T>(url: string, token?: string): Promise<T> {
    return (await this.axiosInstance.get<T>(url, this.generateConfig(token))).data;
  }
  async patch<T>(url: string, token?: string, payload?: unknown): Promise<T> {
    return (await this.axiosInstance.patch<T>(url, payload, this.generateConfig(token))).data;
  }
  async post<T>(url: string, token?: string, payload?: unknown): Promise<T> {
    return (await this.axiosInstance.post<T>(url, payload, this.generateConfig(token))).data;
  }
  async postWithCredentials<T>(url: string, payload?: unknown): Promise<T> {
    return (await this.axiosInstance.post<T>(url, payload, { withCredentials: true })).data;
  }
  async put<T>(url: string, token?: string, payload?: unknown): Promise<T> {
    return (await this.axiosInstance.put<T>(url, payload, this.generateConfig(token))).data;
  }
}
