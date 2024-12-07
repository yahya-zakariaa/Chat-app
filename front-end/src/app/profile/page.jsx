"use client";
import React from "react";
import defaultAvatar from "../../../public/default-avatar.png";
import { useAuthStore } from "@/store/useAuthStore.js";
import { useEffect, useState } from "react";
import Link from "next/link";

import Image from "next/image";
export default function profile() {
  const [selectedImage, setSelectedImage] = useState();
  const {
    user,
    checkAuth,
    isCheckingAuth,
    logout,
    isLoggingOut,
    updateUserPic,
    isUpdatingProfile,
    updateUsername,
  } = useAuthStore();
  const handelCheckAuth = async () => {
    const res = await checkAuth();
    if (res?.status == 401) {
      router.push("/login");
    }
  };

  const handleUpdateProfilePic = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImage(base64Image);
      await updateUserPic({ avatar: base64Image });
    };
  };

  const handleUpdateProfileName = async (e) => {
    const name = e.target.value;
    if (name == user?.username) return;
    if (!name) return;
    try {
      await updateUsername(name);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handelCheckAuth();
  }, [isLoggingOut]);

  return (
    <section className="bg-gray-50 dark:bg-gray-950 w-full ">
      <div className="flex flex-col items-center justify-start   px-6 py-8 mx-auto min-h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg mt-[100px] shadow dark:border  sm:max-w-md xl:p-0 dark:bg-gray-900 dark:border-gray-700 min-w-[600px]">
          <h1 className="text-2xl mb-10 font-bold leading-tight tracking-wide mt-5 text-center text-gray-900 md:text-3xl dark:text-white ">
            Profile
          </h1>
          <div className="content flex-col justify-start flex items-center">
            <div className="user-image-container relative mb-2 ">
              <input
                type="file"
                id={"main-section-upload-image"}
                onChange={handleUpdateProfilePic}
                disabled={isUpdatingProfile}
                accept="image/*"
                className="w-[45px] cursor-pointer inline-flex z-[6] opacity-0 rounded-full  h-[45px] top-[63%]  border-[#050a19] border-[7px] right-[-1%] bg-[#0f225c] absolute text-[20px] font-bold "
              />
              <div className=" absolute cursor-pointer z-[1] w-fit h-fit top-[63%] right-0 bg-blue-950 px-3 py-3 flex justify-center items-center rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 56 56"
                >
                  <path
                    fill="#fff"
                    d="M7.809 50.348H48.19c4.875 0 7.36-2.438 7.36-7.266V18.543c0-4.828-2.485-7.242-7.36-7.242h-5.484c-1.828 0-2.39-.375-3.445-1.547l-1.899-2.11c-1.148-1.288-2.343-1.992-4.781-1.992h-9.328c-2.414 0-3.61.704-4.781 1.992l-1.899 2.11c-1.031 1.148-1.617 1.547-3.445 1.547h-5.32c-4.875 0-7.36 2.414-7.36 7.242v24.539c0 4.828 2.485 7.266 7.36 7.266m20.18-7.5c-7.079 0-12.774-5.696-12.774-12.82c0-7.126 5.695-12.82 12.773-12.82c7.125 0 12.797 5.694 12.797 12.82c0 7.124-5.695 12.82-12.797 12.82m16.851-18.54c-1.594 0-2.906-1.288-2.906-2.882a2.906 2.906 0 1 1 5.812 0c0 1.594-1.312 2.883-2.906 2.883m-16.85 14.977a9.247 9.247 0 0 0 9.258-9.258a9.247 9.247 0 0 0-9.258-9.257c-5.11 0-9.234 4.125-9.234 9.257c0 5.133 4.148 9.258 9.234 9.258"
                  />
                </svg>
              </div>
              <Image
                width={150}
                height={150}
                src={selectedImage || user?.avatar || defaultAvatar}
                alt="user avatar"
                blurDataURL={selectedImage || user?.avatar || defaultAvatar}
                className="user-image w-[150px] h-[150px]  rounded-full mb-4 mx-auto"
              />
            </div>
            <span className="text-gray-400 text-[14px] tracking-wide ">
              click the camera icon to update your photo
            </span>
            <div className="inputs w-[90%] flex flex-col gap-10 justify-center items-start my-10">
              <div className="input-container flex flex-col w-full justify-center items-start">
                <label
                  htmlFor="username"
                  className=" flex items-end mb-2 justify-start gap-x-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <rect width="24" height="24" fill="none" />
                    <g
                      fill="none"
                      stroke="#fff"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </g>
                  </svg>
                  Full Name
                </label>
                <input
                  id="username"
                  type="text"
                  onBlur={handleUpdateProfileName}
                  placeholder={user?.username}
                  className="bg-[#090c1c] px-3 rounded-lg py-3 w-full border border-gray-500"
                />
              </div>
              <div className="input-container  flex flex-col w-full justify-center items-start">
                <label
                  htmlFor="userEmail"
                  className=" flex items-end mb-2 justify-start gap-x-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 36 36"
                  >
                    <rect width="24" height="24" fill="none" />
                    <path
                      fill="#fff"
                      d="M32 6H4a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h28a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2m-1.54 22H5.66l7-7.24l-1.44-1.39L4 26.84V9.52l12.43 12.37a2 2 0 0 0 2.82 0L32 9.21v17.5l-7.36-7.36l-1.41 1.41ZM5.31 8h25.07L17.84 20.47Z"
                      className="clr-i-outline clr-i-outline-path-1"
                    />
                    <path fill="none" d="M0 0h36v36H0z" />
                  </svg>
                  Email
                </label>
                <input
                  id="userEmail"
                  type="text"
                  placeholder={user?.email}
                  className="bg-[#090c1c] px-3 rounded-lg py-3 w-full border border-gray-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
