import { AxiosResponse } from "axios";
import httpService from "./httpService";

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

// CSRF Handshake - gets the initial xsrf token in-memory
export const getCsrfToken = async () => {
  const res = await httpService.get("/auth/csrf");
  return res.data?.data?.xsrfToken || res.data?.xsrfToken;
};

// Get current user — checks if user is authenticated via HttpOnly cookie
export const getMe = async () => {
  return httpService.get("/auth/me", { withCredentials: true });
};

// Logout - invalidate refresh token on server (clears HttpOnly cookies)
export const logout = async () => {
  try {
    await httpService.post("/auth/logout", {}, { withCredentials: true });
  } catch (error) {
    console.error("Logout error:", error);
  }
};
