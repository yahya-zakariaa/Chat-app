import { axiosInstance } from "@/lib/axios.js";
import showToast from "@/hooks/useShowToast.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { create } from "zustand";

export const useAuthStore = create((set, get) => ({
  user: null,
  socket: null,
  onlineUsers: new Set(),
  isLoggedIn: false,
  isSigningUp: false,
  isLoggingIn: false,
  isLoggingOut: false,
  isUpdatingProfile: false,
  isResettingPassword: false,
  isResetCodeSend: false,
  isResetCodeVerified: false,
  setOnlineFriends: (users) =>
    set({
      onlineUsers: new Set(Array.isArray(users) ? users : []),
    }),
  setIsCheckingAuth: (value) => set({ isCheckingAuth: value }),

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/auth/check-auth");
      set({ user: res?.data?.data?.user, isLoggedIn: true });
    } catch (error) {
      get().handleAuthError(error);
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
      showToast("Account has been created");
      return res;
    } catch (error) {
      console.log(error);
      showToast(error, "error");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (email, password) => {
    if (get().isLoggingIn || get().isLoggedIn) return;

    set({ isLoggingIn: true });
    showToast("please wait..", "loading");

    try {
      const res = await axiosInstance.post("auth/login", { email, password });
      set({ user: res.data?.data?.user, isLoggedIn: true });
      get().initSocketConnection();
      showToast("Welcome back");
    } catch (error) {
      get().handleAuthError(error);
    } finally {
      set({ isLoggingIn: false });
      toast.dismiss();
    }
  },

  logout: async () => {
    set({ isLoggingOut: true });
    try {
      await axiosInstance.post("auth/logout");
      get().cleanupSocket();
      showToast("Logged out");
    } catch (error) {
      showToast(error, "error");
    } finally {
      set({
        isLoggingOut: false,
        user: null,
        isLoggedIn: false,
        onlineUsers: new Set(),
      });
    }
  },
  initSocketConnection: () => {
    const { user, socket } = get();
    if (!user?._id) return;
    if (!socket || socket.disconnected || !socket.connected) {
      const newSocket = io("https://foul-brave-harmonica.glitch.me", {
        query: { userId: user._id },
        reconnection: true,
        reconnectionAttempts: 3,
        reconnectionDelay: 5000,
        autoConnect: true,
        withCredentials: true,
        transports: ["websocket", "polling"],
        secure: true,
      });

      set({ socket: newSocket });
      get().setupSocketListeners(newSocket);
    } else if (socket.disconnected) {
      socket.connect();
    }
  },
  setupSocketListeners: (socket) => {
    if (!socket?.connected || !socket) return;
    socket.on("connect", () => {
      socket.emit("user-online");
    });

    socket.on("disconnect", (reason) => {
      console.log("Disconnected from server:", reason);
      get().cleanupSocket();
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      toast.error("Failed to connect to the server.");
    });

    socket.on("get-online-users", ({ users }) => {
      console.log("online friends:", users);
      if (users?.length === 0 || !users || users === "undefined") return;
      if (get().onlineUsers.size > 0) return;
      set({ onlineUsers: new Set(users) });
    });

    socket.on("user-status-update", (user) => {
      console.log("friend", user.userId, "is", user.status);
      if (user.status === "online") {
        if (get().onlineUsers.has(user.userId)) return;
        get().setOnlineFriends([...Array.from(get().onlineUsers), user.userId]);
      } else if (user.status === "offline") {
        get().setOnlineFriends(
          Array.from(get().onlineUsers).filter((id) => id !== user.userId)
        );
      }
    });
  },

  cleanupSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.off();
      socket.disconnect();
      set({ socket: null });
    }
  },

  handleAuthError: (error) => {
    console.log(error);
    const message = error.response?.data?.message || "Something went wrong";
    set({ user: null, isLoggedIn: false });
    get().cleanupSocket();
    showToast(message, "error");
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
