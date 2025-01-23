import { useUserStore } from "@/store/useUserStore";
import { useAuthStore } from "@/store/useAuthStore";
import React, { useEffect, useState } from "react";
import FriendCard from "./FriendCard";

export default function Friends({ setIsToggled, windowWidth, reset }) {
  const { getFriends, friends, isGettingFriends, removeFriend } =
    useUserStore();
  const { onlineUsers } = useAuthStore();
  const [activeFriendId, setActiveFriendId] = useState(null);
  const [onlinefriends, setOnlineFriends] = useState([]);

  const toggleActions = (id) => {
    setActiveFriendId((prevId) => (prevId === id ? null : id));
  };
  useEffect(() => {
    getFriends();
  }, [getFriends]);
  useEffect(() => {
    setOnlineFriends(Array.from(onlineUsers));
  }, [onlineUsers.size, setOnlineFriends]);

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setActiveFriendId(null);
      }}
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
        <h3 className="text-white text-[24px] font-bold">Your Friends</h3>
      </div>
      <div className="Filteration w-full h-fit flex items-center justify-center mt-7">
        <input
          type="text"
          placeholder="Search of friends"
          className="w-[90%] md:w-[60%] px-2 py-2 placeholder:text-[#9f9f9f] text-[#ddd] bg-[#2f2f2f]  rounded-md"
        />
      </div>
      <div className="users-container mt-7  relative w-full flex-grow px-2   overflow-auto">
        {friends?.length > 6 && (
          <>
            <div className="shadow sticky top-[-5px] left-0 w-full h-8 bg-gradient-to-b  from-[#0d0d0d] to-transparent from-[30%]"></div>
            <div className="shadow fixed bottom-[-5px] left-0 w-full h-8 bg-gradient-to-b  to-[#0d0d0d] from-transparent to-[30%] "></div>
          </>
        )}
        <div className="users   md:flex-row flex flex-col md:flex-wrap md:gap-y-5  gap-y-4 md:justify-between h-auto ">
          {!isGettingFriends ? (
            friends?.length > 0 ? (
              friends.map((friend) => (
                <FriendCard
                  key={friend._id}
                  friend={friend}
                  toggleActions={toggleActions}
                  activeFriendId={activeFriendId}
                  removeFriend={removeFriend}
                  isOnline={onlinefriends?.includes(friend?._id)}
                />
              ))
            ) : (
              <div className="w-full h-fit  flex justify-center items-start mt-20">
                <h2 className="text-[20px] font-bold">No Friends Yet</h2>
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
