import Image from "next/image";
import React, { useState } from "react";
import defaultAvatar from "../../public/default-avatar.png";
import { useUserStore } from "@/store/useUserStore";
import { useEffect } from "react";
import NotificationCard from "./NotificationCard";

export default function Notifications({ setIsToggled }) {
  const { getFriendRequest } = useUserStore();
  const [requests, setRequests] = useState([]);

  const handleGetFriendRequest = async () => {
    try {
      const res = await getFriendRequest();
      setRequests(res?.data?.data.requests);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetFriendRequest();
  }, []);
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="notifications md:w-full md:h-full md:rounded-none pb-4 rounded-lg md:relative absolute  md:translate-x-0 md:translate-y-0 translate-y-[-50%] md:left-0 md:top-0 top-[50%] left-[50%] translate-x-[-50%] w-[90%] h-[90%] lg:bg-transparent bg-[#0d0d0d] border-[.2px] md:border-none border-[#dddddd2d] pt-5 px-1 overflow-hidden flex flex-col"
    >
      <div className="notifications-container  w-full h-full px-4 pb-4 pt- flex flex-col items-center justify-center">
        <div className="header flex w-full items-center justify-start lg:gap-10 lg:m-0 mt-">
          <button
            onClick={() => setIsToggled(false)}
            className="mb-[2px] text-white lg:block hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="35"
              height="35"
              viewBox="0 0 24 24"
            >
              <rect width="35" height="35" fill="none" />
              <path
                fill="none"
                stroke="#fff"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 12h14M5 12l6 6m-6-6l6-6"
              />
            </svg>
          </button>
          <div className="title-filtration flex items-center justify-between w-full">
            <h2 className="text-white text-2xl font-semibold">Notifications</h2>

            <ul className="flex items-center gap-4">
              <li className="  font-semibold bg-[#ecececf0] text-[#141414] px-5 py-1 rounded-md text-[16px]">
                All
              </li>
              <li className="  font-semibold bg-[#69686868] text-[#ddd] px-5 py-1 rounded-md text-[16px]">
                News
              </li>
              <li className="  font-semibold bg-[#69686868] text-[#ddd] px-5 py-1 rounded-md text-[16px]">
                Unread
              </li>
            </ul>
            <button
              onClick={() => setIsToggled(false)}
              className=" text-white lg:hidden me-[-5px] mt-[-1px]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
              >
                <rect width="24" height="24" fill="none" />
                <path
                  fill="#fff"
                  fillRule="evenodd"
                  d="M6.793 6.793a1 1 0 0 1 1.414 0L12 10.586l3.793-3.793a1 1 0 1 1 1.414 1.414L13.414 12l3.793 3.793a1 1 0 0 1-1.414 1.414L12 13.414l-3.793 3.793a1 1 0 0 1-1.414-1.414L10.586 12L6.793 8.207a1 1 0 0 1 0-1.414"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="notifications-messages flex flex-col justify-start items-start  w-full md:w-[80%] flex-grow mt-5 overflow-auto">
          {requests?.length > 0 ? (
            requests.map((request) => (
              <NotificationCard key={request._id} request={request} handleGetFriendRequest={handleGetFriendRequest} />
            ))
          ) : (
            <div className="not-found w-full h-full flex items-start justify-center">
              <h3 className="text-[24px] font-bold mt-28">No activity found</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
