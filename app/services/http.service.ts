import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { axiosInstance } from './axios-interceptor';

/**
 * Standard HTTP GET wrapper
 */
export const getApi = <T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  return axiosInstance.get<T>(url, config);
};

/**
 * Standard HTTP POST wrapper
 */
export const postApi = <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  return axiosInstance.post<T>(url, data, config);
};

/**
 * Standard HTTP PUT wrapper
 */
export const putApi = <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  return axiosInstance.put<T>(url, data, config);
};

/**
 * Standard HTTP PATCH wrapper
 */
export const patchApi = <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  return axiosInstance.patch<T>(url, data, config);
};

/**
 * Standard HTTP DELETE wrapper
 */
export const deleteApi = <T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  return axiosInstance.delete<T>(url, config);
};
