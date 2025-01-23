import { Server } from "socket.io";
import http from "http";
import express from "express";
import User from "./../models/user.model.js";
import { log } from "console";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://foul-brave-harmonica.glitch.me",
      "http://d2eb9b52af3e:3000",
      "http://127.0.0.1:3000",
      "http://172.17.0.120:3000",
    ],
    credentials: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "Origin"],
    path: "/socket.io",
  },
});

const friendsCache = new Map(); // Stores { userId: { friends: [], timestamp: number } }
const onlineUsers = new Map(); // Map<userId, socketId>

// Helper function to validate userId
const isValidUserId = (userId) => {
  return userId && typeof userId === "string" && userId !== "undefined";
};

// Helper function to get friends list with cache TTL
const getFriendsList = async (userId) => {
  if (!isValidUserId(userId)) {
    console.warn("[Warning] Invalid userId in getFriendsList:", userId);
    return [];
  }

  // Check cache first
  if (friendsCache.has(userId)) {
    const entry = friendsCache.get(userId);
    // Check if cache entry is valid (5 minutes)
    if (Date.now() - entry.timestamp < 300000) {
      return entry.friends;
    }
    friendsCache.delete(userId);
  }

<<<<<<< HEAD
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
      const newSocket = io("wss://foul-brave-harmonica.glitch.me", {
        query: { userId: user._id },
        reconnection: true,
        reconnectionAttempts: 3,
        reconnectionDelay: 5000,
        autoConnect: true,
        withCredentials: true,
<<<<<<< HEAD
=======
        transports: ["websocket", "polling", "flashsocket", "xhr-polling"],
>>>>>>> 27b85df7535d955ed0d1ad908016f31a62bc2d88
        path: "/socket.io",
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
=======
  try {
    const user = await User.findById(userId).populate({
      path: "friends._id",
      select: "-password -__v -email -createdAt -updatedAt",
>>>>>>> a63adac2fab375ccd5ec872787853f689614e4fc
    });

    const friendsList =
      user?.friends?.map((friend) => friend._id._id.toString()) || [];
    friendsCache.set(userId, { friends: friendsList, timestamp: Date.now() });
    return friendsList;
  } catch (error) {
    console.error(`[Error] Fetching friends list for userId ${userId}:`, error);
    return [];
  }
};

// Notify friends when a user's status changes
const notifyFriends = async (userId, status) => {
  if (!isValidUserId(userId)) return;

  try {
    const friendsList = await getFriendsList(userId);
    friendsList.forEach((friendId) => {
      const friendSocketId = onlineUsers.get(friendId);
      if (friendSocketId) {
        io.to(friendSocketId).emit("user-status-update", { userId, status });
      }
    });
  } catch (error) {
    console.error(`[Error] Notifying friends for userId ${userId}:`, error);
  }
};

// Handle user connection
const handleUserConnection = async (userId, socketId, status) => {
  if (!isValidUserId(userId) || !socketId) return;

  try {
    if (status === "online") {
      onlineUsers.set(userId, socketId);
      console.log(
        `[Connection] User ${userId} connected with socketId ${socketId}`
      );
    } else if (status === "offline") {
      onlineUsers.delete(userId);
      console.log(`[Disconnection] User ${userId} disconnected`);
      notifyFriends(userId, status);
      return;
    }

    if (status === "online") {
      const friendsList = await getFriendsList(userId);
      const onlineFriends = friendsList.filter((id) => onlineUsers.has(id));
      io.to(socketId).emit("get-online-users", onlineFriends);
      notifyFriends(userId, status);
    }
  } catch (error) {
    console.error(`[Error] Handling user connection for ${userId}:`, error);
  }
};

// Socket.IO connection handler
io.on("connection", async (socket) => {
  const { userId } = socket.handshake.query;

  if (!isValidUserId(userId)) {
    console.warn("[Warning] Connection rejected: Invalid userId.");
    socket.disconnect();
    return;
  }

  // Handle user connection
  handleUserConnection(userId, socket.id, "online");
  console.log(onlineUsers);

  socket.on("disconnect", async () => {
    handleUserConnection(userId, socket.id, "offline");
  });
});

// Graceful shutdown
process.on("SIGINT", () => {
  friendsCache.clear();
  onlineUsers.clear();
  server.close(() => {
    console.log("[Shutdown] Server closed gracefully.");
    process.exit(0);
  });
});

export { io, server, app };
