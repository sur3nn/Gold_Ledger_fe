import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://10.174.13.215:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// http.interceptors.request.use(
//   (config: InternalAxiosRequestConfig) => {
//     const token =
//       typeof window !== "undefined"
//         ? localStorage.getItem("token")
//         : null;

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   }
// );

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized - redirecting to login");
    }

    return Promise.reject(error);
  }
);

export { http };