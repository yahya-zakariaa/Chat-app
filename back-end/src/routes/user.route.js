import express from "express";
import protectedRoute from "../middleware/auth.middleware.js";
import {
  updateProfileAvatar,
  updateProfileName,
  getUserFrindes,
  getFriendRequests,
  searchNewFriends,
  discoverNewFriends,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
} from "../controllers/user.controller.js";
const router = express.Router();

// user friendship
router.get("/discover-new-friends", protectedRoute, discoverNewFriends);
router.get("/search-new-friends", protectedRoute, searchNewFriends);
router.post("/send-friend-request", protectedRoute, sendFriendRequest);
router.post("/accept-friend-request", protectedRoute, acceptFriendRequest);
router.get("/get-friend-requests", protectedRoute, getFriendRequests);
router.get("/get-friends", protectedRoute, getUserFrindes);
router.post("/reject-friend-request", protectedRoute, rejectFriendRequest);
router.post("/remove-friend", protectedRoute, removeFriend);

// user profile
router.put("/update-profile", protectedRoute, updateProfileAvatar);
router.put("/update-username", protectedRoute, updateProfileName);

export default router;
