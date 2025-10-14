import axios, { AxiosError } from "axios";

import { getAccessToken } from "@/common/utils/token.js";

export const mainApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
  withCredentials: true,
});

mainApi.interceptors.request.use(
  config => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: Error | AxiosError) => {
    return Promise.reject(error);
  },
);

export default mainApi;
