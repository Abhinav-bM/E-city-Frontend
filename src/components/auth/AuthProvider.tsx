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
 * Uses raw axios (NOT the intercepted axiosInstance) to avoid triggering
 * the 401 → refresh → redirect-to-login interceptor loop.
 *
 * Flow:
 * 0. Try GET /auth/csrf to get the memory token
 * 1. Try GET /auth/me with cookie
 * 2. If 401 → try POST /auth/refresh, then retry /auth/me
 * 3. If refresh also fails → user is a guest, no redirect
 * 4. Set authCheckComplete in all cases
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
        // Step 0: Initialize CSRF Token in memory
        try {
          const csrfRes = await axios.get(`${API_ENDPOINT}/auth/csrf`, {
            withCredentials: true,
          });
          const xsrfToken =
            csrfRes.data?.data?.xsrfToken || csrfRes.data?.xsrfToken;
          if (xsrfToken) {
            httpService.defaults.headers.common["X-XSRF-TOKEN"] = xsrfToken;
            axios.defaults.headers.common["X-XSRF-TOKEN"] = xsrfToken;
          }
        } catch (err) {
          console.error("Failed to initialize CSRF token", err);
        }

        // Step 1: Try /auth/me directly
        const res = await axios.get(`${API_ENDPOINT}/auth/me`, {
          withCredentials: true,
        });
        const data = res.data?.data || res.data;
        if (data?.user) {
          dispatch(setUser({ user: data.user }));
        }
      } catch (err: any) {
        // Step 2: If 401, try refreshing the token first
        if (err?.response?.status === 401) {
          try {
            const refreshRes = await axios.post(
              `${API_ENDPOINT}/auth/refresh`,
              {},
              { withCredentials: true },
            );

            const newCsrfToken =
              refreshRes.data?.data?.xsrfToken || refreshRes.data?.xsrfToken;
            if (newCsrfToken) {
              httpService.defaults.headers.common["X-XSRF-TOKEN"] =
                newCsrfToken;
              axios.defaults.headers.common["X-XSRF-TOKEN"] = newCsrfToken;
            }

            // Refresh succeeded, retry /auth/me
            const retryRes = await axios.get(`${API_ENDPOINT}/auth/me`, {
              withCredentials: true,
            });
            const retryData = retryRes.data?.data || retryRes.data;
            if (retryData?.user) {
              dispatch(setUser({ user: retryData.user }));
            }
          } catch {
            // Both failed — user is a guest. No redirect, no error.
          }
        }
      } finally {
        dispatch(setAuthCheckComplete());
      }
    };

    checkSession();
  }, [dispatch, authCheckComplete]);

  return <>{children}</>;
};

export default AuthProvider;
