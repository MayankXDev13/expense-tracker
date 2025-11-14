import axios from "axios";

const BASE_URL =
  window.env?.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_URL;
console.log("BASE_URL:", BASE_URL);

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

const token = localStorage.getItem("accessToken");
if (token) {
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await axios.post(
          `${BASE_URL}/api/v1/expenseTracker/user/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = data.data.accessToken;

        localStorage.setItem("accessToken", newAccessToken);

        axiosInstance.defaults.headers.common["Authorization"] =
          `Bearer ${newAccessToken}`;

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError: unknown) {
        if (
          (refreshError as { response?: { status: number } }).response
            ?.status === 400
        ) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");

          document.cookie =
            "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict";
          document.cookie =
            "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict";

          window.location.href = "/signin";
        }

        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
