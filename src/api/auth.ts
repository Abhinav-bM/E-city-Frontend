import { AxiosResponse } from "axios";
import httpService from "./httpService";

export const sendOtp = async (phone: string) => {
  return httpService.post("/auth/sent-otp", { phone });
};

export const verifyOtp = async (
  phone: string,
  otp: string
): Promise<AxiosResponse<any>> => {
  return httpService.post("/auth/verify-otp", { phone, otp });
};
