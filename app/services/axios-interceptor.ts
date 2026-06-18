import axios from 'axios';
import { toastService } from './toast.service';

const BASE_URL = '/api/';

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds timeout
});

// Request Interceptor: Automatically inject Bearer Token
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = sessionStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle common HTTP responses and errors
axiosInstance.interceptors.response.use(
  (response) => {
    // Automatically trigger success toast if a message is present in response data
    if (response.data && response.data.message) {
      toastService.success(response.data.message);
    }
    return response;
  },
  (error) => {
    // Extract error message
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred.';

    // Automatically trigger error toast
    toastService.error(errorMessage);

    // Handle unauthorized/session expired
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('token');
        // Optionally redirect to login
        // window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
