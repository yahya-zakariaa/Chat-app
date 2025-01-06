"use client";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import * as yup from "yup";
export default function Login() {
  const { login, isLoggingIn } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (values) => {
    try {
      const res = await login(values?.email, values?.password);
      console.log(res);
      return router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid email")
      .required("Email is required"),
    password: yup.string().required("Password is required"),
  });
  const Formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  });
  return (
    <section className=" dark:bg-[#000] w-full ">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-[#0e0e0e] dark:border-[#a1a1a12c]">
          <h1 className="text-3xl font-bold leading-tight tracking-tight mt-5 text-center text-gray-900 md:text-2xl dark:text-white">
            Login
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
                  className="block ps-1 mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  value={Formik.values.email}
                  onChange={Formik.handleChange}
                  onBlur={Formik.handleBlur}
                  name="email"
                  id="email"
                  className="bg-[#0000005c] text-[#c9c9c9] placeholder:text-[#ffffff4a] border border-[#ffffff34]  rounded-lg focus:ring-transparent focus:border-[#ffffffa5] transition-all duration-300 outline-none block w-full p-2.5 "
                  placeholder="name@example.com"
                  required=""
                />
                <div className="errors text-[14px] text-red-400 rounded-lg mt-2 px-1">
                  {Formik.touched.email && Formik.errors.email}
                </div>
              </div>
              <div className="relative">
                <label
                  htmlFor="password"
                  className="block ps-1 mb-2 text-sm font-medium text-white "
                >
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={Formik.values.password}
                  onChange={Formik.handleChange}
                  onBlur={Formik.handleBlur}
                  id="password"
                  placeholder="••••••••"
                  className="bg-[#0000005c] text-[#c9c9c9] placeholder:text-[#ffffff4a] border border-[#ffffff34]  rounded-lg focus:ring-transparent focus:border-[#ffffffa5] transition-all duration-300 outline-none block w-full p-2.5 "
                  required=""
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
                        stroke="#c9c9c9"
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
                        fill="#c9c9c9"
                        d="M245.48 125.57c-.34-.78-8.66-19.23-27.24-37.81C201 70.54 171.38 50 128 50S55 70.54 37.76 87.76c-18.58 18.58-26.9 37-27.24 37.81a6 6 0 0 0 0 4.88c.34.77 8.66 19.22 27.24 37.8C55 185.47 84.62 206 128 206s73-20.53 90.24-37.75c18.58-18.58 26.9-37 27.24-37.8a6 6 0 0 0 0-4.88M128 194c-31.38 0-58.78-11.42-81.45-33.93A134.8 134.8 0 0 1 22.69 128a134.6 134.6 0 0 1 23.86-32.06C69.22 73.42 96.62 62 128 62s58.78 11.42 81.45 33.94A134.6 134.6 0 0 1 233.31 128C226.94 140.21 195 194 128 194m0-112a46 46 0 1 0 46 46a46.06 46.06 0 0 0-46-46m0 80a34 34 0 1 1 34-34a34 34 0 0 1-34 34"
                      />
                    </svg>
                  )}
                </div>
                <div className="errors text-[14px] text-red-400 rounded-lg mt-2 px-1">
                  {Formik.touched.password && Formik.errors.password}
                </div>
              </div>
              <div className="flex items-center justify-end">
                <Link
                  href={"/forgot-password"}
                  className="text-sm font-medium text-primary-600 hover:underline dark:text-white "
                >
                  Forgot password?
                </Link>
              </div>
              <button
                disabled={!Formik.isValid || isLoggingIn}
                type="submit"
                className="w-full text-black bg-[#eeeeee] hover:bg-[#e0e0e0e2] transition-all duration-300 cursor-pointer focus:ring-4 focus:outline-none  font-bold rounded-lg text-md px-5 py-2.5 text-center dark:focus:ring-primary-900 "
              >
                {isLoggingIn ? "Loading..." : "Login"}
              </button>
              <p className="text-sm font-light text-white ">
                Don’t have an account yet ?{" "}
                <Link
                  href={"/signup"}
                  className="font-medium text-[#CCC] hover:underline "
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
