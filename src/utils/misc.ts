import { getCookie, setCookie, removeCookie } from "typescript-cookie";
import { USER_REFRESH_TOKEN, USER_TOKEN } from "./constants";
import { jwtDecode } from "jwt-decode";

const isProduction = typeof window !== "undefined" && process.env.NODE_ENV === "production";

const cookieOptions = {
  expires: 7,
  path: "/",
  secure: isProduction,
  sameSite: "strict" as const,
};

const Auth = {
  setAccesToken(data: string) {
    // Store as plain string, not JSON
    // Handle if data is already stringified (backward compatibility)
    const token = typeof data === "string" && data.startsWith('"') ? JSON.parse(data) : data;
    setCookie(USER_TOKEN, token, cookieOptions);
  },
  getAccessToken(): string | undefined {
    const token = getCookie(USER_TOKEN);
    if (!token) return undefined;

    try {
      // Parse if it's a JSON string (backward compatibility)
      const parsed = token.startsWith('"') ? JSON.parse(token) : token;
      
      // Validate token and check expiry
      try {
        const decoded = jwtDecode(parsed);
        if (decoded?.exp && decoded.exp * 1000 < Date.now()) {
          // Token expired, remove it
          this.removeAccessToken();
          return undefined;
        }
      } catch (decodeError) {
        // Invalid token format, return as is (let backend handle it)
      }
      
      return parsed;
    } catch {
      // If parsing fails, return original token
      return token;
    }
  },
  removeAccessToken() {
    removeCookie(USER_TOKEN);
  },
  setRefreshToken(data: string) {
    // Store as plain string, not JSON
    // Handle if data is already stringified (backward compatibility)
    const token = typeof data === "string" && data.startsWith('"') ? JSON.parse(data) : data;
    setCookie(USER_REFRESH_TOKEN, token, cookieOptions);
  },
  getRefreshToken(): string | undefined {
    const token = getCookie(USER_REFRESH_TOKEN);
    if (!token) return undefined;

    try {
      // Parse if it's a JSON string (backward compatibility)
      return token.startsWith('"') ? JSON.parse(token) : token;
    } catch {
      return token;
    }
  },
  removeRefreshToken() {
    removeCookie(USER_REFRESH_TOKEN);
  },
  // Complete logout - clear all tokens
  logout() {
    this.removeAccessToken();
    this.removeRefreshToken();
  },
};

export default Auth;
