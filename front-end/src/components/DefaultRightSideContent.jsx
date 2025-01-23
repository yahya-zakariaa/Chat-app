"use client";
import { useAuthStore } from "@/store/useAuthStore";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import defaultAvatar from "../../public/default-avatar.png";
import toast from "react-hot-toast";
import "cropperjs/dist/cropper.css";
import useImageHandlerStore from "@/store/useImageHandlerStore";
import { useToggleComponents } from "@/store/useToggleComponents";

export default function DefaultRightSideContent() {
  const { user, isUpdatingProfile, isCheckingAuth } = useAuthStore();
  const { setSelectedImage, croppedImage, setIsUpdatingAvatar } =
    useImageHandlerStore();
  const { setActiveComponent, setIsToggled } = useToggleComponents();
  const handelUpdateProfilePic = async (e) => {
    const file = e.target.files[0];

    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      return toast.error("Image size should be less than 2MB");
    }
    if (
      file.type !== "image/jpeg" &&
      file.type !== "image/png" &&
      file.type !== "image/jpg"
    ) {
      return toast.error(
        "Invalid file type - Please upload a valid image type"
      );
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setIsUpdatingAvatar(true);
      setSelectedImage(base64Image);
      // await updateUserPic({ avatar: base64Image });
    };
  };

  return (
    <div className="default-content flex flex-col justify-between pt-16 items-center w-full h-full ">
      <div className="content flex-col justify-start flex items-center">
        <h1 className="  font-bold text-[26px] mb-10">Welcome to Nexus chat</h1>

        <div className="user-image-container relative">
          {user || !isCheckingAuth ? (
            <>
              <input
                type="file"
                id={"main-section-upload-image"}
                onChange={handelUpdateProfilePic}
                onClick={(e) => (e.target.value = null)}
                disabled={isUpdatingProfile}
                accept="image/*"
                className="w-[45px] cursor-pointer inline-flex  z-[6] opacity-0 rounded-full  h-[45px] top-[63%]  border-[#050a19] border-[7px] right-[-1%] bg-[#0f225c] absolute text-[20px] font-bold "
              />
              <div className=" absolute cursor-pointer z-[1] w-fit h-fit top-[63%] right-0 bg-[#010101]  px-3 py-3 flex justify-center items-center rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="cursor-pointer"
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
                src={croppedImage || user?.avatar || defaultAvatar}
                alt="user avatar"
                priority={true}
                blurDataURL={croppedImage || user?.avatar || defaultAvatar}
                className="user-image  border-[#ffffffcb] border-2  aspect-square  object-cover  rounded-full overflow-hidden mb-4 mx-auto"
              />
            </>
          ) : (
            <>
              <div
                alt="user avatar"
                className="user-image skeleton-loader w-[150px] h-[150px] min-w-[150px] min-h-[150px]    aspect-square  object-cover  rounded-full overflow-hidden mb-4 mx-auto"
              />
            </>
          )}
        </div>
        {user || !isCheckingAuth ? (
          <button
            onClick={() => {
              setIsToggled(true);
              setActiveComponent("userProfile");
            }}
            className="font-bold text-[18px] px-5 py-1.5 mt-3 rounded-lg bg-[#1c1c1c] border-[#ffffff2a] border text-white"
          >
            View Profile
          </button>
        ) : (
          <div className=" skeleton-loader w-[150px] h-[45px] px-5 py-1.5 mt-3 rounded-lg bg-[#1c1c1c] border-[#ffffff2a] border text-white"></div>
        )}
      </div>
      <footer className="py-3 flex flex-col gap-3 justify-center  items-center w-full">
        <div className="  flex justify-center gap-10 items-center w-full">
          <Link
            href={"#"}
            className="font-medium hover:underline text-gray-400 text-[13px]"
          >
            contact us
          </Link>
          <Link
            href={"#"}
            className="font-medium hover:underline text-gray-400 text-[13px]"
          >
            services
          </Link>
          <Link
            href={"#"}
            className="font-medium hover:underline text-gray-400 text-[13px]"
          >
            support
          </Link>
          <Link
            href={"#"}
            className="font-medium hover:underline text-gray-400 text-[13px]"
          >
            terms and condations
          </Link>
        </div>
        <div className="copyRight w-full text-center text-[13px] text-gray-400">
          <i className="fa fa-copyright"></i> @ Copy Right 2024
        </div>
      </footer>
    </div>
  );
}
