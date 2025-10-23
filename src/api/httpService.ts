// Create Axios instance with conditional environment variable access
import axios from "axios";

// Safely access environment variables

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000, // Set request timeout (10 sec)
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor (Attach Token) - Runs only in the browser
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken"); // Get token only in browser
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
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        console.error("Unauthorized! Redirect to login.");
        // Handle logout or redirect to login page if needed
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
