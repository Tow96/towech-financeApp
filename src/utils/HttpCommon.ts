import axios, { AxiosError } from 'axios';

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
});

// apiClient.interceptors.request.use(
//   // Intercept
//   q => q,
//   // On Error
//   q => {
//     console.log('req err');
//     return q;
//   }
// );

// apiClient.interceptors.response.use(
//   // Intercept
//   q => q,
//   // On error
//   (e: AxiosError) => {
//     console.log(e.response?.status);
//     Promise.reject(e)
//   }
// );

export default apiClient;
