import axios, { AxiosResponse, AxiosError } from "axios";
import Cookies from "js-cookie";

const isServer = typeof window === "undefined";

const axiosInstance = axios.create({
  baseURL: "/api/", // Trỏ toàn bộ request về API route trung gian của bạn
  withCredentials: true,
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  }
});

declare module "axios" {
  export interface AxiosInstance {
    resolveURL: (path: string) => string;
  }
}

axiosInstance.resolveURL = (path: string) => {
  const base = axiosInstance.defaults.baseURL || "";
  return new URL(path, base).toString();
};

axiosInstance.interceptors.request.use((config) => {
  if (!isServer) {
    const token = Cookies.get("access_token");
    // Nếu có token thì gửi Bearer token, nếu không thì gửi Bearer null như bạn yêu cầu
    config.headers.Authorization = token ? `Bearer ${token}` : "Bearer null";
  } else {
    // Nếu chạy trên server, có thể bạn muốn set mặc định Bearer null
    if (!config.headers.Authorization) {
      config.headers.Authorization = "Bearer null";
    }
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) =>
    Promise.reject(
      (error.response && error.response.data) || "Something went wrong"
    )
);

export default axiosInstance;

// ==========================================
// ĐOẠN DƯỚI NÀY GIỮ NGUYÊN CODE CỦA BẠN
// ==========================================
export const API_ENDPOINTS = {
  auth: {
    login: "/login",
    account: (id: string) => `/students/${id}?_id=${id}`,
  },
    scores: (id: string) => `/students/${id}/scores?_id=${id}`,

};