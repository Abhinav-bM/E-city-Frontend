/**
 * Auth utility — cookie-based auth.
 *
 * All tokens (accessToken, refreshToken) are HttpOnly cookies managed by the
 * backend. JavaScript cannot read or clear them. The server `/auth/logout`
 * endpoint handles cookie clearing. This module is kept as a no-op placeholder
 * for any future non-HttpOnly state that needs client-side cleanup.
 */
const Auth = {
  logout() {
    // No-op — HttpOnly cookies are cleared by the server's /auth/logout endpoint.
    // If any non-HttpOnly client state needs cleanup in the future, add it here.
  },
};

export default Auth;
