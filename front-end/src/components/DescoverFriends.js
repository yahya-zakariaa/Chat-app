import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useUserStore } from "@/store/useUserStore";
import defaultAvatar from "../../public/default-avatar.png";
export default function DescoverFriends({ setIsToggled }) {
  return (
    <div onClick={(e) => e.stopPropagation()} className="descover-friends md:w-full md:h-full md:rounded-none rounded-lg md:relative absolute  md:translate-x-0 md:translate-y-0 translate-y-[-50%] md:left-0 md:top-0 top-[50%] left-[50%] translate-x-[-50%] w-[90%] h-[90%] bg-black py-5 px-2 overflow-auto flex flex-col">
      <button
        onClick={() => setIsToggled(false)}
        className="absolute top-2 right-2 text-white"
      >
        x
      </button>
      <div className="header w-full mt-2 h-fit flex items-center justify-center">
        <h3 className="text-white text-[30px] font-bold">
          Descover new friends
        </h3>
      </div>
      <div className="Filteration w-full h-fit flex items-center justify-center mt-7">
        <input
          type="text"
          placeholder="Search for friends"
          className="w-[90%] md:w-[60%] px-2 py-2 text-black  rounded-md"
        />
      </div>
      <div className="friend-result mt-7 bg-gray-700 w-full flex-grow px-2 py-2">
        <div className="users md:flex-row flex flex-col md:flex-wrap md:gap-y-5 gap-y-4 md:justify-between ">
          <div className="user flex flex-col md:w-[49%] bg-black rounded-md pb-3 pt-2 px-2">
            <div className="user-data  flex items-center justify-start gap-3">
              <div className="user-avatar">
                <Image
                  src={defaultAvatar}
                  alt="default avatar"
                  width={60}
                  height={60}
                />
              </div>
              <div className="userInfo flex flex-col">
                <div className="user-name text-[18px] font-bold flex items-center justify-start gap-1">
                  <span className="text-gray-300 mt-[-3px] text-[12px]">
                    @{" "}
                  </span>{" "}
                  <span> User Name</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="user-bio text-gray-300 text-[14px] font-normal line-clamp-1 w-[65%]">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Accusamus, ad.
                  </div>
                  <div className="multiple-friends flex">
                    <Image
                      src={defaultAvatar}
                      alt="default avatar"
                      width={20}
                      height={20}
                    />
                    <Image
                      src={defaultAvatar}
                      alt="default avatar"
                      className="ml-[-10px]"
                      width={20}
                      height={20}
                    />
                    <Image
                      src={defaultAvatar}
                      alt="default avatar"
                      className="ml-[-10px]"
                      width={20}
                      height={20}
                    />
                  </div>
                </div>
              </div>
            </div>
            <button className="w-full bg-white text-black py-1 rounded-md mt-1">
              add +
            </button>
          </div>
          <div className="user flex flex-col md:w-[49%] bg-black rounded-md pb-3 pt-2 px-2">
            <div className="user-data  flex items-center justify-start gap-3">
              <div className="user-avatar">
                <Image
                  src={defaultAvatar}
                  alt="default avatar"
                  width={60}
                  height={60}
                />
              </div>
              <div className="userInfo flex flex-col">
                <div className="user-name text-[18px] font-bold flex items-center justify-start gap-1">
                  <span className="text-gray-300 mt-[-3px] text-[12px]">
                    @{" "}
                  </span>{" "}
                  <span> User Name</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="user-bio text-gray-300 text-[14px] font-normal line-clamp-1 w-[65%]">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Accusamus, ad.
                  </div>
                  <div className="multiple-friends flex">
                    <Image
                      src={defaultAvatar}
                      alt="default avatar"
                      width={20}
                      height={20}
                    />
                    <Image
                      src={defaultAvatar}
                      alt="default avatar"
                      className="ml-[-10px]"
                      width={20}
                      height={20}
                    />
                    <Image
                      src={defaultAvatar}
                      alt="default avatar"
                      className="ml-[-10px]"
                      width={20}
                      height={20}
                    />
                  </div>
                </div>
              </div>
            </div>
            <button className="w-full bg-white text-black py-1 rounded-md mt-1">
              add +
            </button>
          </div>
          <div className="user flex flex-col md:w-[49%] bg-black rounded-md pb-3 pt-2 px-2">
            <div className="user-data  flex items-center justify-start gap-3">
              <div className="user-avatar">
                <Image
                  src={defaultAvatar}
                  alt="default avatar"
                  width={60}
                  height={60}
                />
              </div>
              <div className="userInfo flex flex-col">
                <div className="user-name text-[18px] font-bold flex items-center justify-start gap-1">
                  <span className="text-gray-300 mt-[-3px] text-[12px]">
                    @{" "}
                  </span>{" "}
                  <span> User Name</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="user-bio text-gray-300 text-[14px] font-normal line-clamp-1 w-[65%]">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Accusamus, ad.
                  </div>
                  <div className="multiple-friends flex">
                    <Image
                      src={defaultAvatar}
                      alt="default avatar"
                      width={20}
                      height={20}
                    />
                    <Image
                      src={defaultAvatar}
                      alt="default avatar"
                      className="ml-[-10px]"
                      width={20}
                      height={20}
                    />
                    <Image
                      src={defaultAvatar}
                      alt="default avatar"
                      className="ml-[-10px]"
                      width={20}
                      height={20}
                    />
                  </div>
                </div>
              </div>
            </div>
            <button className="w-full bg-white text-black py-1 rounded-md mt-1">
              add +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
