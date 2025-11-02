# Authentication System Analysis & Improvements

## Current Implementation Overview

### Architecture
- **Frontend**: Next.js 15 with TypeScript
- **Authentication Method**: Phone number + OTP
- **Token Strategy**: JWT with Access Token + Refresh Token
- **State Management**: Redux Toolkit
- **Storage**: Cookies (typescript-cookie)
- **HTTP Client**: Axios with interceptors

### Authentication Flow
1. User enters phone number → sends OTP
2. User enters OTP → receives accessToken
3. Access token stored in cookie
4. Refresh token handling via HTTP-only cookies (withCredentials)
5. Token refresh on 401 errors
6. Route protection via Next.js middleware

---

## Issues & Problems Identified

### 1. **Token Storage Inconsistency** ⚠️ CRITICAL
**Location**: `src/utils/misc.ts`
- **Issue**: Storing tokens as JSON strings instead of plain strings
- **Current**: `setCookie(USER_TOKEN, JSON.stringify(data), ...)`
- **Problem**: When retrieving, token might be double-stringified or need parsing
- **Impact**: Token parsing errors, authentication failures

**Fix**:
```typescript
setAccesToken(data: string) {
  // Remove JSON.stringify if data is already a string
  setCookie(USER_TOKEN, data, { expires: 7, path: "/", secure: true, sameSite: "strict" });
}
```

### 2. **Missing Refresh Token Storage After OTP Verification** ⚠️ CRITICAL
**Location**: `src/components/auth/loginForm.tsx`
- **Issue**: Only storing accessToken, not refreshToken after OTP verification
- **Current**: `dispatch(setUser({ accessToken }))`
- **Problem**: Refresh token from response not stored
- **Impact**: Token refresh will fail, user forced to re-login

**Fix**: Store both tokens from verifyOtp response

### 3. **Inconsistent Refresh Token Handling** ⚠️ MAJOR
**Location**: `src/api/httpService.ts` vs `src/api/auth.ts`
- **Issue**: 
  - `httpService.ts` uses `withCredentials: true` (expects cookie)
  - `auth.ts` sends refreshToken in request body
  - `re-auth/page.tsx` uses body approach
- **Problem**: Inconsistent API expectations
- **Impact**: Refresh might fail depending on which method is used

### 4. **Token Parsing Missing** ⚠️ MAJOR
**Location**: `src/utils/misc.ts` & `src/middleware.ts`
- **Issue**: `getAccessToken()` returns stringified token, but not parsed
- **Current**: `getCookie(USER_TOKEN)` might return JSON string
- **Problem**: Token might be double-wrapped in quotes
- **Impact**: Invalid token format in Authorization header

### 5. **Missing Refresh Token Cleanup on Logout** ⚠️ MAJOR
**Location**: No logout component/function found
- **Issue**: When user logs out, refresh token remains in cookie
- **Problem**: Security risk - refresh token still valid
- **Impact**: Token can be reused even after logout

### 6. **Middleware Bug in Auth Routes** ⚠️ MINOR
**Location**: `src/middleware.ts:32`
- **Issue**: Redirect URL has typo: `/referer=${pathname}` should be `/?referer=${pathname}`
- **Problem**: Invalid redirect URL
- **Impact**: Redirects to broken URL

### 7. **Token Type Mismatch in Redux** ⚠️ MINOR
**Location**: `src/store/authSlice.ts:16`
- **Issue**: `setUser` expects `{ user }` but receives `{ accessToken }`
- **Problem**: State shape inconsistency
- **Impact**: User data might not be properly stored

### 8. **No Token Validation on Retrieval** ⚠️ MINOR
**Location**: `src/utils/misc.ts`
- **Issue**: No check if token is expired before returning
- **Problem**: Expired tokens might be used
- **Impact**: Unnecessary API calls with expired tokens

### 9. **Missing Secure Cookie Flags** ⚠️ SECURITY
**Location**: `src/utils/misc.ts`
- **Issue**: Cookies not marked as `secure` and `sameSite`
- **Problem**: Tokens vulnerable to XSS/CSRF in production
- **Impact**: Security vulnerabilities

### 10. **No Error Handling in Re-Auth Page** ⚠️ MINOR
**Location**: `src/app/re-auth/page.tsx`
- **Issue**: Errors logged but no user feedback or redirect
- **Problem**: User stuck on loading screen
- **Impact**: Poor UX

### 11. **Refresh Token Not Used in httpService** ⚠️ MAJOR
**Location**: `src/api/httpService.ts:57-61`
- **Issue**: Refresh endpoint doesn't send refresh token explicitly
- **Problem**: Relies only on `withCredentials`, but refresh token might be in cookie or need to be sent
- **Impact**: Token refresh might fail

### 12. **Missing User Data in Login Response** ⚠️ MINOR
**Location**: `src/components/auth/loginForm.tsx:54-56`
- **Issue**: Only storing accessToken, not full user data
- **Problem**: User profile not populated
- **Impact**: User data unavailable in app

---

## Recommended Improvements

### Priority 1: Critical Fixes

#### 1. Fix Token Storage
```typescript
// src/utils/misc.ts
const Auth = {
  setAccesToken(data: string) {
    // Store as plain string, not JSON
    setCookie(USER_TOKEN, data, { 
      expires: 7, 
      path: "/",
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
  },
  
  getAccessToken(): string | undefined {
    const token = getCookie(USER_TOKEN);
    // Parse if it's a JSON string (for backward compatibility)
    if (token && token.startsWith('"')) {
      try {
        return JSON.parse(token);
      } catch {
        return token;
      }
    }
    return token;
  },
  
  // Similar fixes for refresh token
}
```

#### 2. Store Refresh Token After OTP Verification
```typescript
// src/components/auth/loginForm.tsx
const handleVerifyOtp = async (values: { otp: string }) => {
  try {
    setLoading(true);
    setError("");
    const response = await verifyOtp(phone, values.otp);

    if (response) {
      const { accessToken, refreshToken, user } = response.data;
      
      // Store both tokens
      Auth.setAccesToken(accessToken);
      if (refreshToken) {
        Auth.setRefreshToken(refreshToken);
      }
      
      // Store full user data
      dispatch(setUser({ user, accessToken, refreshToken }));
      
      const referer = searchParams.get("referer");
      window.location.href = referer || "/";
    }
  } catch (err: any) {
    // Error handling...
  }
};
```

#### 3. Fix Refresh Token Flow
**Option A**: Use HTTP-only cookies (recommended for production)
- Backend sets refresh token in HTTP-only cookie
- Frontend only handles access token
- More secure

**Option B**: Use localStorage/cookies for both
- Store both tokens securely
- Send refresh token in request body when needed

#### 4. Add Proper Logout Function
```typescript
// src/utils/misc.ts
const Auth = {
  // ... existing methods
  
  logout() {
    this.removeAccessToken();
    this.removeRefreshToken();
  }
};

// src/api/auth.ts
export const logout = async () => {
  // Call backend to invalidate refresh token
  try {
    await httpService.post("/auth/logout");
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    Auth.logout(); // Clear tokens anyway
  }
};
```

#### 5. Fix Middleware Redirect
```typescript
// src/middleware.ts:30-33
if (authRoutes.includes(request.nextUrl.pathname) && token) {
  return NextResponse.redirect(
    new URL("/", request.url) // Fix: redirect to home
  );
}
```

### Priority 2: Security Enhancements

#### 1. Add Secure Cookie Flags
```typescript
const cookieOptions = {
  expires: 7,
  path: "/",
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  httpOnly: false // Can't set httpOnly from client-side, backend must do this
};
```

#### 2. Add Token Expiry Check
```typescript
// src/utils/misc.ts
getAccessToken(): string | undefined {
  const token = getCookie(USER_TOKEN);
  if (!token) return undefined;
  
  try {
    const parsed = token.startsWith('"') ? JSON.parse(token) : token;
    const decoded = jwtDecode(parsed);
    
    // Check if expired
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      this.removeAccessToken();
      return undefined;
    }
    
    return parsed;
  } catch {
    return token;
  }
}
```

#### 3. Add CSRF Protection
- Implement CSRF tokens for state-changing operations
- Use SameSite cookie attribute (already recommended)

### Priority 3: UX Improvements

#### 1. Better Error Handling
```typescript
// src/app/re-auth/page.tsx
catch (error) {
  console.error(error);
  Auth.removeAccessToken();
  Auth.removeRefreshToken();
  router.push("/login?referer=" + encodeURIComponent(referer || "/"));
}
```

#### 2. Loading States
- Add proper loading indicators
- Show error messages to users
- Handle network failures gracefully

#### 3. Token Refresh Optimization
- Implement token refresh queue to prevent multiple simultaneous refresh requests
- Add exponential backoff for retries

---

## Backend API Requirements

Based on your frontend code, your backend should implement:

### Endpoints Needed:

1. **POST /auth/sent-otp**
   - Body: `{ phone: string }`
   - Response: `{ message: string, success: boolean }`

2. **POST /auth/verify-otp**
   - Body: `{ phone: string, otp: string }`
   - Response: `{ accessToken: string, refreshToken: string, user: UserObject }`
   - Should set refreshToken as HTTP-only cookie if using cookie strategy

3. **POST /auth/refresh**
   - Option A: Cookie-based (recommended)
     - No body needed, reads from HTTP-only cookie
     - Response: `{ accessToken: string }`
   - Option B: Body-based
     - Body: `{ refreshToken: string }`
     - Response: `{ accessToken: string, refreshToken?: string }`

4. **POST /auth/logout**
   - Invalidates refresh token
   - Clears refresh token cookie
   - Response: `{ message: string }`

### Token Specifications:

- **Access Token**: Short-lived (15-30 minutes)
  - Should include: userId, phone, exp, iat
- **Refresh Token**: Long-lived (7-30 days)
  - Should be stored in database for revocation capability
  - Should be unique and random

---

## Summary of Actions Required

### Immediate (Critical):
1. ✅ Fix token storage (remove JSON.stringify)
2. ✅ Store refresh token after OTP verification
3. ✅ Fix refresh token flow consistency
4. ✅ Add proper logout function
5. ✅ Fix middleware redirect bug

### Short-term (Important):
1. Add secure cookie flags
2. Add token expiry validation
3. Improve error handling
4. Fix Redux state shape
5. Add user data to login response

### Long-term (Enhancements):
1. Implement token refresh queue
2. Add CSRF protection
3. Implement token blacklist/whitelist
4. Add rate limiting
5. Add comprehensive logging

---

## Security Best Practices Checklist

- [ ] Use HTTP-only cookies for refresh tokens (backend)
- [ ] Use secure flag in production
- [ ] Use SameSite attribute
- [ ] Implement token rotation
- [ ] Add token revocation endpoint
- [ ] Rate limit auth endpoints
- [ ] Validate OTP expiry (5-10 minutes)
- [ ] Rate limit OTP requests per phone
- [ ] Encrypt sensitive data in transit (HTTPS)
- [ ] Add request logging for security auditing

