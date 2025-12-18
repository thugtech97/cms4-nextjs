import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

const API_URL = "http://127.0.0.1:8000/api";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
  }
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined" && window.location.pathname !== "/") {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);


const setCsrfCookie = async () => {
  try {
    await axiosInstance.get("/sanctum/csrf-cookie");
  } catch (error) {
    throw new Error("Failed to set CSRF cookie");
  }
};

export { axiosInstance, setCsrfCookie };
