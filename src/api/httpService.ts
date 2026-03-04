// Create Axios instance with conditional environment variable access
import axios from "axios";
import { API_ENDPOINT as baseURL } from "@/utils/config";
import { getCookie } from "typescript-cookie";
import type { AppDispatch } from "@/store";
import { setUser, logout as logoutAction } from "@/store/authSlice";

let storeDispatch: AppDispatch | null = null;

// Function to provide dispatch from outside React
export const setStoreDispatch = (dispatch: AppDispatch) => {
  storeDispatch = dispatch;
};

// Safely access environment variables
if (!baseURL) {
  const error = "Missing NEXT_PUBLIC_API_BASE_URL in .env ./ add it";
  throw error;
}

// Create Axios instance
const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  // Axios built-in CSRF handling (works in browser)
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
});

// Request Interceptor (CSRF & Manual Token Handling)
axiosInstance.interceptors.request.use(
  (config) => {
    // Manually ensure X-XSRF-TOKEN is set from the cookie if it exists
    if (typeof window !== "undefined") {
      const xsrfToken = getCookie("XSRF-TOKEN");
      if (xsrfToken) {
        config.headers["X-XSRF-TOKEN"] = xsrfToken;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor (Handle Errors)
axiosInstance.interceptors.response.use(
  (response) => response, // Pass successful response
  async (error) => {
    if (error.response) {
      const originalRequest = error.config;

      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Attempt silent token refresh using HttpOnly refresh cookie
          await axios.post(
            `${baseURL}/auth/refresh`,
            {},
            { withCredentials: true },
          );

          // Refresh succeeded — rehydrate user state in Redux
          try {
            const meRes = await axios.get(`${baseURL}/auth/me`, {
              withCredentials: true,
            });
            const meData = meRes.data?.data || meRes.data;
            if (meData?.user) {
              storeDispatch?.(setUser({ user: meData.user }));
            }
          } catch {
            // /me failed after refresh — unusual but not fatal for the retry
          }

          // Retry the original request with the new cookie
          return axiosInstance(originalRequest);
        } catch (err) {
          // Refresh token also failed — session is truly expired
          storeDispatch?.(logoutAction());

          if (typeof window !== "undefined") {
            // Don't redirect if already on login page (prevents infinite loop)
            if (!window.location.pathname.startsWith("/login")) {
              window.location.href = "/login";
            }
          }

          // Also tell server to clear cookies
          axios
            .post(`${baseURL}/auth/logout`, {}, { withCredentials: true })
            .catch(() => {});

          return Promise.reject(err);
        }
      } else {
        console.error(
          "API Error:",
          error.response?.data?.message || "Unknown error",
        );
      }
    } else {
      console.error("Network error:", error.message);
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
