import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import defaultAvatar from "../../public/default-avatar.png";
import { useChatStore } from "@/store/useChatStore";
import { useAuthStore } from "@/store/useAuthStore";

export default function Chat({ selectedFriend, reset }) {
  const { onlineUsers } = useAuthStore();
  const { sendMessage } = useChatStore();
  const [message, setMessage] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const inputRef = useRef(null);
  const HandelSendMessage = async (friendId, text = "", image = "") => {
    console.log(friendId, text, image);
    await sendMessage(friendId, text, image);
    inputRef.current.value = "";
  };

  useEffect(() => {
    setOnlineFriends(onlineUsers);
  }, [onlineUsers?.length, setOnlineFriends]);

  return (
    <section className="chat-section w-full h-full overflow-hidden flex flex-col ">
      <div className="header gap-4 w-full flex items-center justify-start rounded-b-xl  bg-[#1c1c1c] px-3 py-2.5">
        <button onClick={() => reset()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="35"
            height="35"
            viewBox="0 0 24 24"
          >
            <rect width="24" height="24" fill="none" />
            <path
              fill="none"
              stroke="#fff"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M20 12H4m0 0l6-6m-6 6l6 6"
            />
          </svg>
        </button>
        <div className="userData flex items-center gap-4">
          <Image
            src={selectedFriend?.avatar || defaultAvatar}
            width={50}
            height={50}
            alt="friend avatar"
            className="w-[50px] h-[50px] min-w-[50px] min-h-[50px] rounded-full"
          />
          <div className="flex flex-col justify-start items-start translate-y-[-2%]">
            <h4 className="text-white text-[20px] font-bold">
              {selectedFriend?.username}
            </h4>
            <span className="userStatus text-[#ddd] text-[14px]">
              {onlineFriends?.length > 0 &&
              onlineFriends?.includes(selectedFriend?._id)
                ? "Online"
                : "Offline"}
            </span>
          </div>
        </div>
      </div>
      <div className="messagesContaie flex-grow">{selectedFriend?._id}</div>
      <div className="inputContainer  w-[100%] py-2.5 rounded-t-xl  bg-[#1c1c1c] px-5 ">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            HandelSendMessage(
              selectedFriend._id,
              e.target[1].value || "",
              e.target[0].files[0] || ""
            );
          }}
          className="flex items-center justify-between gap-3"
        >
          <div className="imageInput relative flex items-center justify-center   ">
            <input
              type="file"
              accept="image/*"
              className="w-[35px] h-[35px] opacity-0 relative z-[22] "
            />
            <div className="custom-btn absolute  top-[50%] translate-y-[-55%] left-[50%] translate-x-[-50%] z-[1]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="35"
                height="35"
                viewBox="0 0 24 24"
              >
                <rect width="24" height="24" fill="none" />
                <path
                  fill="#fff"
                  d="M5 3h13a3 3 0 0 1 3 3v13a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3m0 1a2 2 0 0 0-2 2v11.59l4.29-4.3l2.5 2.5l5-5L20 16V6a2 2 0 0 0-2-2zm4.79 13.21l-2.5-2.5L3 19a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-1.59l-5.21-5.2zM7.5 6A2.5 2.5 0 0 1 10 8.5A2.5 2.5 0 0 1 7.5 11A2.5 2.5 0 0 1 5 8.5A2.5 2.5 0 0 1 7.5 6m0 1A1.5 1.5 0 0 0 6 8.5A1.5 1.5 0 0 0 7.5 10A1.5 1.5 0 0 0 9 8.5A1.5 1.5 0 0 0 7.5 7"
                />
              </svg>
            </div>
          </div>
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a message"
            className="placeholder:text-[#9f9f9f] flex-grow placeholder:text-[16px] text-[#ddd] text-[16px] bg-[#414141] rounded-full py-2.5 ps-3"
          />

          <button type="submit" className="translate-y-[2%] pe-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 512 512"
            >
              <rect width="512" height="512" fill="none" />
              <path
                fill="#fff"
                d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480v-83.6c0-4 1.5-7.8 4.2-10.8l167.6-182.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8l-88.3-44.2C7.1 311.3.3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4"
              />
            </svg>
          </button>
        </form>
      </div>
    </section>
  );
}
