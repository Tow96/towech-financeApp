import axios, { AxiosInstance } from 'axios';

const rootUrl = process.env.NEXT_PUBLIC_BACKEND_API || '';

export default class ApiClient {
  private readonly _client: AxiosInstance;
  private readonly _token: Promise<string | null>;

  constructor(token: Promise<string | null>) {
    this._token = token;
    this._client = axios.create({
      baseURL: rootUrl,
      timeout: 10000,
    });
  }

  async get<Res = unknown>(url: string): Promise<Res> {
    const res = await this._client.get<Res>(url, {
      headers: { Authorization: `Bearer ${await this._token}` },
    });

    return res.data;
  }

  async post<Res = unknown, Req = unknown>(url: string, data?: Req): Promise<Res> {
    const res = await this._client.post<Res>(url, data, {
      headers: { Authorization: `Bearer ${await this._token}` },
    });

    return res.data;
  }

  async put<Res = unknown, Req = unknown>(url: string, data?: Req): Promise<Res> {
    const res = await this._client.put<Res>(url, data, {
      headers: { Authorization: `Bearer ${await this._token}` },
    });

    return res.data;
  }

  async delete<Res = unknown>(url: string): Promise<Res> {
    const res = await this._client.delete<Res>(url, {
      headers: { Authorization: `Bearer ${await this._token}` },
    });
    return res.data;
  }
}
