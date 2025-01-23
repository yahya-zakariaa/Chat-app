import React, { useCallback, useState } from "react";
import defaultAvatar from "../../public/default-avatar.png";
import Image from "next/image";
import { useUserStore } from "@/store/useUserStore";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/useAuthStore";
export default function UserCard({ user }) {
  const { addFriend, cancelFriendRequest } = useUserStore();
  const { socket, user: currentUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isRequestPending, setIsRequestPending] = useState(user?.isPending);
  const handleAddFriend = useCallback(
    async (id) => {
      setIsLoading((prev) => ({ ...prev, [id]: true }));
      try {
        const res = await addFriend(id);
        socket.emit("send-friend-request", id, currentUser._id);
        toast.success("Request sended");
        setIsRequestPending(true);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading((prev) => ({ ...prev, [id]: false }));
      }
    },
    [addFriend]
  );
  const handleCancelRequest = useCallback(
    async (id) => {
      setIsLoading((prev) => ({ ...prev, [id]: true }));
      try {
        await cancelFriendRequest(id);
        toast.success("Request canceled");
        setIsRequestPending(false);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading((prev) => ({ ...prev, [id]: false }));
      }
    },
    [cancelFriendRequest]
  );

  return (
    <div className="user flex flex-col md:w-[49%] bg-[#232323c8] rounded-md p-2 h-fit">
      <div className="user-data  flex items-center justify-start gap-3">
        <div className="user-avatar min-w-[60px] min-h-[60px]">
          <Image
            src={user?.avatar || defaultAvatar}
            alt="default avatar"
            width={60}
            height={60}
            className="w-[60px] h-[60px] rounded-full"
          />
        </div>
        <div className="userInfo flex flex-col w-full">
          <div className="user-name text-[18px] font-bold flex items-center justify-start gap-1">
            <span className="text-gray-300 mt-[-3px] text-[12px]">@ </span>
            <span>{user?.username}</span>
          </div>
          <div className="flex justify-between items-center w-full">
            <div className="user-bio ps-1 text-gray-300 text-[14px] font-normal line-clamp-1 w-[65%]">
              {user?.bio || "No bio"}
            </div>
            <div className="multiple-friends flex">
              <Image
                src={defaultAvatar}
                alt="default avatar"
                width={20}
                height={20}
              />
              <Image
                src={defaultAvatar}
                alt="default avatar"
                className="ml-[-10px]"
                width={20}
                height={20}
              />
              <Image
                src={defaultAvatar}
                alt="default avatar"
                className="ml-[-10px]"
                width={20}
                height={20}
              />
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={() =>
          isRequestPending
            ? handleCancelRequest(user._id)
            : handleAddFriend(user._id)
        }
        disabled={isLoading[user._id]}
        className={`w-full ${
          isRequestPending || isLoading[user._id] ? "bg-[#d5d5d5]" : "bg-[#eee]"
        }  text-black py-1 rounded-md mt-2 flex justify-center items-center`}
      >
        {isLoading[user._id] ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
          >
            <rect width="24" height="24" fill="none" />
            <circle cx="18" cy="12" r="0" fill="#000">
              <animate
                attributeName="r"
                begin=".67"
                calcMode="spline"
                dur="1s"
                keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
                repeatCount="indefinite"
                values="0;2;0;0"
              />
            </circle>
            <circle cx="12" cy="12" r="0" fill="#000">
              <animate
                attributeName="r"
                begin=".33"
                calcMode="spline"
                dur="1s"
                keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
                repeatCount="indefinite"
                values="0;2;0;0"
              />
            </circle>
            <circle cx="6" cy="12" r="0" fill="#000">
              <animate
                attributeName="r"
                begin="0"
                calcMode="spline"
                dur="1s"
                keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
                repeatCount="indefinite"
                values="0;2;0;0"
              />
            </circle>
          </svg>
        ) : user.isFriend ? (
          "view profile"
        ) : user?.isReceivedRequest ? (
          "Accept request"
        ) : isRequestPending ? (
          "Cancel request"
        ) : (
          "+ Add friend"
        )}
      </button>
    </div>
  );
}
