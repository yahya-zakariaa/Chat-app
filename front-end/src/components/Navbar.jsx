import React from "react";
import defaultAvatar from "../../public/default-avatar.png";
import Image from "next/image";

export default function Navbar({ setActiveComponent, setIsToggled, user }) {
  return (
    <nav className=" w-[100%] md:px-5 px-3  rounded-xl mx-auto h-[10%] flex justify-between items-center bg-[#1a1a1a]">
      <div className="userProfile">
        <Image
          src={user?.avatar || defaultAvatar}
          placeholder="empty"
          className="rounded-full w-[40px] h-[40px] object-cover"
          alt="profile"
          width={50}
          height={50}
        />
      </div>
      <ul className="flex items-center gap-4">
        <li aria-label="Add new friend">
          <button
            onClick={() => {
              setActiveComponent("descoverFriends");
              setIsToggled(true);
            }}
            aria-label="Add new friend"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
            >
              <rect width="28" height="28" fill="none" />
              <path
                fill="#fff"
                fillRule="evenodd"
                d="M18.75 10.75V8h1.5v2.75H23v1.5h-2.75V15h-1.5v-2.75H16v-1.5zm-10.918 1.6C7.096 11.478 6.5 9.85 6.5 8.71V7a4 4 0 0 1 8 0v1.71c0 1.14-.6 2.773-1.332 3.642l-.361.428c-.59.699-.406 1.588.419 1.99l5.66 2.762c.615.3 1.114 1.093 1.114 1.783v.687a1 1 0 0 1-1.001.998H2a1 1 0 0 1-1-.998v-.687c0-.685.498-1.483 1.114-1.784l5.66-2.762c.821-.4 1.012-1.288.42-1.99z"
              />
            </svg>
          </button>
        </li>
        <li aria-label="notifications">
          <button
            aria-label="notifications"
            onClick={() => {
              setActiveComponent("notifications");
              setIsToggled(true);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              viewBox="0 0 512 512"
            >
              <rect width="25" height="25" fill="none" />
              <path
                fill="#fff"
                d="M440.08 341.31c-1.66-2-3.29-4-4.89-5.93c-22-26.61-35.31-42.67-35.31-118c0-39-9.33-71-27.72-95c-13.56-17.73-31.89-31.18-56.05-41.12a3 3 0 0 1-.82-.67C306.6 51.49 282.82 32 256 32s-50.59 19.49-59.28 48.56a3.1 3.1 0 0 1-.81.65c-56.38 23.21-83.78 67.74-83.78 136.14c0 75.36-13.29 91.42-35.31 118c-1.6 1.93-3.23 3.89-4.89 5.93a35.16 35.16 0 0 0-4.65 37.62c6.17 13 19.32 21.07 34.33 21.07H410.5c14.94 0 28-8.06 34.19-21a35.17 35.17 0 0 0-4.61-37.66M256 480a80.06 80.06 0 0 0 70.44-42.13a4 4 0 0 0-3.54-5.87H189.12a4 4 0 0 0-3.55 5.87A80.06 80.06 0 0 0 256 480"
              />
            </svg>
          </button>
        </li>
      </ul>
    </nav>
  );
}
