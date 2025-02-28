// src/config/api-client.ts
import axios from "axios";
import { SERVER_BASE_URL } from "./constants";
import { message } from "antd";
import { useAuthStore } from "../store/auth";

export const api = axios.create({
  baseURL: SERVER_BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const { session } = useAuthStore.getState();
    const token = session?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401 && window.location.pathname !== "/login") {
      const { logout } = useAuthStore.getState();

      message.error("Your session has expired. Please login again.");

      logout();
    }

    return Promise.reject(error);
  }
);
