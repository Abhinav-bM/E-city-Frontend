"use client";

import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { getCsrfToken, sendOtp, verifyOtp } from "@/api/auth";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppDispatch } from "@/store";
import { setUser } from "@/store/authSlice";
import {
  Phone,
  KeyRound,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";

const PhoneSchema = Yup.object().shape({
  phone: Yup.string()
    .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
    .required("Phone number is required"),
});

const OtpSchema = Yup.object().shape({
  otp: Yup.string()
    .matches(/^\d{6}$/, "OTP must be exactly 6 digits")
    .required("OTP is required"),
});

const LoginForm: React.FC = () => {
  const [isOtpPage, setIsOtpPage] = useState(false);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
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
      setTimeLeft(30);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message || "Failed to send OTP. Please try again.",
      );
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
        const responseData = response.data.data || response.data;
        const { accessToken, user } = responseData;

        if (accessToken) {
          dispatch(setUser({ user, accessToken }));
        } else {
          dispatch(setUser({ user }));
        }

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

  // Timer countdown effect
  React.useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  // Allow user to go back to edit phone number
  const handleGoBack = () => {
    setIsOtpPage(false);
    setError("");
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 p-4 sm:p-6 relative">
      {/* Branding Logo */}
      <div className="w-full max-w-md mb-6 sm:mb-8 text-center sm:text-left">
        <Link
          href="/"
          className="text-3xl font-black tracking-tight text-slate-900"
        >
          E-City<span className="text-blue-600">.</span>
        </Link>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 sm:p-10 overflow-hidden relative">
        {/* Animated Transition Container */}
        <div className="relative transition-all duration-500 ease-in-out">
          <div
            className={`transition-all duration-500 absolute w-full ${!isOtpPage ? "opacity-100 translate-x-0 relative" : "opacity-0 -translate-x-[120%] absolute pointer-events-none"}`}
          >
            <div className="mb-8">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 border border-blue-100/50">
                <Phone size={24} strokeWidth={2} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-tight mb-2">
                Welcome Back
              </h2>
              <p className="text-slate-500 text-sm">
                Enter your mobile number to securely sign in or create a brand
                new account.
              </p>
            </div>

            {error && !isOtpPage && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100 flex items-start gap-3">
                <div className="shrink-0 mt-0.5">
                  <ShieldCheck size={16} />
                </div>
                <p>{error}</p>
              </div>
            )}

            <Formik
              initialValues={{ phone: "" }}
              validationSchema={PhoneSchema}
              onSubmit={handleSendPhoneOtp}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form className="space-y-6">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-bold text-slate-700 mb-2"
                    >
                      Mobile Number
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                        <span className="font-semibold text-sm mr-1">+91</span>
                        <div className="w-px h-4 bg-slate-200 ml-2" />
                      </div>
                      <Field name="phone">
                        {({ field, form }: any) => (
                          <input
                            {...field}
                            type="tel"
                            inputMode="numeric"
                            maxLength={10}
                            id="phone"
                            placeholder="99999 00000"
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, "");
                              form.setFieldValue(field.name, val);
                            }}
                            className={`w-full h-14 pl-[5.5rem] pr-4 bg-slate-50 border transition-all duration-200 outline-none rounded-xl text-slate-900 font-medium placeholder:text-slate-400 placeholder:font-normal focus:bg-white focus:ring-4 focus:ring-blue-500/10 ${
                              errors.phone && touched.phone
                                ? "border-red-300 focus:border-red-500"
                                : "border-slate-200 focus:border-blue-500"
                            }`}
                          />
                        )}
                      </Field>
                    </div>
                    <ErrorMessage
                      name="phone"
                      component="div"
                      className="text-red-500 text-xs font-medium mt-2 flex items-center gap-1.5"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || loading}
                    className="group w-full h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 hover:shadow-slate-900/20 active:scale-[0.98]"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Continue Securely</span>
                        <ArrowRight
                          size={18}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-center text-slate-400 leading-relaxed max-w-xs mx-auto pt-2">
                    By continuing, you agree to E-City&apos;s{" "}
                    <Link href="#" className="underline hover:text-slate-600">
                      Conditions of Use
                    </Link>{" "}
                    and{" "}
                    <Link href="#" className="underline hover:text-slate-600">
                      Privacy Notice
                    </Link>
                    .
                  </p>
                </Form>
              )}
            </Formik>
          </div>

          {/* OTP State */}
          <div
            className={`transition-all duration-500 w-full ${isOtpPage ? "opacity-100 translate-x-0 relative" : "opacity-0 translate-x-[120%] absolute pointer-events-none top-0"}`}
          >
            <div className="mb-6">
              <button
                onClick={handleGoBack}
                type="button"
                className="w-10 h-10 -ml-2 mb-4 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 border border-emerald-100/50">
                <KeyRound size={24} strokeWidth={2} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">
                Verify your number
              </h2>
              <p className="text-slate-500 text-sm flex flex-col gap-1">
                <span>We&apos;ve securely sent a 6-digit code to</span>
                <span className="font-bold text-slate-900 flex items-center gap-2">
                  <Smartphone size={14} className="text-slate-400" />
                  +91 {phone.replace(/(\d{5})(\d{5})/, "$1 $2")}
                </span>
              </p>
            </div>

            {error && isOtpPage && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100 flex items-start gap-3">
                <div className="shrink-0 mt-0.5">
                  <ShieldCheck size={16} />
                </div>
                <p>{error}</p>
              </div>
            )}

            <Formik
              initialValues={{ otp: "" }}
              validationSchema={OtpSchema}
              onSubmit={handleVerifyOtp}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form className="space-y-6">
                  <div>
                    <label
                      htmlFor="otp"
                      className="block text-sm font-bold text-slate-700 mb-2"
                    >
                      6-Digit Security Code
                    </label>
                    <Field name="otp">
                      {({ field, form }: any) => (
                        <input
                          {...field}
                          type="text"
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          maxLength={6}
                          id="otp"
                          placeholder="000000"
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "");
                            form.setFieldValue(field.name, val);
                          }}
                          className={`w-full h-14 px-4 text-center tracking-[0.5em] text-2xl bg-slate-50 border transition-all duration-200 outline-none rounded-xl text-slate-900 font-bold placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-300 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 ${
                            errors.otp && touched.otp
                              ? "border-red-300 focus:border-red-500"
                              : "border-slate-200 focus:border-emerald-500"
                          }`}
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="otp"
                      component="div"
                      className="text-red-500 text-xs font-medium mt-2"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || loading}
                    className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-slate-900/10 active:scale-[0.98]"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      "Verify & Securely Login"
                    )}
                  </button>

                  <div className="pt-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleSendPhoneOtp({ phone })}
                      disabled={loading || timeLeft > 0}
                      className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {timeLeft > 0
                        ? `Resend available in ${timeLeft}s`
                        : "Didn't receive code? Resend"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
