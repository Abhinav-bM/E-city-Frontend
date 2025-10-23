"use client";

import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { sendOtp } from "@/api/auth";

// Validation schema using Yup
const PhoneSchema = Yup.object().shape({
  phone: Yup.string()
    .matches(/^\d{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
});

const LoginForm: React.FC = () => {
  const [isOtpPage, setIsOtpPage] = useState(false);
  const [phone, setPhone] = useState("");

  // Handle phone submission
  const handleSendPhoneOtp = async (values: { phone: string }) => {
    try {
      console.log("Sending OTP to:", values.phone);
      setPhone(values.phone);

      await sendOtp(values.phone);

      setIsOtpPage(true);
    } catch (error) {
      console.error("Failed to send OTP:", error);
    }
  };

  return (
    <section className="custom-padding my-20 flex justify-center">
      <div className="border rounded-md p-8 md:p-12 w-[500px]">
        <h3 className="text-center md:text-2xl font-semibold">Login</h3>

        {!isOtpPage ? (
          <Formik
            initialValues={{ phone: "" }}
            validationSchema={PhoneSchema}
            onSubmit={handleSendPhoneOtp}
          >
            {() => (
              <Form>
                <div className="mt-6 flex flex-col w-full">
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
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-white rounded-md py-2 mt-4"
                >
                  Get OTP
                </button>
              </Form>
            )}
          </Formik>
        ) : (
          <>
            <div className="mt-6 flex flex-col w-full">
              <label htmlFor="otp">OTP</label>
              <input
                type="text"
                id="otp"
                className="mt-1 border rounded-md h-10 px-2"
              />
            </div>

            <button
              type="button"
              className="w-full bg-primary text-white rounded-md py-2 mt-4"
            >
              Submit
            </button>
          </>
        )}
      </div>
    </section>
  );
};

export default LoginForm;
