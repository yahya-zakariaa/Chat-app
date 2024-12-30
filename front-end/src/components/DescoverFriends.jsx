import React, { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { useDebounce } from "@/hooks/useDebounce";
import UserCard from "./UserCard";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function DescoverFriends({ setIsToggled }) {
  const {
    descoverUsers,
    isDescoveringNewFriends,
    searchNewFriends,
    isGettingSearchResult,
  } = useUserStore();
  const [users, setUsers] = useState([]);
  const handleDescoverUsers = async () => {
    try {
      const res = await descoverUsers();
      setUsers(res?.data?.data.users);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = useDebounce(async (e) => {
    const query = e.target.value.trim();

    if (!query || /^[a-zA-Z0-9 ]$/.test(query)) {
      if (users.length < 1) {
        handleDescoverUsers();
      }
      return;
    }

    try {
      const res = await searchNewFriends(query);
      setUsers(res?.data?.data?.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, 500);
  useEffect(() => {
    handleDescoverUsers();
  }, []);
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="descover-friends md:w-full md:h-full md:rounded-none pb-4 rounded-lg md:relative absolute  md:translate-x-0 md:translate-y-0 translate-y-[-50%] md:left-0 md:top-0 top-[50%] left-[50%] translate-x-[-50%] w-[90%] h-[90%] lg:bg-transparent bg-[#0d0d0d] border-[.2px] md:border-none border-[#dddddd2d] pt-5 px-2 overflow-hidden flex flex-col"
    >
      <button
        onClick={() => setIsToggled(false)}
        className="absolute top-2 right-2 text-white lg:hidden"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <rect width="24" height="24" fill="none" />
          <path
            fill="#fff"
            fill-rule="evenodd"
            d="M6.793 6.793a1 1 0 0 1 1.414 0L12 10.586l3.793-3.793a1 1 0 1 1 1.414 1.414L13.414 12l3.793 3.793a1 1 0 0 1-1.414 1.414L12 13.414l-3.793 3.793a1 1 0 0 1-1.414-1.414L10.586 12L6.793 8.207a1 1 0 0 1 0-1.414"
            clip-rule="evenodd"
          />
        </svg>
      </button>
      <div className="header w-full mt-2 h-fit flex items-center justify-center">
        <h3 className="text-white text-[30px] font-bold">
          Descover new friends
        </h3>
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
        {users?.length > 6 && (
          <>
            <div className="shadow sticky top-[-5px] left-0 w-full h-8 bg-gradient-to-b  from-[#0d0d0d] to-transparent from-[30%]"></div>
            <div className="shadow fixed bottom-[-5px] left-0 w-full h-8 bg-gradient-to-b  to-[#0d0d0d] from-transparent to-[30%] "></div>
          </>
        )}
        <div className="users   md:flex-row flex flex-col md:flex-wrap md:gap-y-5  gap-y-4 md:justify-between h-auto ">
          {!isDescoveringNewFriends && !isGettingSearchResult ? (
            users?.length > 0 ? (
              users.map((user) => <UserCard key={user._id} user={user} />)
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
