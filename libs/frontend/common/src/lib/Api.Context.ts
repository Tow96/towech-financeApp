import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, HttpStatusCode } from 'axios';

export const BASE_URL = process.env.NEXT_PUBLIC_WEBAPI || '/api';

export class ApiContext {
  axiosInstance: AxiosInstance;
  private readonly cookieConfig: AxiosRequestConfig = { withCredentials: true };
  private readonly config = (token: string): AxiosRequestConfig => ({
    headers: { Authorization: `Bearer ${token}` },
  });

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

  async get<T>(url: string, token: string): Promise<T> {
    return (await this.axiosInstance.get<T>(url, this.config(token))).data;
  }
  async patch<T>(url: string, token: string, payload?: unknown): Promise<T> {
    return (await this.axiosInstance.patch<T>(url, payload, this.config(token))).data;
  }
  async postWithCookie<T>(url: string, payload?: unknown): Promise<T> {
    return (await this.axiosInstance.post<T>(url, payload, this.cookieConfig)).data;
  }
}
