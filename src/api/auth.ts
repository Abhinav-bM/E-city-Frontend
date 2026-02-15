import { AxiosResponse } from "axios";
import httpService from "./httpService";
import Auth from "@/utils/misc";

export const sendOtp = async (phone: string) => {
  return httpService.post("/auth/sent-otp", { phone });
};

export const verifyOtp = async (
  phone: string,
  otp: string,
): Promise<AxiosResponse<any>> => {
  return httpService.post("/auth/verify-otp", { phone, otp });
};

// Refresh token - relies on HTTP-only cookie (withCredentials handles the cookie)
export const getNewToken = async () => {
  return httpService.post("/auth/refresh", {}, { withCredentials: true });
};

// CSRF Handshake - gets the initial XSRF-TOKEN cookie
export const getCsrfToken = async () => {
  return httpService.get("/auth/csrf");
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
