import { NextRequest, NextResponse } from "next/server";
import { USER_TOKEN } from "./utils/constants";
import { jwtDecode } from "jwt-decode";
import { authRoutes, protectedRoutes } from "./utils/routes";

export function middleware(request: NextRequest) {
  const token = request.cookies.get(USER_TOKEN)?.value;
  const pathname = request.nextUrl.pathname;

  // Check if token exists and is valid
  if (token) {
    try {
      const decodedJWT = jwtDecode(token);
      if (decodedJWT && decodedJWT?.exp) {
        const expiryDate = new Date(decodedJWT.exp * 1000);
        // If expired — let the request through. The client-side httpService
        // interceptor will handle the 401 → refresh flow automatically.
        // No server-side redirect needed.
        if (new Date() > expiryDate) {
          // For protected routes with an expired token, let the client-side
          // AuthProvider + interceptor handle the refresh. If the refresh token
          // is also expired, the interceptor will redirect to /login.
        }
      }
    } catch (e) {
      // If token is invalid/not a JWT, let the request through — the backend
      // will return 401 and the interceptor will handle it.
    }
  }

  // Route protection — redirect to login if accessing protected route without a token
  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !token) {
    return NextResponse.redirect(
      new URL(`/login?referer=${pathname}`, request.url),
    );
  }

  // Prevent logged-in users from accessing auth pages (login/signup)
  if (authRoutes.includes(pathname) && token) {
    const referer = request.nextUrl.searchParams.get("referer") || "/";
    return NextResponse.redirect(new URL(referer, request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */

    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
