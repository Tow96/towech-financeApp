import axios from 'axios';

export const BASE_URL = 'http://localhost:3001';

const apiClient = axios.create({
  baseURL: BASE_URL,
});

// apiClient.interceptors.request.use(
//   // TODO: Intercept
//   q => {
//     // console.log('a');
//     return q;
//   },
//   // TODO: On Error
//   q => {
//     // console.log('b');
//     return q;
//   }
// );

export default apiClient;
