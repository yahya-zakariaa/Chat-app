"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToggleComponents } from "@/store/useToggleComponents.js";
import { useAuthStore } from "@/store/useAuthStore.js";
import { useUserStore } from "@/store/useUserStore.js";
import DefaultRightSideContent from "@/components/DefaultRightSideContent";
import DescoverFriends from "@/components/DescoverFriends";
import Notifications from "@/components/Notifications";
import useWindowWidth from "@/hooks/useWindowWidth";
export default function Home() {
  const { getFriends, friends, descoverResult, getFriendRequest } =
    useUserStore();
  const { user, checkAuth } = useAuthStore();
  const { activeComponent, setActiveComponent } = useToggleComponents();
  const windowWidth = useWindowWidth();
  const router = useRouter();
  const components = {
    default: <DefaultRightSideContent />,
    descoverFriends: <DescoverFriends />,
    notifications: <Notifications />,
  };
  const [currentComponent, setCurrentComponent] = useState(
    components[activeComponent]
  );

  const handelGetFriends = async () => {
    try {
      await getFriends();
    } catch (error) {
      console.log(error);
    } finally {
      console.log(friends);
    }
  };

  const handleCheckAuth = async () => {
    try {
      await checkAuth();
    } catch (error) {
      router.push("/login");
    }
  };

  const handleGetFriendRequests = async () => {
    try {
      const res = await getFriendRequest();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleCheckAuth();
  }, [user?._id]);

  useEffect(() => {
    setCurrentComponent(components[activeComponent]);
  }, [activeComponent]);

  useEffect(() => {
    handelGetFriends();
  }, [friends?.length]);

  return (
    <>
      <div className="md:w-[94.5%] w-full flex relative h-[88%] md:h-full">
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
                  className="placeholder:text-[#9f9f9f] placeholder:text-[16px] text-[#ddd] text-[16px] bg-[#2f2f2f] rounded-full py-1 ps-3"
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
            <div className="chats  h-[100%] pb-2 pt-1   min-h-full  overflow-auto   gap-1 w-full flex flex-col items-center justify-start  px-1">
              <div className="chat    rounded-lg w-full min-h-[80px] h-[80px] flex relative  justify-start items-center   px-2">
                <div className="massage-count absolute left-[5px] bottom-[5px] border-[#dbdbdbd2]  bg-[#0f225c] w-[25px] h-[25px] rounded-full flex items-center justify-center text-[12px]">
                  5
                </div>
                <div className="massage-count absolute right-[10px] top-[13px] rounded-full flex items-center justify-center text-[14px] text-[#dbdbdbd2]">
                  2019/10/5
                </div>
                <div className="user-image min-w-[60px] mr-3 w-[60px] h-[60px] rounded-full bg-black"></div>
                <div className="user-data flex flex-col justify-start flex-grow max-w-[78%] mb-2">
                  <div className="user-name text-[18px] font-bold">
                    yahya zakaria
                  </div>
                  <div className="user-chat line-clamp-1 text-[#dbdbdbd2]">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Modi voluptatem at, praesentium velit tenetur mollitia
                    dolore quae placeat nam maiores.
                  </div>
                </div>
              </div>
            </div>
          </div>
          {windowWidth >= 1024 && (
            <div className="dynamic-side-in-desktop overflow-auto rounded-xl lg:w-[69.5%] lg:block hidden bg-[#0d0d0d] h-full   ">
              {currentComponent}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
