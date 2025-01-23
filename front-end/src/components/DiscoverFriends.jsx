import React, { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { useDebounce } from "@/hooks/useDebounce";
import UserCard from "./UserCard";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function DiscoverFriends({ setIsToggled, windowWidth, reset }) {
  const {
    descoverUsers,
    isDescoveringNewFriends,
    searchNewFriends,
    isGettingSearchResult,
    descoveredUsers,
  } = useUserStore();

  const handleSearch = useDebounce(async (e) => {
    const query = e.target.value.trim();

    if (!query || /^[a-zA-Z0-9 ]$/.test(query)) {
      if (descoveredUsers.length == 0 || query.length == 0) {
        return descoverUsers();
      }
      return;
    }

    try {
      await searchNewFriends(query);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, 500);
  useEffect(() => {
    descoverUsers();
  }, [descoverUsers,descoveredUsers?.length]);
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="descover-friends md:w-full md:h-full md:rounded-none pb-4 rounded-lg md:relative absolute  md:translate-x-0 md:translate-y-0 translate-y-[-50%] md:left-0 md:top-0 top-[50%] left-[50%] translate-x-[-50%] w-[90%] h-[90%] lg:bg-transparent bg-[#0d0d0d] border-[.2px] md:border-none border-[#dddddd2d] pt-4 px-2 overflow-hidden flex flex-col"
    >
      <div className="header w-full mt- h-fit flex items-center justify-start gap-2">
        <button
          onClick={() => (windowWidth >= 1024 ? reset() : setIsToggled(false))}
          className=" text-white lg:hidden"
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
        <h3 className="text-white text-[24px] font-bold">Discover Friends</h3>
      </div>
      <div className="Filteration w-full h-fit flex items-center justify-center mt-7">
        <input
          type="text"
          onKeyUp={handleSearch}
          placeholder="Search for friends"
          className="w-[90%] md:w-[60%] px-2 py-2 placeholder:text-[#9f9f9f] text-[#ddd] bg-[#2f2f2f]  rounded-md"
        />
      </div>
      <div className="users-container mt-7  relative w-full flex-grow px-2   overflow-auto">
        {descoveredUsers?.length > 4 && (
          <>
            <div className="shadow sticky z-[5]  top-[-5px] left-0 w-full h-5 bg-gradient-to-b  from-[#0d0d0d] to-transparent from-[50%]"></div>
            <div className="shadow fixed  z-[5] bottom-[-5px] left-0 w-full h-8 bg-gradient-to-b  to-[#0d0d0d] from-transparent to-[30%] "></div>
          </>
        )}
        <div className="users   md:flex-row flex flex-col md:flex-wrap md:gap-y-5  gap-y-4 md:justify-between h-auto ">
          {!isDescoveringNewFriends && !isGettingSearchResult ? (
            descoveredUsers?.length > 0 ? (
              descoveredUsers.map((user) => (
                <UserCard key={user._id} user={user} />
              ))
            ) : (
              <div className="w-full h-fit  flex justify-center items-start mt-20">
                <h2 className="text-[20px] font-bold">No users found</h2>
              </div>
            )
          ) : (
            <div className="w-full h-full flex justify-center items-start mt-20">
              <span className="descover-loader"></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
