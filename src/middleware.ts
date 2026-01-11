import { NextRequest, NextResponse } from "next/server";
import { USER_TOKEN } from "./utils/constants";
import { jwtDecode } from "jwt-decode";
import { authRoutes, protectedRoutes } from "./utils/routes";

export function middleware(request: NextRequest) {
  const token = request.cookies.get(USER_TOKEN)?.value;
  const pathname = request.nextUrl.pathname;

  if (token) {
    const decodedJWT = jwtDecode(token);
    if (decodedJWT && decodedJWT?.exp) {
      const expiryDate = new Date(decodedJWT.exp * 1000);
      if (new Date() > expiryDate && pathname !== "/re-auth") {
        return NextResponse.redirect(
          new URL(`/re-auth?referer=${request.nextUrl.pathname}`, request.url)
        );
      }
    }
  }

  // Decode the expiry from the token
  if (protectedRoutes.includes(request.nextUrl.pathname) && !token) {
    const response = NextResponse.redirect(
      new URL(`/login?referer=${request.nextUrl.pathname}`, request.url)
    );
    return response;
  }

  if (authRoutes.includes(request.nextUrl.pathname) && token) {
    // Fix: redirect to home instead of broken URL
    const referer = request.nextUrl.searchParams.get("referer");
    return NextResponse.redirect(
      new URL(referer || "/", request.url)
    );
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