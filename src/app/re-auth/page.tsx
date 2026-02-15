"use client";

import { getNewToken } from "@/api/auth";
import Auth from "@/utils/misc";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/store";
import { setUser } from "@/store/authSlice";

export default function ReAuthPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router || !searchParams) return;

    const refetchRefreshToken = async () => {
      try {
        setLoading(true);
        setError("");

        // Call refresh - will use cookie automatically
        const response = await getNewToken();

        // Handle both response.data and response.data.data structures
        const responseData = response.data?.data || response.data;
        const { accessToken } = responseData;

        // Update Redux store (even if accessToken is in cookie, updating Redux helps UI)
        dispatch(setUser({ accessToken }));

        // Redirect to referer or home
        const referer = searchParams.get("referer");
        if (referer) {
          router.push(referer);
        } else {
          router.push("/");
        }
      } catch (error: any) {
        console.error("Token refresh error:", error);
        setError(
          error?.response?.data?.message ||
            "Session expired. Please login again.",
        );

        // Clear tokens and redirect to login
        Auth.logout();

        // Redirect to login after a short delay
        setTimeout(() => {
          const referer = searchParams.get("referer");
          router.push(
            `/login${referer ? `?referer=${encodeURIComponent(referer)}` : ""}`,
          );
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    refetchRefreshToken();
  }, [router, searchParams, dispatch]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        {loading && !error && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Refreshing your session...</p>
          </>
        )}
        {error && (
          <>
            <p className="text-red-500 mb-4">{error}</p>
            <p className="text-gray-600 text-sm">Redirecting to login...</p>
          </>
        )}
      </div>
    </div>
  );
}
