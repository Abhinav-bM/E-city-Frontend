import { getCookie, setCookie, removeCookie } from "typescript-cookie";
import { USER_TOKEN } from "./constants";
const Auth = {
  setAccesToken(data: string) {
    setCookie(USER_TOKEN, JSON.stringify(data), { expires: 7, path: "/" });
  },
  getAccessToken() {
    return getCookie(USER_TOKEN);
  },
  removeAccessToken() {
    removeCookie(USER_TOKEN);
  },
};

export default Auth;
