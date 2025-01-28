"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useToggleComponents } from "@/store/useToggleComponents.js";
import DefaultRightSideContent from "@/components/DefaultRightSideContent";
import useWindowWidth from "@/hooks/useWindowWidth";
import dynamic from "next/dynamic";
import { useChatStore } from "@/store/useChatStore";
import { useUserStore } from "@/store/useUserStore";
import Image from "next/image";
import defaultAvatar from "../../public/default-avatar.png";
import { useAuthStore } from "@/store/useAuthStore";
import { usePathname } from "next/navigation";

const Chat = dynamic(() => import("@/components/Chat"));
const DiscoverFriends = dynamic(() => import("@/components/DiscoverFriends"));
const Notifications = dynamic(() => import("@/components/Notifications"));
const UserProfile = dynamic(() => import("@/components/UserProfile"));
const Friends = dynamic(() => import("@/components/Friends"));
export default function Home() {
  const windowWidth = useWindowWidth();
  const pathname = usePathname();
  const { activeComponent, reset, setActiveComponent } = useToggleComponents();
  const {
    user,
    isCheckingAuth,
    checkAuth,
    initSocketConnection,
    cleanupSocket,
    socket,
    isLoggingOut
  } = useAuthStore();
  const { getChats, chats } = useChatStore();
  const { getFriends, friends } = useUserStore();
  const unProtectedRoute = ["/forgot-password", "/signup", "/login"];
  const [selectedFriend, setSelectedFriend] = useState(null);

  const components = useMemo(
    () => ({
      default: <DefaultRightSideContent />,
      chat: <Chat selectedFriend={selectedFriend} reset={reset} />,
      discoverFriends: (
        <DiscoverFriends reset={reset} windowWidth={windowWidth} />
      ),
      notifications: <Notifications reset={reset} windowWidth={windowWidth} />,
      userProfile: <UserProfile reset={reset} windowWidth={windowWidth} />,
      friends: <Friends reset={reset} windowWidth={windowWidth} />,
    }),
    [reset, selectedFriend, windowWidth]
  );

  const currentComponent = useMemo(
    () => components[activeComponent] || null,
    [activeComponent, components]
  );

  const handleFriendSelect = useCallback(
    (friend) => {
      setSelectedFriend(friend);
      setActiveComponent("chat");
    },
    [setActiveComponent]
  );

  useEffect(() => {
    getChats();
    getFriends();
  }, [friends?.length, chats?.length, getFriends, getChats, user?._id]);

  useEffect(() => {
    if (!isCheckingAuth && !user?._id && !isLoggingOut) {
      checkAuth();
    }
  }, [checkAuth, user?._id]);

  useEffect(() => {
    const handleSocketConnection = async () => {
      if (
        user?._id &&
        !socket?.connected &&
        !unProtectedRoute.includes(pathname)
      ) {
        await initSocketConnection();
      }
    };

    handleSocketConnection();
    return () => {
      if (socket?.connected) cleanupSocket();
    };
  }, [user?._id, pathname]);
  return (
    <>
      <section className="md:w-[94.5%] w-full flex relative  flex-grow md:h-full">
        <div className="main-page-layout   w-[100%] flex justify-between items-start md:items-center  h-full  ">
          <div className="chats-section  lg:w-[30%] relative w-full h-full rounded-xl overflow-hidden  bg-[#0d0d0d] flex flex-col ">
            <div className="chat-header h-[12%] sticky top-0 left-0 z-[20]   py-3 bg-[#0d0d0d] w-full  flex justify-between items-center md:px-2 px-3 ">
              <div className="title mb-0.5 text-[24px] text-white   font-bold">
                Chats
              </div>
              <div className="chats-filters flex items-center justify-between gap-3">
                <input
                  type="text"
                  placeholder="Search with name"
                  className="placeholder:text-[#9f9f9f] min-w-[150px] max-w-[160px] placeholder:text-[16px] text-[#ddd] text-[16px] bg-[#2f2f2f] rounded-full py-1 ps-3"
                />
                <button className="search w-fit cursor-pointer   ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                  >
                    <rect width="28" height="28" fill="none" />
                    <path
                      fill="none"
                      stroke="#fff"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.5 7h15M7 12h10m-7 5h4"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="chats   h-[100%] pb-2 pt-1   min-h-full  overflow-auto   gap-1 w-full flex flex-col items-center justify-start  px-1">
              {chats?.length > 0 && chats
                ? chats?.map((chat) => (
                    <div
                      key={chat?._id}
                      className="chat    rounded-lg w-full min-h-[80px] h-[80px] flex relative  justify-start items-center   px-2"
                    >
                      <div className="massage-count absolute left-[5px] bottom-[5px] border-[#dbdbdbd2]  bg-[#0f225c] w-[25px] h-[25px] rounded-full flex items-center justify-center text-[12px]">
                        5
                      </div>
                      <div className="chat-date absolute right-[10px] top-[13px] rounded-full flex items-center justify-center text-[14px] text-[#dbdbdbd2]">
                        2019/10/5
                      </div>
                      <div className="user-image min-w-[60px] mr-3 w-[60px] h-[60px] rounded-full bg-black"></div>
                      <div className="user-data flex flex-col justify-start flex-grow max-w-[78%] mb-2">
                        <div className="user-name text-[18px] font-bold">
                          yahya zakaria
                        </div>
                        <div className="user-chat line-clamp-1 text-[#dbdbdbd2]">
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit. Modi voluptatem at, praesentium velit tenetur
                          mollitia dolore quae placeat nam maiores.
                        </div>
                      </div>
                    </div>
                  ))
                : friends?.length > 0 && friends
                ? friends?.map((friend) => (
                    <div
                      key={friend?._id}
                      onClick={() => handleFriendSelect(friend)}
                      className="friend cursor-pointer rounded-lg w-full min-h-[80px] h-[80px] flex relative  justify-start items-center   px-2"
                    >
                      <Image
                        src={friend?.avatar || defaultAvatar}
                        alt="avatar"
                        width={60}
                        height={60}
                        className="user-image min-w-[60px] mr-3 w-[60px] h-[60px] rounded-full "
                      />
                      <div className="user-data flex flex-col justify-start flex-grow max-w-[78%] mb-2">
                        <div className="user-name text-[18px] font-bold">
                          {friend?.name || friend?.username}
                        </div>
                        <div className="user-chat line-clamp-1 text-[#dbdbdbd2]">
                          Click to chat with {friend?.name || friend?.username}
                        </div>
                      </div>
                    </div>
                  ))
                : "no friends"}
            </div>
          </div>
          {windowWidth >= 1024 && (
            <div className="dynamic-side-in-desktop overflow-auto rounded-xl lg:w-[69.5%] lg:block hidden bg-[#0d0d0d] h-full   ">
              {currentComponent}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
