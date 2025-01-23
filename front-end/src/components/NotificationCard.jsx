import { useUserStore } from "@/store/useUserStore";
import defaultAvatar from "../../public/default-avatar.png";
import Image from "next/image";
import React, { useCallback, useState } from "react";

export default function NotificationCard({ request }) {
  const { acceptFriendRequest, rejectFriendRequest } = useUserStore();
  const [isAcceptLoading, setIsAcceptLoading] = useState(false);
  const [isRejectLoading, setIsRejectLoading] = useState(false);
  const handleAcceptFriendRequest = useCallback(async (requestId) => {
    setIsAcceptLoading((prev) => ({ ...prev, [requestId]: true }));
    try {
      await acceptFriendRequest(requestId);
    } catch (error) {
      console.log(error);
    } finally {
      setIsAcceptLoading((prev) => ({ ...prev, [requestId]: false }));
    }
  });
  const handleRejectFriendRequest = useCallback(async (requestId) => {
    setIsRejectLoading((prev) => ({ ...prev, [requestId]: true }));
    try {
      await rejectFriendRequest(requestId);
    } catch (error) {
      console.log(error);
    } finally {
      setIsRejectLoading((prev) => ({ ...prev, [requestId]: false }));
    }
  });

  return (
    <div className="notification py-2 px-2 flex items-center gap-3 w-full bg-[#141414] border-[.2px] border-[#dddddd1a] p-2 rounded-lg">
      <div className="user-image">
        <Image
          src={request?.avatar || defaultAvatar}
          width={50}
          height={50}
          alt="user avatar"
          className="w-[50px] h-[50px] rounded-full"
        />
      </div>
      <div className="info flex-grow">
        <div className="userInfo flex flex-col">
          <div className="user-name text-[20px] font-bold flex items-center justify-start gap-1">
            {request?.username}
          </div>

          <div className="flex justify-between items-center">
            <div className="notification-message text-gray-300 text-[14px] font-medium  w-full">
              You have a new friend request
            </div>
          </div>
        </div>
      </div>
      <div className="btnsGroup flex items-center gap-2">
        <button
          onClick={() => handleAcceptFriendRequest(request?._id)}
          className="accept-btn font-medium  bg-gray-200 text-black rounded-md px-4 py-1"
        >
          Accept
        </button>
        <button
          onClick={() => handleRejectFriendRequest(request?._id)}
          className="decline-btn  font-medium bg-[#6565651b] text-white rounded-md px-4 py-1"
        >
          Decline
        </button>
      </div>
    </div>
  );
}
