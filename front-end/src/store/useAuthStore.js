import { axiosInstance } from "@/lib/axios.js";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  isSigningUp: false,
  isLoggingIn: false,
  isLoggingOut: false,
  isUpdatingProfile: false,
  isCheckingAuth: false,
  isResetCodeSend: false,
  isResetCodeVerified: false,
  setIsCheckingAuth: (value) => set({ isCheckingAuth: value }),

  // auth actions
  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true });
      const res = await axiosInstance.get("/auth/check-auth");
      console.log(res);

      set({ user: res?.data?.data?.user });
    } catch (error) {
      set({ user: null });
      console.log(error);
      toast.error(
        error?.response?.data?.message || "Something went wrong - Login again"
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
      console.log(res);
      set({ user: res?.data?.data?.user });
      toast.success("Account has been created");
      return res;
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (email, password) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("auth/login", { email, password });
      console.log(res);
      set({ user: res?.data?.data?.user });
      toast.success("Welcome back");
      return res;
    } catch (error) {
      set({ user: null });
      console.log(error);

      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    set({ isLoggingOut: true });
    try {
      await axiosInstance.post("auth/logout");
      set({ user: null });
      toast.success("Logged out");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      set({ isLoggingOut: false });
    }
  },

  sendVerificationCode: async (email) => {
    try {
      const res = await axiosInstance.post("auth/reset-code", { email });
      if (res.status === 200) {
        toast.success("Code sent via email");
        set({ isResetCodeSend: true });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      set({ isResetCodeSend: false });
    }
  },

  verifiedResetCode: async (code) => {
    try {
      const res = await axiosInstance.post("auth/verified-code", { code });
      if (res.status === 200) {
        toast.success("Code verified successfully");
        set({ isResetCodeVerified: true, isResetCodeSend: false });
        return res;
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      set({ isResetCodeVerified: false });
    }
  },

  resetPassword: async (userId, password) => {
    try {
      const res = await axiosInstance.post("auth/reset-password", {
        userId,
        password,
      });
      if (res.status === 200) {
        toast.success("Password reset successfully");
        set({ isResetCodeSend: false, isResetCodeVerified: false });
        return res;
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  },

  // user profile actions
  updateUserPic: async (pic) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("user/update-profile", pic);
      set({ user: res?.data?.data?.user });
      toast.success("Profile picture updated");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
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
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
