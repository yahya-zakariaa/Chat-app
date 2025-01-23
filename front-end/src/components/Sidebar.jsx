import { useUserStore } from "@/store/useUserStore";
import { useAuthStore } from "@/store/useAuthStore";
import defaultAvatar from "../../public/default-avatar.png";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";

export default function Sidebar({
  logout,
  reset,
  user,
  setIsToggled,
  setActiveComponent,
}) {
  const router = useRouter();
  const [toggleSettings, setToggleSettings] = useState(false);
  const { getFriends, friends } = useUserStore();
  const { isCheckingAuth, onlineUsers } = useAuthStore();
  const [onlinefriends, setOnlineFriends] = useState([]);

  useEffect(() => {
    getFriends();
  }, [getFriends]);

  useEffect(() => {
    setOnlineFriends(Array.from(onlineUsers));
  }, [onlineUsers.size,setOnlineFriends]);

  return (
    <div className="sidebar rounded-xl overflow-hidden  flex flex-row md:flex-col md:py-3 justify-between items-center md:h-[100%] lg:w-[5%] md:w-[7%] w-[100%] left-[50%] translate-x-[-50%] md:translate-x-0 md:min-h-full min-h-[11%] flex-shrink    shadow-3xl  bg-[#1a1a1a] md:backdrop-blur-0 backdrop-blur-md  relative md:top-0 md:left-0 z-[999]">
      <ul className="userFriends md:flex hidden md:mt-0  flex-col gap-2 items-center justify-start ">
        {friends?.length > 0 || !isCheckingAuth
          ? friends?.slice(0, 5)?.map((friend) => (
              <li
                key={friend?._id}
                className=" px-2 md:rounded-md rounded-full relative  max-w-full min-h-[60px] justify-center flex items-center"
              >
                <span
                  className={`absolute top-2 right-1 w-3 h-3 ${
                    onlinefriends?.includes(friend?._id)
                      ? "bg-green-500"
                      : "bg-gray-600"
                  }  rounded-full`}
                ></span>
                <Image
                  width={60}
                  height={60}
                  src={friend?.avatar || defaultAvatar}
                  alt="user"
                  className="w-[45px] h-[45px] min-w-[45px] min-h-[45px] rounded-full object-cover"
                />
              </li>
            ))
          : Array(4)
              .fill(0)
              .map((_, index) => (
                <li
                  key={index}
                  className=" px-2 md:rounded-md rounded-full  max-w-full min-h-[60px] justify-center flex items-center"
                >
                  <div
                    alt="user avatar skelton"
                    className="w-[45px] h-[45px] skeleton-loader min-w-[45px] min-h-[45px] rounded-full object-cover"
                  />
                </li>
              ))}
      </ul>

      <ul className="flex flex-row   md:flex-col justify-evenly md:justify-center items-center pb-3 pt-2 mb-[-5px] h-fit w-full gap-4 ">
        {!isCheckingAuth && user ? (
          <>
            {" "}
            <li className="order-4 md:order-1 hover:bg-white px-2 md:rounded-md rounded-full hover:bg-opacity-10 min-h-[50px] md:min-h-[40px] md:w-[70%] w-[50px] justify-center flex items-center">
              <button onClick={() => reset()} className="">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M10 19v-5h4v5c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-7h1.7c.46 0 .68-.57.33-.87L12.67 3.6c-.38-.34-.96-.34-1.34 0l-8.36 7.53c-.34.3-.13.87.33.87H5v7c0 .55.45 1 1 1h3c.55 0 1-.45 1-1"
                  />
                </svg>
              </button>
            </li>
            <li className="order-3 md:order-2  hover:bg-white px-2 md:rounded-md rounded-full hover:bg-opacity-10 min-h-[50px] md:min-h-[40px] md:w-[70%] w-[50px] justify-center flex items-center">
              <button
                onClick={() => {
                  setIsToggled(true);
                  setActiveComponent("friends");
                }}
                className=""
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 640 512"
                >
                  <rect width="32" height="32" fill="none" />
                  <path
                    fill="#fff"
                    d="M192 256c61.9 0 112-50.1 112-112S253.9 32 192 32S80 82.1 80 144s50.1 112 112 112m76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C51.6 288 0 339.6 0 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2M480 256c53 0 96-43 96-96s-43-96-96-96s-96 43-96 96s43 96 96 96m48 32h-3.8c-13.9 4.8-28.6 8-44.2 8s-30.3-3.2-44.2-8H432c-20.4 0-39.2 5.9-55.7 15.4c24.4 26.3 39.7 61.2 39.7 99.8v38.4c0 2.2-.5 4.3-.6 6.4H592c26.5 0 48-21.5 48-48c0-61.9-50.1-112-112-112"
                  />
                </svg>
              </button>
            </li>
            <li
              className={`md:order-3 order-2 relative ${
                !toggleSettings ? "bg-transparent" : "bg-white bg-opacity-10"
              } hover:bg-white px-2 md:rounded-md rounded-full hover:bg-opacity-10 min-h-[50px] md:min-h-[40px] md:w-[70%] w-[50px] justify-center flex items-center`}
            >
              <button
                onClick={() => setToggleSettings(!toggleSettings)}
                className="w-full h-full flex justify-center items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97s-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1s.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64z"
                  />
                </svg>
              </button>
              <div
                className={`arrow ${
                  !toggleSettings ? "hidden" : ""
                }  border-transparent border-r-[#212638] border-[18px] w-[20px] h-[20px] absolute md:left-[75%] bottom-[50%] translate-y-[50%]`}
              ></div>
              <ul
                className={`bg-[#212638] ${
                  !toggleSettings ? "hidden" : "flex"
                }    gap-4 rounded-lg ps-2 pe-7 pb-7 pt-3 h-[300px] w-[250px]   flex-col left-[130%] bottom-[-170%]  absolute`}
              >
                <li>
                  <Link href="#" className={"flex items-center  gap-2 "}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="23"
                      height="22"
                      viewBox="0 0 512 512"
                    >
                      <rect width="23" height="23" fill="none" />
                      <path
                        fill="none"
                        stroke="#fff"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="50"
                        d="M463.1 112.37C373.68 96.33 336.71 84.45 256 48c-80.71 36.45-117.68 48.33-207.1 64.37C32.7 369.13 240.58 457.79 256 464c15.42-6.21 223.3-94.87 207.1-351.63"
                      />
                    </svg>
                    <p className="text-[18px] font-medium mb-[-1px]">
                      Security
                    </p>
                  </Link>
                </li>
                <li>
                  <Link href="#" className={"flex items-center  gap-2 "}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="23"
                      height="23"
                      viewBox="0 0 24 24"
                    >
                      <rect width="23" height="23" fill="none" />
                      <path
                        fill="#fff"
                        stroke="#fff"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.2"
                        d="M12.028 17.23q.332 0 .56-.228t.228-.56t-.23-.56q-.228-.228-.56-.228t-.56.229t-.227.56q0 .332.228.56q.23.228.561.228m-.517-3.312h.966q.038-.652.245-1.06q.207-.407.851-1.04q.67-.669.996-1.199t.327-1.226q0-1.182-.83-1.884q-.831-.702-1.966-.702q-1.079 0-1.832.586q-.753.587-1.103 1.348l.92.381q.24-.546.687-.965q.447-.42 1.29-.42q.972 0 1.42.534q.449.534.449 1.174q0 .52-.281.928q-.28.409-.73.822q-.87.802-1.14 1.36t-.269 1.363M12.003 21q-1.866 0-3.51-.708q-1.643-.709-2.859-1.924t-1.925-2.856T3 12.003t.709-3.51Q4.417 6.85 5.63 5.634t2.857-1.925T11.997 3t3.51.709q1.643.708 2.859 1.922t1.925 2.857t.709 3.509t-.708 3.51t-1.924 2.859t-2.856 1.925t-3.509.709M12 20q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8"
                      />
                    </svg>
                    <p className="text-[18px] font-medium mb-[-1px]">Help</p>
                  </Link>
                </li>
              </ul>
            </li>
            <li className="order-1 md:order-4  px-2 md:rounded-md rounded-full hover:bg-opacity-10 min-h-[50px] md:min-h-[40px] md:w-[70%] w-[50px] justify-center flex items-center ">
              <button
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="35"
                  height="35"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#ff2323"
                    d="M15 2h-1c-2.828 0-4.243 0-5.121.879C8 3.757 8 5.172 8 8v8c0 2.828 0 4.243.879 5.121C9.757 22 11.172 22 14 22h1c2.828 0 4.243 0 5.121-.879C21 20.243 21 18.828 21 16V8c0-2.828 0-4.243-.879-5.121C19.243 2 17.828 2 15 2"
                    opacity="0.6"
                  />
                  <path
                    fill="#ff9494"
                    d="M8 8c0-1.538 0-2.657.141-3.5H8c-2.357 0-3.536 0-4.268.732S3 7.143 3 9.5v5c0 2.357 0 3.535.732 4.268S5.643 19.5 8 19.5h.141C8 18.657 8 17.538 8 16z"
                    opacity="0.4"
                  />
                  <path
                    fill="#ffdddd"
                    fillRule="evenodd"
                    d="M4.47 11.47a.75.75 0 0 0 0 1.06l2 2a.75.75 0 0 0 1.06-1.06l-.72-.72H14a.75.75 0 0 0 0-1.5H6.81l.72-.72a.75.75 0 1 0-1.06-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </li>
          </>
        ) : (
          <>
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <li
                  key={index}
                  className="skeleton-loader px-2 md:rounded-md rounded-full hover:bg-opacity-10 min-h-[40px] md:min-h-[40px] md:w-[70%] w-[50px] justify-center flex items-center "
                ></li>
              ))}
          </>
        )}
      </ul>
    </div>
  );
}
