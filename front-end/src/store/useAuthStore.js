import { axiosInstance } from "@/lib/axios.js";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  isSigningUp: false,
  isLoggingIn: false,
  isLoggingOut: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  isResetCodeSend: false,
  isResetCodeVerified: false,

  // auth actions
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check-auth");
      set({ user: res?.data?.data?.user });
    } catch (error) {
      set({ user: null });
      toast.error(
        error?.response.data.message || "Something want worng - Login again"
      );
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signUp: async (username, email, password) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("auth/register", {
        username,
        email,
        password,
      });

      set({ user: res?.data?.data?.user });
      toast.success("Account has been created ");
      return res;
    } catch (error) {
      console.log(error);
      if (error?.response?.data?.message.startsWith("Email already exists")) {
        return toast.error("Email already exists");
      }
      toast.error(
        error?.response.data.message
          ? error.response.data.message
          : error?.message.startsWith("Network Erorr")
          ? "please check internet conection"
          : "somitheng went worng"
      );
    } finally {
      set({ isSigningUp: false });
    }
  },
  login: async (email, password) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("auth/login", {
        email,
        password,
      });

      set({ user: res?.data?.data?.user });
      toast.success("welcome back");
      return res;
    } catch (error) {
      set({ user: null });
      toast.error(
        error?.response.data.message
          ? error.response.data.message
          : error?.message.startsWith("Network Erorr")
          ? "please check internet conection"
          : "somitheng went worng"
      );
    } finally {
      set({ isLoggingIn: false });
      set({ user: null });
    }
  },
  logout: async () => {
    set({ isLoggingOut: true });
    try {
      await axiosInstance.post("auth/logout");
      toast.success("Logged out");
    } catch (error) {
      toast.error(
        error?.response.data.message
          ? error.response.data.message
          : error?.message.startsWith("Network Erorr")
          ? "please check internet conection"
          : "somitheng went worng"
      );
    } finally {
      set({ isLoggingOut: false });
      set({ user: null });
    }
  },
  sendVerificationCode: async (email) => {
    try {
      const res = await axiosInstance.post("auth/reset-code", { email });
      if (res.status === 200) {
        toast.success("code send via email");
        set({ isResetCodeSend: true });
      }
    } catch (error) {
      set({ isResetCodeSend: false });
      toast.error(
        error?.response.data.message
          ? error.response.data.message
          : error?.message.startsWith("Network Erorr")
          ? "please check internet conection"
          : "somitheng went worng"
      );
    }
  },
  verifiedResetCode: async (code) => {
    try {
      const res = await axiosInstance.post("auth/verified-code", {
        code,
      });
      if (res.status == 200) {
        set({ isResetCodeVerified: true });
        set({ isResetCodeSend: false });
        toast.success("code verified successfully");
        return res;
      }
    } catch (error) {
      set({ isResetCodeVerified: false });
      toast.error(
        error?.response.data.message
          ? error.response.data.message
          : error?.message.startsWith("Network Erorr")
          ? "please check internet conection"
          : "somitheng went worng"
      );
    }
  },
  resetPassword: async (userId, password) => {
    console.log(password, userId);

    try {
      const res = await axiosInstance.post("auth/reset-password", {
        userId,
        password,
      });
      if (res.status === 200) {
        toast.success("password reseted successfully");
        set({ isResetCodeSend: false, isResetCodeVerified: false });
        return res;
      }
    } catch (error) {
      toast.error(
        error?.response.data.message
          ? error.response.data.message
          : error?.message.startsWith("Network Erorr")
          ? "please check internet conection"
          : "somitheng went worng"
      );
    }
  },

  // user profile action
  updateUserPic: async (pic) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("user/update-profile", pic);
      set({ user: res?.data?.data?.user });
      toast.success("Profile picture updated");
    } catch (error) {
      toast.error(
        error?.response.data.message
          ? error.response.data.message
          : error?.message.startsWith("Network Erorr")
          ? "please check internet conection"
          : "somitheng went worng"
      );
      return error;
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  updateUsername: async (username) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("user/update-username", { username });
      set({ user: res?.data?.data?.user });
      toast.success("Username updated");
    } catch (error) {
      toast.error(
        error?.response.data.message
          ? error.response.data.message
          : error?.message.startsWith("Network Erorr")
          ? "please check internet conection"
          : "somitheng went worng"
      );
      return error;
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
