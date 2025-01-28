import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, HttpStatusCode } from 'axios';

export const BASE_URL = process.env.NEXT_PUBLIC_WEBAPI || '/api';

export class HttpContext {
  axiosInstance: AxiosInstance;
  private config: AxiosRequestConfig = { withCredentials: true };

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: BASE_URL,
    });
    this.addErrorInterceptor(this.axiosInstance);
  }

  protected addErrorInterceptor(instance: AxiosInstance) {
    instance.interceptors.response.use(
      // Intercept
      (res) => res,
      // On error
      (e: AxiosError<unknown>) => {
        const status = e.response?.status || 500;
        const data: { message?: string } = e.response?.data || {};
        const message = data.message || HttpStatusCode[status];

        throw new Error(message);
      }
    );
  }

  async delete<T>(url: string): Promise<T> {
    return (await this.axiosInstance.delete<T>(url, this.config)).data;
  }
  // async get<T>(url: string): Promise<T> {
  //   return (await this.axiosInstance.get<T>(url, this.config)).data;
  // }
  // async patch<T>(url: string, payload?: unknown): Promise<T> {
  //   return (await this.axiosInstance.patch<T>(url, payload, this.config)).data;
  // }
  async post<T>(url: string, payload?: unknown): Promise<T> {
    return (await this.axiosInstance.post<T>(url, payload, this.config)).data;
  }
  // async put<T>(url: string, payload?: unknown): Promise<T> {
  //   return (await this.axiosInstance.put<T>(url, payload, this.config)).data;
  // }
}
