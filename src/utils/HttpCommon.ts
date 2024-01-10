import axios, { AxiosError, HttpStatusCode } from 'axios';

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
});

apiClient.interceptors.response.use(
  // Intercept
  res => res.data,
  // On error
  (e: AxiosError<any>) => {
    const status = e.response?.status || 0;
    const message =
      e.response?.data?.message || HttpStatusCode[status] || `Unexpected Error: ${e.message}`;

    const error = { message, status };
    throw error;
  }
);

export default apiClient;
