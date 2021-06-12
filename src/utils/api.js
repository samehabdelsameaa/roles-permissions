import axios from 'axios';
import localStorage from 'redux-persist/es/storage';
import { baseURL } from 'src/config';

const apiInstance = axios.create({
  baseURL: baseURL.apiEndpoint,
  headers: {
    accept: 'application/json',
    'Content-Type': `application/json`
  }
});

export const unProtectedApiInstance = axios.create({
  baseURL: baseURL.apiEndpoint,
  headers: {
    accept: 'application/json',
    'Content-Type': `application/json`
  }
});

apiInstance.interceptors.request.use(
  async (config) => {
    const token = await localStorage.getItem('accessToken');
    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiInstance;
