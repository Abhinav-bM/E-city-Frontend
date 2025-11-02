import { AxiosResponse } from "axios";
import httpService from "./httpService";
import Auth from "@/utils/misc";

export const sendOtp = async (phone: string) => {
  return httpService.post("/auth/sent-otp", { phone });
};

export const verifyOtp = async (
  phone: string,
  otp: string
): Promise<AxiosResponse<any>> => {
  return httpService.post("/auth/verify-otp", { phone, otp });
};

// Refresh token - tries cookie first (recommended), falls back to body if refreshToken provided
export const getNewToken = async (refreshToken?: string) => {
  // If refreshToken provided, send in body (for backward compatibility)
  // Otherwise, rely on HTTP-only cookie (recommended for production)
  if (refreshToken) {
    return httpService.post("/auth/refresh", { refreshToken });
  }
  // Use cookie-based refresh (withCredentials handles the cookie)
  return httpService.post("/auth/refresh", {}, { withCredentials: true });
};

// Logout - invalidate refresh token on server and clear local tokens
export const logout = async () => {
  try {
    await httpService.post("/auth/logout", {}, { withCredentials: true });
  } catch (error) {
    console.error("Logout error:", error);
    // Continue with local cleanup even if server call fails
  } finally {
    // Clear tokens locally
    Auth.logout();
  }
};
