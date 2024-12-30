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
      return res;
    } catch (error) {
      console.log("error in descover new friends", error);
      return toast.error(
        error?.response?.data.message || error.message || "something went wrong"
      );
    } finally {
      set({ isDescoveringNewFriends: false });
    }
  },
  searchNewFriends: async (username) => {
    set({ isGettingSearchResult: true });
    try {
      const res = await axiosInstance.post("user/search-new-friends", {
        username,
      });
      return res;
    } catch (error) {
      console.log("error in descover new friends", error);
      return toast.error("something went wrong");
    } finally {
      set({ isGettingSearchResult: false });
    }
  },

  addFriend: async (friendId) => {
    try {
      const res = await axiosInstance.post("user/send-friend-request", {
        id: friendId,
      });

      toast.success("Request send");
    } catch (error) {
      console.log("error in descover new friends", error);
      return toast.error(error.response.data.message || "something went worng");
    }
  },

  cancelFriendRequest: async (userId) => {
    try {
      const res = await axiosInstance.delete(
        `user/cancel-friend-request/${userId}`
      );
    } catch (error) {
      console.log(error);
    }
  },
}));
