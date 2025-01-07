import React, { useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { useEffect } from "react";
import NotificationCard from "./NotificationCard";

export default function Notifications({ setIsToggled, windowWidth, reset }) {
  const { getFriendRequest, friendRequests } = useUserStore();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    getFriendRequest();
  }, [getFriendRequest]);
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="notifications md:w-full md:h-full md:rounded-none pb-4 rounded-lg md:relative absolute  md:translate-x-0 md:translate-y-0 translate-y-[-50%] md:left-0 md:top-0 top-[50%] left-[50%] translate-x-[-50%] w-[90%] h-[90%] lg:bg-transparent bg-[#0d0d0d] border-[.2px] md:border-none border-[#dddddd2d] pt-4 md:pt-5 px- overflow-hidden flex flex-col"
    >
      <div className="notifications-container  w-full h-full px-3 md:px-4 pb-4  flex flex-col items-center justify-center">
        <div className="header flex w-full md:flex-row flex-col items-center justify-start lg:gap-10 gap-3 lg:m-0 ">
          <button
            onClick={() =>
              windowWidth >= 1024 ? reset() : setIsToggled(false)
            }
            className=" text-white lg:block hidden"
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
          <div className="title flex items-center gap-4 justify-start w-full">
            <button
              onClick={() => setIsToggled(false)}
              className=" text-white lg:hidden me-[-5px] mt-[-.5px]"
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
            <h2 className="text-white text-[24px] md:text-2xl font-semibold">
              Notifications
            </h2>
          </div>
          <div className="filtration flex items-center justify-between w-full">
            <ul className="flex items-center md:gap-4 w-full md:justify-start justify-around">
              <li className="  font-semibold min-w-[80px] max-w-[100px] text-center bg-[#ecececf0] text-[#141414] px-5 py-1 rounded-md text-[16px]">
                All
              </li>
              <li className="  font-semibold min-w-[80px] max-w-[100px] text-center bg-[#69686868] text-[#ddd] px-5 py-1 rounded-md text-[16px]">
                News
              </li>
              <li className="  font-semibold min-w-[80px] max-w-[100px] text-center bg-[#69686868] text-[#ddd] px-5 py-1 rounded-md text-[16px]">
                Unread
              </li>
            </ul>
          </div>
        </div>
        <div className="notifications-messages flex flex-col justify-start items-start  w-full md:w-[80%] flex-grow mt-5 overflow-auto">
          {friendRequests?.length > 0 ? (
            friendRequests.map((request) => (
              <NotificationCard
                key={request._id}
                request={request}
                handleGetFriendRequest={getFriendRequest}
              />
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
