import { NextRequest, NextResponse } from "next/server";
import { USER_TOKEN } from "./utils/constants";
import { jwtDecode } from "jwt-decode";
import { authRoutes, protectedRoutes } from "./utils/routes";

export function middleware(request: NextRequest) {
  const token = request.cookies.get(USER_TOKEN)?.value;
  const pathname = request.nextUrl.pathname;

  // Basic check for token presence
  if (token) {
    try {
      const decodedJWT = jwtDecode(token);
      if (decodedJWT && decodedJWT?.exp) {
        const expiryDate = new Date(decodedJWT.exp * 1000);
        // If expired or close to expiring, send to re-auth to attempt a silent refresh
        if (new Date() > expiryDate && pathname !== "/re-auth") {
          return NextResponse.redirect(
            new URL(
              `/re-auth?referer=${request.nextUrl.pathname}`,
              request.url,
            ),
          );
        }
      }
    } catch (e) {
      // If token is invalid/not a JWT, we might want to let the backend handle it or redirect
    }
  }

  // Route protection
  if (protectedRoutes.includes(pathname) && !token) {
    return NextResponse.redirect(
      new URL(`/login?referer=${pathname}`, request.url),
    );
  }

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
