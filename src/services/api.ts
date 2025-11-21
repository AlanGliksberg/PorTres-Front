import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosInstance } from "axios";
import { API_URL } from "../config/env";
import { USER_TOKEN_SESSION_KEY } from "../constants/auth";
import { ApiParams, ApiResponse } from "../types";
import { getQueryParams } from "../utils/api";
import { CACHE_TTL, cacheGetCall, getCachedCall } from "./cache";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 20000,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem(USER_TOKEN_SESSION_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data.error !== false) return { error: true };
    return response.data;
  },
  (error) => {
    console.log("API error:", error?.response?.data);
    if (!error?.response?.data?.error) throw error;
    return error.response.data;
  }
);

export const post = async <T>(uri: string, apiParams: ApiParams = {}) => {
  apiParams.method = "POST";
  return await fetch<T>(uri, apiParams);
};

export const get = async <T>(uri: string, apiParams: ApiParams = {}) => {
  const url = apiParams?.queryParams
    ? `${uri}?${getQueryParams(apiParams.queryParams)}`
    : uri;

  if (apiParams.withCache) {
    const cached = getCachedCall(uri, url);
    if (
      cached &&
      Date.now() - cached.timestamp < (apiParams.cacheTtl || CACHE_TTL)
    ) {
      return cached.data as ApiResponse<T>;
    }
  }

  apiParams.method = "GET";
  const result = await fetch<T>(url, apiParams);
  if (!result.error) cacheGetCall(uri, url, result);

  return result;
};

export const deleteApi = async <T>(uri: string, apiParams: ApiParams = {}) => {
  apiParams.method = "DELETE";
  return await fetch<T>(uri, apiParams);
};

export const put = async <T>(uri: string, apiParams: ApiParams = {}) => {
  apiParams.method = "PUT";
  return await fetch<T>(uri, apiParams);
};

const fetch = async <T>(
  uri: string,
  { method, body, customHeaders = {} }: ApiParams
): Promise<ApiResponse<T>> => {
  const headers = getHeaders(customHeaders);
  try {
    switch (method) {
      case "POST":
      default:
        return await axiosInstance.post<never, ApiResponse<T>>(uri, body, {
          headers,
        });
      case "GET":
        return await axiosInstance.get<never, ApiResponse<T>>(uri, {
          headers,
        });
      case "DELETE":
        return await axiosInstance.delete<never, ApiResponse<T>>(uri, {
          headers,
          data: body,
        });
      case "PUT":
        return await axiosInstance.put<never, ApiResponse<T>>(uri, body, {
          headers,
        });
    }
  } catch (e) {
    console.log("Error:", e);
    return { error: true };
  }
};

const getHeaders = (customHeaders: Record<string, any> = {}) => {
  const headers = { ...customHeaders };
  if (
    !Object.keys(headers).some(
      (key) => key.toLowerCase() === "content-type"
    )
  ) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
};
