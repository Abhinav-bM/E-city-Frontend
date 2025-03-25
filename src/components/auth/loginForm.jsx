"use client";
import React, { useState } from "react";
import { Formik } from "formik";

const LoginForm = () => {
  const [isOtpPage, setIsOtpPage] = useState(false);
  return (
    <section className=" custom-padding my-20 flex justify-center">
      <div className="  border rounded-md p-8 md:p-12 w-[500px]">
        <h3 className=" text-center md:text-2xl font-semibold">Login</h3>

        {!isOtpPage ? (
          <>
            <div className="mt-6 flex flex-col w-ful">
              <label htmlFor="user_phone">Phone</label>
              <input
                type="text"
                className=" mt-1 border rounded-md h-10 px-2"
              />
            </div>

            <button
              type="button"
              className=" w-full bg-primary text-white rounded-md py-2 mt-4"
            >
              Get Otp
            </button>
          </>
        ) : (
          <>
            <div className="mt-6 flex flex-col w-ful">
              <label htmlFor="user_otp">otp</label>
              <input
                type="text"
                className=" mt-1 border rounded-md h-10 px-2"
              />
            </div>

            <button
              type="button"
              className=" w-full bg-primary text-white rounded-md py-2 mt-4"
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
