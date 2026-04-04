"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { setUser, setAuthCheckComplete } from "@/store/authSlice";
import axios from "axios";
import { API_ENDPOINT } from "@/utils/config";
import httpService from "@/api/httpService";

/**
 * AuthProvider — runs once on app mount to rehydrate the session.
 *
 * Uses axiosInstance (httpService) with _noRedirect to avoid triggering
 * the standard redirect-to-login interceptor if the user is a guest.
 *
 * Flow:
 * 0. Try GET /auth/csrf to get the initial memory token (auto-sets header)
 * 1. Try GET /auth/me to verify existing cookie session
 * 2. If 401, httpService automatically tries POST /auth/refresh
 * 3. Set authCheckComplete in all cases
 */
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useAppDispatch();
  const { authCheckComplete } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (authCheckComplete) return;

    const checkSession = async () => {
      try {
        // Step 0: Initial CSRF Handshake (updates X-XSRF-TOKEN automatically)
        await httpService.get("/auth/csrf");

        // Step 1: Verify session (automatic 401 -> refresh handling)
        const res = await httpService.get("/auth/me", {
          _noRedirect: true,
        } as any);

        const data = res.data?.data || res.data;
        if (data?.user) {
          dispatch(setUser({ user: data.user }));
        }
      } catch (err: any) {
        // Guest user or failed refresh — standard guest behavior.
      } finally {
        dispatch(setAuthCheckComplete());
      }
    };

    checkSession();
  }, [dispatch, authCheckComplete]);

  return <>{children}</>;
};

export default AuthProvider;
