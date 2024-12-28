import { axiosInstance } from "@/lib/axios.js";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useUserStore = create((set) => ({
  friends: null,
  friendsRequest: null,
  friendSearchResult: null,
  descoverResult: null,
  friendsCount: 0,
  friendsRequestCount: 0,
  isGettingFriends: true,
  isGettingFriendRequest: true,
  isGettingSearchResult: false,
  isSendingFriendRequest: false,
  isAcceptFriendRequest: false,
  isRejectingFriendRequest: false,
  isRemoveingFriend: false,
  isDescoveringNewFriends: false,

  getFriends: async () => {
    try {
      set({ isGettingFriends: false });
      const res = await axiosInstance.get("user/get-friends");
      console.log(res);

      set({ friends: res.data.data.friends });
      set({ friendsCount: res.data.data.total });
    } catch (error) {
      console.log("error in get friends", error);
      return toast.error(
        error?.response?.data.message || error.message || "something went wrong"
      );
    } finally {
      set({ isGettingFriends: false });
    }
  },
  getFriendRequest: async () => {
    try {
      set({ isGettingFriendRequest: true });
      const res = await axiosInstance.get("user/get-friend-requests");
      set({ friendsRequest: res.data.data.requests });
      set({ friendsRequestCount: res.data.data.total });
    } catch (error) {
      console.log("error in get friend request", error);
      return toast.error(
        error?.response?.data.message || error.message || "something went wrong"
      );
    } finally {
      set({ isGettingFriendRequest: false });
    }
  },
  descoverUsers: async () => {
    try {
      set({ isDescoveringNewFriends: true });
      const res = await axiosInstance.get("user/discover-new-friends");
      set({ descoverResult: res?.data?.data?.result });
    } catch (error) {
      console.log("error in descover new friends", error);
      return toast.error(
        error?.response?.data.message || error.message || "something went wrong"
      );
    } finally {
      set({ isDescoveringNewFriends: false });
    }
  },
}));
