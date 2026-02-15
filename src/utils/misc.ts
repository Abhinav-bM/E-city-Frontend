import { removeCookie } from "typescript-cookie";
import { USER_REFRESH_TOKEN, USER_TOKEN } from "./constants";

const Auth = {
  // Complete logout - the actual cookie clearing is now done by the backend's /auth/logout endpoint
  // but we can still call this to clear any accidental local state or non-HttpOnly helper cookies.
  logout() {
    removeCookie(USER_TOKEN, { path: "/" });
    removeCookie(USER_REFRESH_TOKEN, { path: "/" });
  },
};

export default Auth;
