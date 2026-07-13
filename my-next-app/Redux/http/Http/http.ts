import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://darkcyan-kudu-235344.hostingersite.com",
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (typeof window !== "undefined") {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);