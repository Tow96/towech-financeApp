import axios from 'axios';

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
});

// apiClient.interceptors.request.use(
//   // Intercept
//   q => {
//     // console.log('a');
//     return q;
//   },
//   // On Error
//   q => {
//     // console.log('b');
//     return q;
//   }
// );

export default apiClient;
