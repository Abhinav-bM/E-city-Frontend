// Create Axios instance with conditional environment variable access
import axios from "axios";
import { API_ENDPOINT as baseURL } from "@/utils/config";
import Auth from "@/utils/misc";
import { getCookie } from "typescript-cookie";
import { AppDispatch } from "@/store";
import { setUser, logout as logoutAction } from "@/store/authSlice";
import { logout as logoutAPI } from "./auth";

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
          const res = await axios.post(
            `${baseURL}/auth/refresh`,
            {},
            { withCredentials: true },
          );
          // Handle both response.data and response.data.data structures
          const responseData = res.data?.data || res.data;
          const { accessToken } = responseData;

          if (accessToken) {
            // Even if we use cookies, updating Redux is good for UI state
            storeDispatch?.(setUser({ accessToken }));
            return axiosInstance(originalRequest);
          } else {
            // If the backend is full HttpOnly, accessToken might not be in body.
            // If the call succeeded (200), we can just retry.
            return axiosInstance(originalRequest);
          }
        } catch (err) {
          // Clear tokens and logout on refresh failure
          if (typeof window !== "undefined") {
            Auth.logout();
            // Redirect to login if we're in browser
            window.location.href = "/login";
          }
          storeDispatch?.(logoutAction());
          // Call logout API to invalidate refresh token on server
          logoutAPI().catch(() => {
            // Ignore errors - we're already clearing local tokens
          });

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
