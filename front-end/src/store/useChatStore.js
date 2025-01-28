import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

export const useChatStore = create((set) => ({
  isGettingMessages: false,
  isSendingMessage: false,
  messages: [],
  chats: [],
  getMessages: async (friendId) => {
    set({ isGettingMessages: true });
    try {
      const res = await axiosInstance.get(`chats/get-messages/${friendId}`);
      console.log("massges", res);
      set({ messages: res?.data?.data?.messages });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isGettingMessages: false });
    }
  },
  getChats: async () => {
    try {
      const res = await axiosInstance.get("chats");
      console.log("chats", res);
      set({ messages: res?.data?.data?.chats });
    } catch (error) {
      console.log(error);
    }
  },
  sendMessage: async (friendId, text = "", image = "") => {
    set({ isSendingMessage: true });
    try {
      const res = await axiosInstance.post(`chats/send-message/${friendId}`, {
        text,
        image,
      });
      console.log(res);
    } catch (error) {
      console.log(error);
    } finally {
      set({ isSendingMessage: false });
    }
  },
}));
