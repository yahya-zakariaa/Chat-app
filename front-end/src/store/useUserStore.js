import { axiosInstance } from "@/lib/axios.js";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useUserStore = create((set, get) => ({
  friends: [],
  friendRequests: [],
  descoveredUsers: [],
  friendsCount: 0,
  friendsRequestCount: 0,
  isGettingFriends: true,
  isGettingFriendRequest: true,
  isGettingSearchResult: false,
  isAcceptFriendRequest: false,
  isRejectingFriendRequest: false,
  isRemoveingFriend: false,
  isDescoveringNewFriends: false,
  setFriendRequests: (requests) =>
    set({
      friendRequests: requests,
    }),
  getFriends: async () => {
    try {
      set({ isGettingFriends: true });
      const res = await axiosInstance.get("user/get-friends");
      console.log(res);

      set({ friends: res?.data?.data?.friends });
      set({ friendsCount: res?.data?.data?.total });
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
      console.log(res);
      set({ friendRequests: res?.data?.data?.requests });
      set({ friendsRequestCount: res?.data?.data?.total });
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
      console.log(res);

      set({ descoveredUsers: res?.data?.data?.users });
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
      set({ descoveredUsers: res?.data?.data?.users });
    } catch (error) {
      console.log("error in descover new friends", error);
      return toast.error("something went wrong");
    } finally {
      set({ isGettingSearchResult: false });
    }
  },

  addFriend: async (friendId) => {
    try {
      await axiosInstance.post("user/send-friend-request", {
        id: friendId,
      });
    } catch (error) {
      console.log("error in descover new friends", error);
      return toast.error(error.response.data.message || "something went worng");
    }
  },

  cancelFriendRequest: async (userId) => {
    try {
      await axiosInstance.delete(`user/cancel-friend-request/${userId}`);
    } catch (error) {
      console.log(error);
    }
  },

  acceptFriendRequest: async (requestId) => {
    const { friendRequests } = get();
    set({
      friendRequests: friendRequests.filter(
        (request) => request._id !== requestId
      ),
    });
    try {
      await axiosInstance.post(`user/accept-friend-request/${requestId}`);
    } catch (error) {
      console.log(error);
    }
  },
  rejectFriendRequest: async (requestId) => {
    const { friendRequests } = get();
    set({
      friendRequests: friendRequests.filter(
        (request) => request._id !== requestId
      ),
    });
    try {
      await axiosInstance.post(`user/reject-friend-request/${requestId}`);
    } catch (error) {
      console.log(error);
    }
  },
  removeFriend: async (friendId) => {
    const { friends } = get();
    set({ friends: friends.filter((friend) => friend._id !== friendId) });
    try {
      await axiosInstance.delete(`user/remove-friend/${friendId}`);
      toast.success("Friend removed.");
    } catch (error) {
      console.log(error);
    }
  },
}));
