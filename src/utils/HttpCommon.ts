import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3001',
});

apiClient.interceptors.request.use(
  q => {
    // console.log('a');
    return q;
  },
  q => {
    // console.log('b');
    return q;
  }
);

export default apiClient;
