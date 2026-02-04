"use client";

import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { sendOtp, verifyOtp } from "@/api/auth";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppDispatch } from "@/store";
import { setUser } from "@/store/authSlice";
import Auth from "@/utils/misc";

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
        const { accessToken, user } = responseData;

        if (!accessToken) {
          throw new Error("No access token received");
        }

        // Store tokens (Access Token only - Refresh Token is HTTP-only cookie)
        Auth.setAccesToken(accessToken);
        // Refresh token is handled automatically by cookies

        // Store user data in Redux
        dispatch(setUser({ user, accessToken }));

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
    <section className="custom-padding my-20 flex justify-center">
      <div className="border rounded-md p-8 md:p-12 w-[500px]">
        <h3 className="text-center md:text-2xl font-semibold">Login</h3>

        {error && <p className="text-red-500 text-center mt-2">{error}</p>}

        {!isOtpPage ? (
          <Formik
            initialValues={{ phone: "" }}
            validationSchema={PhoneSchema}
            onSubmit={handleSendPhoneOtp}
          >
            {({ isSubmitting }) => (
              <Form className="mt-6 flex flex-col w-full">
                <label htmlFor="phone">Phone</label>
                <Field
                  type="tel"
                  name="phone"
                  id="phone"
                  className="mt-1 border rounded-md h-10 px-2"
                />
                <ErrorMessage
                  name="phone"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />

                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="w-full bg-primary text-white rounded-md py-2 mt-4 disabled:opacity-50"
                >
                  {loading ? "Sending OTP..." : "Get OTP"}
                </button>
              </Form>
            )}
          </Formik>
        ) : (
          <Formik
            initialValues={{ otp: "" }}
            validationSchema={OtpSchema}
            onSubmit={handleVerifyOtp}
          >
            {({ isSubmitting }) => (
              <Form className="mt-6 flex flex-col w-full">
                <label htmlFor="otp">OTP</label>
                <Field
                  type="text"
                  id="otp"
                  name="otp"
                  className="mt-1 border rounded-md h-10 px-2"
                />
                <ErrorMessage
                  name="otp"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />

                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="w-full bg-primary text-white rounded-md py-2 mt-4 disabled:opacity-50"
                >
                  {loading ? "Verifying OTP..." : "Submit OTP"}
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
