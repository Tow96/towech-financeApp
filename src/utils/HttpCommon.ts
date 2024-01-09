import axios, { AxiosError } from 'axios';

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
});

apiClient.interceptors.request.use(
  // Intercept
  q => q,
  // On Error
  (e: AxiosError) => {
    console.log(e);
    throw 'req'; // TODO: Process error
  }
);

apiClient.interceptors.response.use(
  // Intercept
  q => q,
  // On error
  (e: AxiosError) => {
    throw 'res'; // TODO: Process error
  }
);

export default apiClient;
