"use client";

import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { getCsrfToken, sendOtp, verifyOtp } from "@/api/auth";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppDispatch } from "@/store";
import { setUser } from "@/store/authSlice";

const PhoneSchema = Yup.object().shape({
  phone: Yup.string()
    .matches(/^\d{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
});

const OtpSchema = Yup.object().shape({
  otp: Yup.string()
    .matches(/^\d{6}$/, "OTP must be 6 digits")
    .required("OTP is required"),
});

const LoginForm: React.FC = () => {
  const [isOtpPage, setIsOtpPage] = useState(false);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();

  // CSRF token is now initialized globally in AuthProvider.tsx,
  // so we don't need a local initCsrf useEffect here anymore.

  // Send OTP
  const handleSendPhoneOtp = async (values: { phone: string }) => {
    try {
      setLoading(true);
      setError("");
      setPhone(values.phone);

      await sendOtp(values.phone);
      setIsOtpPage(true);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (values: { otp: string }) => {
    try {
      setLoading(true);
      setError("");
      const response = await verifyOtp(phone, values.otp);

      if (response?.data) {
        // Handle both response.data and response.data.data structures
        const responseData = response.data.data || response.data;
        const { accessToken, user, xsrfToken } = responseData;

        if (xsrfToken) {
          import("@/api/httpService").then(({ default: httpService }) => {
            httpService.defaults.headers.common["X-XSRF-TOKEN"] = xsrfToken;
          });
        }

        // Store tokens (Access Token only if provided - Refresh Token is HTTP-only cookie)
        if (accessToken) {
          // Internal Redux state update for UI reactivity
          dispatch(setUser({ user, accessToken }));
        } else {
          // If pure HttpOnly, accessToken might not be in JSON
          dispatch(setUser({ user }));
        }

        // Redirect to referer or home
        const referer = searchParams?.get("referer");
        if (referer) {
          router.push(referer);
        } else {
          router.push("/");
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || err?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[70vh] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-200/50 -z-20"></div>
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute -bottom-32 -left-20 w-[30rem] h-[30rem] bg-indigo-500/5 rounded-full blur-3xl -z-10 animate-pulse shadow-2xl"></div>

      <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-white/70 backdrop-blur-xl border border-white border-b-gray-200/50 border-r-gray-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-500">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 mb-2 tracking-tight">
            {isOtpPage ? "Verify OTP" : "Welcome Back"}
          </h3>
          <p className="text-gray-500 font-medium">
            {isOtpPage
              ? "Enter the code sent to your phone"
              : "Please enter your details to continue"}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 text-sm p-4 rounded-xl mb-6 border border-red-100 text-center font-medium shadow-sm transition-opacity duration-300">
            {error}
          </div>
        )}

        {!isOtpPage ? (
          <Formik
            initialValues={{ phone: "" }}
            validationSchema={PhoneSchema}
            onSubmit={handleSendPhoneOtp}
          >
            {({ isSubmitting }) => (
              <Form className="flex flex-col w-full group">
                <div className="space-y-1">
                  <label
                    htmlFor="phone"
                    className="text-sm font-semibold text-gray-700 ml-1"
                  >
                    Phone Number
                  </label>
                  <Field name="phone">
                    {({ field }: any) => (
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                          +91
                        </span>
                        <input
                          {...field}
                          type="tel"
                          id="phone"
                          placeholder="9876543210"
                          className="w-full bg-white/50 border border-gray-200 rounded-xl h-14 pl-12 pr-4 text-gray-800 font-medium transition-all duration-300 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none hover:border-gray-300 shadow-sm"
                        />
                      </div>
                    )}
                  </Field>
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="text-red-500 text-xs mt-1 ml-1 font-medium select-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="w-full bg-gradient-to-tr from-primary to-primary/80 hover:to-primary text-white font-semibold rounded-xl h-14 mt-8 transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-3 relative overflow-hidden"
                >
                  {loading ? (
                    <span className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></span>
                  ) : (
                    "Get OTP"
                  )}
                </button>
              </Form>
            )}
          </Formik>
        ) : (
          <Formik
            initialValues={{ otp: "123456" }} // Pre-filled for development
            validationSchema={OtpSchema}
            onSubmit={handleVerifyOtp}
          >
            {({ isSubmitting }) => (
              <Form className="flex flex-col w-full transition-opacity duration-500">
                <div className="space-y-1">
                  <div className="flex justify-between items-center ml-1">
                    <label
                      htmlFor="otp"
                      className="text-sm font-semibold text-gray-700"
                    >
                      One Time Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsOtpPage(false)}
                      className="text-xs text-primary font-semibold hover:underline"
                    >
                      Change Phone?
                    </button>
                  </div>
                  <Field name="otp">
                    {({ field }: any) => (
                      <input
                        {...field}
                        type="text"
                        id="otp"
                        placeholder="• • • • • •"
                        className="w-full bg-white/50 font-mono tracking-[0.5em] text-center border border-gray-200 rounded-xl h-14 px-4 text-gray-800 text-lg transition-all duration-300 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none hover:border-gray-300 shadow-sm"
                        maxLength={6}
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="otp"
                    component="div"
                    className="text-red-500 text-xs mt-1 ml-1 font-medium select-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="w-full bg-gradient-to-tr from-primary to-primary/80 hover:to-primary text-white font-semibold rounded-xl h-14 mt-8 transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <span className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></span>
                  ) : (
                    "Verify & Login"
                  )}
                </button>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </section>
  );
};

export default LoginForm;
