import httpService from "./httpService";

export const sendOtp = async (phone: string) => {
  return httpService.post("/user/login", phone);
};
