// Create Axios instance with conditional environment variable access
import axios from "axios";
import { API_ENDPOINT as baseURL } from "@/utils/config";
import { error } from "console";
import Auth from "@/utils/misc";
import { AppDispatch } from "@/store";
import { setUser, logout } from "@/store/userSlice";

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
});

// Request Interceptor (Attach Token) - Runs only in the browser
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = Auth.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
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
            { withCredentials: true }
          );
          const { accessToken } = res.data;
          Auth.setAccesToken(accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          storeDispatch?.(setUser({ accessToken }));
          return axiosInstance(originalRequest);
        } catch (err) {
          Auth.removeAccessToken();
          storeDispatch?.(logout()); // Logout if refresh fails
        }
      } else {
        console.error(
          "API Error:",
          error.response?.data?.message || "Unknown error"
        );
      }
    } else {
      console.error("Network error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
