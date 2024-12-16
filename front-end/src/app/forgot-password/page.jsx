"use client";
import React, { useState, useRef, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useFormik } from "formik";
import { toast } from "react-hot-toast";
import * as yup from "yup";
import Link from "next/link";

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const {
    sendVerificationCode,
    verifiedResetCode,
    resetPassword,
    isResetCodeVerified,
    isResetCodeSend,
  } = useAuthStore();
  // handle send code
  const handleSubmit = async (values) => {
    setIsLoading(true);

    try {
      await sendVerificationCode(values.email);
      setUserEmail(values.email);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid email")
      .required("Please enter a valid email address."),
  });
  const Formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  });

  // handle verify code
  const codeInputs = useRef([]);
  const handleVerifyCodeSubmit = async ({ code }) => {
    setIsLoading(true);
    try {
      const res = await verifiedResetCode(code.join(""));
      console.log(res);

      if (res?.status == 200) {
        setUserId(res?.data?.data.userId);
      }
    } catch (error) {
      console.log("error in forgot comp on verifid code", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handlePast = (e) => {
    e.preventDefault();
    const code = e.clipboardData.getData("text");
    if (!new RegExp("^[0-9]{6}$").test(code)) {
      toast.error("Please paste a valid 6-digit code.");
      return;
    }
    const digits = code.split("");
    codeInputs.current.forEach((e, i) => {
      e.value = digits[i];
    });
  };
  const handleKeyDown = (e) => {
    if (
      !/^[0-9]{1}$/.test(e.key) &&
      e.key !== "Backspace" &&
      e.key !== "Delete" &&
      e.key !== "Tab" &&
      !e.metaKey
    ) {
      e.preventDefault();
    }

    const index = codeInputs.current.indexOf(e.target);

    if (e.key === "Backspace" || e.key === "Delete") {
      if (index > 0 && index <= 5 && codeInputs.current[5].value === "") {
        codeInputs.current[index - 1].value = "";
        codeInputs.current[index - 1].focus();
      }
      if (index == 6) {
        codeInputs.current[index].value = "";
        codeInputs.current[index - 1].focus();
      }
    }
  };
  const handleInput = (e) => {
    const index = codeInputs.current.indexOf(e.target);
    if (e.target.value) {
      if (index < codeInputs.current.length - 1) {
        codeInputs.current[index + 1].focus();
      }
    }
  };
  const handleFocus = () => {
    const index = codeInputs.current.findIndex((e) => {
      return e.value === "";
    });
    if (index == -1) {
      codeInputs.current[codeInputs.current.length - 1].focus();
    } else {
      codeInputs.current[index].focus();
    }
  };
  const validationSchemaCode = yup.object().shape({
    code: yup
      .array()
      .of(
        yup
          .string()
          .length(1, "Each field must have exactly 1 digit.")
          .required("All fields are required.")
      )
      .min(6, "Please complete all 6 fields.")
      .max(6, "Only 6 fields are allowed."),
  });
  const FormikCode = useFormik({
    initialValues: {
      code: Array(6).fill(""),
    },
    validationSchema: validationSchemaCode,
    onSubmit: handleVerifyCodeSubmit,
  });

  // handle reset password
  const handleResetPasswordSubmit = async (values) => {
    console.log(values);
    setIsLoading(true);

    try {
      const res = await resetPassword(userId, values.password);
      console.log(res);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const resetPasswordvalidationSchema = yup.object().shape({
    password: yup
      .string()
      .min(6, "Password must be at least 6 chart")
      .max(20, "Password must be at most 20 chart")
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });
  const FormikResetPassword = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: resetPasswordvalidationSchema,
    onSubmit: handleResetPasswordSubmit,
  });

  return (
    <>
      <section className="bg-gray-50 dark:bg-gray-900 w-full ">
        {!isResetCodeVerified && !isResetCodeSend ? ( // email form (send code)
          <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-screen lg:py-0">
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
              <h1 className="text-3xl font-bold leading-tight tracking-tight mt-5 text-center text-gray-900 md:text-2xl dark:text-white">
                Forgot password?
              </h1>
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <form
                  onSubmit={Formik.handleSubmit}
                  className="space-y-4 md:space-y-6"
                  action="#"
                >
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Email address
                    </label>
                    <input
                      type="email"
                      value={Formik.values.email}
                      onChange={Formik.handleChange}
                      onBlur={Formik.handleBlur}
                      name="email"
                      id="email"
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="name@example.com"
                      required=""
                    />
                    <div className="errors text-[14px] text-red-500 rounded-lg mt-2 px-2">
                      {Formik.touched.email && Formik.errors.email}
                    </div>
                  </div>
                  <div className="flex items-center justify-between flex-col gap-5">
                    <button
                      disabled={!Formik.isValid}
                      type="submit"
                      className={`w-full text-white ${
                        Formik.isValid
                          ? "bg-blue-600 hover:bg-primary-700"
                          : "bg-blue-700 bg-opacity-[50%] hover:none text-white text-opacity-[50%]"
                      }  focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800`}
                    >
                      {isLoading ? "Loading..." : "Reset password"}
                    </button>
                    <Link
                      href="/login"
                      className="w-full transition-all duration-300  text-blue-400 hover:bg-blue-600  hover:text-white border border-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    >
                      Login
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        ) : isResetCodeSend ? ( // verified OTP code form (check code)
          <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-screen lg:py-0">
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
              <h1 className="text-3xl font-bold leading-tight tracking-tight mt-5 text-center text-gray-900 md:text-2xl dark:text-white">
                Verification Code
              </h1>
              <p className="text-center text-gray-400 max-w-[80%] mx-auto">
                Enter the 6-digit verification code that was sent to your email
              </p>
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <form
                  onSubmit={FormikCode.handleSubmit}
                  className="space-y-4 md:space-y-6"
                  action="#"
                >
                  <div className="flex justify-between">
                    {Array(6)
                      .fill("")
                      .map((_, index) => {
                        return (
                          <input
                            key={index}
                            ref={(el) => (codeInputs.current[index] = el)}
                            type="text"
                            onKeyDown={handleKeyDown}
                            onInput={handleInput}
                            onFocus={handleFocus}
                            onPaste={handlePast}
                            value={FormikCode.values.code[index]}
                            onChange={(e) =>
                              FormikCode.setFieldValue(
                                `code[${index}]`,
                                e.target.value
                              )
                            }
                            onBlur={FormikCode.handleBlur}
                            name={`code_${index + 1}`}
                            id={`verifyCode_${index + 1}`}
                            maxLength="1"
                            className="bg-gray-50 border w-[15%] text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block  py-3 px-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            required
                          />
                        );
                      })}
                  </div>

                  <div className="resend-code flex gap-2">
                    <p>Don't receive the code?</p>{" "}
                    <button
                      onClick={() => handleSubmit(userEmail)}
                      className="text-blue underline"
                    >
                      send again
                    </button>
                  </div>
                  <div className="flex items-center justify-between flex-col gap-5">
                    <button
                      disabled={!FormikCode.isValid || isResetCodeVerified}
                      type="submit"
                      className={`w-full text-white ${
                        FormikCode.isValid
                          ? "bg-blue-600 hover:bg-primary-700"
                          : "bg-blue-700 bg-opacity-[50%] hover:none text-white text-opacity-[50%]"
                      }  focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800`}
                    >
                      {isLoading ? "Loading..." : "Submit"}
                    </button>
                    <Link
                      href="/login"
                      className="w-full transition-all duration-300  text-blue-400 hover:bg-blue-600  hover:text-white border border-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    >
                      Login
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        ) : isResetCodeVerified ? ( // reset password form (reset password)
          <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-screen lg:py-0">
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
              <h1 className="text-3xl font-bold leading-tight tracking-tight mt-5 text-center text-gray-900 md:text-2xl dark:text-white">
                Reset Password
              </h1>
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <form
                  onSubmit={FormikResetPassword.handleSubmit}
                  className="space-y-4 md:space-y-6"
                  action="#"
                >
                  <div>
                    <div className="relative">
                      <label
                        htmlFor="password"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Password
                      </label>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={FormikResetPassword.values.password}
                        onChange={FormikResetPassword.handleChange}
                        onBlur={FormikResetPassword.handleBlur}
                        id="password"
                        placeholder="••••••••"
                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                      <div
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-[2.32rem] right-2 cursor-pointer"
                      >
                        {showPassword ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="25"
                            height="25"
                            viewBox="0 0 24 24"
                          >
                            <rect width="24" height="24" fill="none" />
                            <path
                              fill="none"
                              stroke="#fff"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M21 9q-3.6 4-9 4T3 9m0 6l2.5-3.8M21 14.976L18.508 11.2M9 17l.5-4m5.5 4l-.5-4"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="25"
                            height="25"
                            viewBox="0 0 256 256"
                          >
                            <rect width="256" height="256" fill="none" />
                            <path
                              fill="#fff"
                              d="M245.48 125.57c-.34-.78-8.66-19.23-27.24-37.81C201 70.54 171.38 50 128 50S55 70.54 37.76 87.76c-18.58 18.58-26.9 37-27.24 37.81a6 6 0 0 0 0 4.88c.34.77 8.66 19.22 27.24 37.8C55 185.47 84.62 206 128 206s73-20.53 90.24-37.75c18.58-18.58 26.9-37 27.24-37.8a6 6 0 0 0 0-4.88M128 194c-31.38 0-58.78-11.42-81.45-33.93A134.8 134.8 0 0 1 22.69 128a134.6 134.6 0 0 1 23.86-32.06C69.22 73.42 96.62 62 128 62s58.78 11.42 81.45 33.94A134.6 134.6 0 0 1 233.31 128C226.94 140.21 195 194 128 194m0-112a46 46 0 1 0 46 46a46.06 46.06 0 0 0-46-46m0 80a34 34 0 1 1 34-34a34 34 0 0 1-34 34"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="errors text-[14px] text-red-500 rounded-lg mt-2 px-2">
                        {FormikResetPassword.touched.password &&
                          FormikResetPassword.errors.password}
                      </div>
                    </div>
                    <div className="relative">
                      <label
                        htmlFor="renter-password"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Renter-Password
                      </label>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={FormikResetPassword.values.confirmPassword}
                        onChange={FormikResetPassword.handleChange}
                        onBlur={FormikResetPassword.handleBlur}
                        id="renter-password"
                        placeholder="••••••••"
                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                      <div
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute top-[2.32rem] right-2 cursor-pointer"
                      >
                        {showConfirmPassword ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="25"
                            height="25"
                            viewBox="0 0 24 24"
                          >
                            <rect width="24" height="24" fill="none" />
                            <path
                              fill="none"
                              stroke="#fff"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M21 9q-3.6 4-9 4T3 9m0 6l2.5-3.8M21 14.976L18.508 11.2M9 17l.5-4m5.5 4l-.5-4"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="25"
                            height="25"
                            viewBox="0 0 256 256"
                          >
                            <rect width="256" height="256" fill="none" />
                            <path
                              fill="#fff"
                              d="M245.48 125.57c-.34-.78-8.66-19.23-27.24-37.81C201 70.54 171.38 50 128 50S55 70.54 37.76 87.76c-18.58 18.58-26.9 37-27.24 37.81a6 6 0 0 0 0 4.88c.34.77 8.66 19.22 27.24 37.8C55 185.47 84.62 206 128 206s73-20.53 90.24-37.75c18.58-18.58 26.9-37 27.24-37.8a6 6 0 0 0 0-4.88M128 194c-31.38 0-58.78-11.42-81.45-33.93A134.8 134.8 0 0 1 22.69 128a134.6 134.6 0 0 1 23.86-32.06C69.22 73.42 96.62 62 128 62s58.78 11.42 81.45 33.94A134.6 134.6 0 0 1 233.31 128C226.94 140.21 195 194 128 194m0-112a46 46 0 1 0 46 46a46.06 46.06 0 0 0-46-46m0 80a34 34 0 1 1 34-34a34 34 0 0 1-34 34"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="errors text-[14px] text-red-500 rounded-lg mt-2 px-2">
                        {FormikResetPassword.touched.confirmPassword &&
                          FormikResetPassword.errors.confirmPassword}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between flex-col gap-5">
                    <button
                      disabled={!FormikResetPassword.isValid}
                      type="submit"
                      className={`w-full text-white ${
                        FormikResetPassword.isValid
                          ? "bg-blue-600 hover:bg-primary-700"
                          : "bg-blue-700 bg-opacity-[50%] hover:none text-white text-opacity-[50%]"
                      }  focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800`}
                    >
                      {isLoading ? "Loading..." : "Reset password"}
                    </button>
                    <Link
                      href="/login"
                      className="w-full transition-all duration-300  text-blue-400 hover:bg-blue-600  hover:text-white border border-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    >
                      Login
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </section>
    </>
  );
}
