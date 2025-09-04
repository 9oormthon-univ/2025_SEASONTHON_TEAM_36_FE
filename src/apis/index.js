import axios from 'axios';

export const mainApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

mainApi.interceptors.request.use(
  config => {
    const token = import.meta.env.VITE_API_TOKEN;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export default mainApi;
