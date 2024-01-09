import axios from 'axios';

// TODO: Make base_url depend on config
export const BASE_URL = 'http://localhost:3001';

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
