import React from "react";
import defaultAvatar from "../../public/default-avatar.png";
import Image from "next/image";
export default function FriendCard({ friend, toggleActions, activeFriendId, removeFriend,isOnline }) {
  return (
    <div className="user flex relative md:w-[49%] bg-[#232323c8] rounded-md px-2 py-1.5 h-fit">
      <div className="user-data w-full  flex justify-between items-center  gap-3">
        <div className="user-details flex gap-2 items-center">
          <div className="user-avatar relative min-w-[60px] min-h-[60px]">
            <span className={`${isOnline?"bg-green-400":"bg-gray-500"} absolute w-[18px] rounded-full h-[18px] top-[5kpx] left-[-3px]`}></span>
            <Image
              src={friend?.avatar || defaultAvatar}
              alt="default avatar"
              width={60}
              height={60}
              className="w-[60px] h-[60px] rounded-full"
            />
          </div>
          <div className="username flex flex-col">
            <h3 className="text-[17px] font-medium">
              {friend?.name || "User Name"}
            </h3>
            <p className="text-sm text-[#ccc]">
              @ {friend?.username || "username"}
            </p>
          </div>
        </div>
        <div className="actions flex gap-1 justify-between items-center">
          <button className={`${activeFriendId === friend?._id && "hidden"} text-black bg-white px-4 py-1 font-medium rounded-md  flex justify-center items-center`}>
            Chat
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleActions(friend?._id);
            }}
            className=" py-1"
          >
            {activeFriendId === friend?._id ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <rect width="24" height="24" fill="none" />
                <path
                  fill="#fff"
                  d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275t.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <rect width="24" height="24" fill="none" />
                <path
                  fill="#fff"
                  d="M14 18a2 2 0 1 1-4 0a2 2 0 0 1 4 0m0-6a2 2 0 1 1-4 0a2 2 0 0 1 4 0m-2-4a2 2 0 1 0 0-4a2 2 0 0 0 0 4"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
      {activeFriendId === friend?._id ? (
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="user-actions absolute bg-[#0b0b0bcb] border border-[#4a4a4a37] backdrop-blur-2xl right-8 ps-2 pe-8 z-[3] pb-3 pt-1 rounded-md top-[30%]"
        >
          <ul className="flex flex-col gap-2">
            <li>
              <button onClick={() => removeFriend(friend?._id)} className="text-red-500 flex gap-1 items-center justify-between">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                >
                  <rect width="24" height="24" fill="none" />
                  <path
                    fill="#ef4444"
                    d="M7 21q-.825 0-1.412-.587T5 19V6q-.425 0-.712-.288T4 5t.288-.712T5 4h4q0-.425.288-.712T10 3h4q.425 0 .713.288T15 4h4q.425 0 .713.288T20 5t-.288.713T19 6v13q0 .825-.587 1.413T17 21zm3-4q.425 0 .713-.288T11 16V9q0-.425-.288-.712T10 8t-.712.288T9 9v7q0 .425.288.713T10 17m4 0q.425 0 .713-.288T15 16V9q0-.425-.288-.712T14 8t-.712.288T13 9v7q0 .425.288.713T14 17"
                  />
                </svg>
                Remove
              </button>
            </li>
            <li>
              <button className="text-red-500 flex gap-1 items-center justify-between">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                >
                  <rect width="24" height="24" fill="none" />
                  <path
                    fill="#ef4444"
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2M4 12c0-4.42 3.58-8 8-8c1.85 0 3.55.63 4.9 1.69L5.69 16.9A7.9 7.9 0 0 1 4 12m8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1A7.9 7.9 0 0 1 20 12c0 4.42-3.58 8-8 8"
                  />
                </svg>
                Block
              </button>
            </li>
            <li>
              <button className=" flex gap-1 items-center justify-between">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                >
                  <rect width="24" height="24" fill="none" />
                  <path
                    fill="#fff"
                    d="M12 17q.425 0 .713-.288T13 16t-.288-.712T12 15t-.712.288T11 16t.288.713T12 17m0-4q.425 0 .713-.288T13 12V8q0-.425-.288-.712T12 7t-.712.288T11 8v4q0 .425.288.713T12 13m-2.925 8q-.4 0-.762-.15t-.638-.425l-4.1-4.1q-.275-.275-.425-.638T3 14.926v-5.85q0-.4.15-.762t.425-.638l4.1-4.1q.275-.275.638-.425T9.075 3h5.85q.4 0 .763.15t.637.425l4.1 4.1q.275.275.425.638t.15.762v5.85q0 .4-.15.763t-.425.637l-4.1 4.1q-.275.275-.638.425t-.762.15z"
                  />
                </svg>
                Report
              </button>
            </li>
          </ul>
        </div>
      ) : null}
    </div>
  );
}
