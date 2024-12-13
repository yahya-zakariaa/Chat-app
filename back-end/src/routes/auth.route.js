import express from "express";
import {
  register,
  login,
  logout,
  checkAuth,
  updateProfileName,
  updateProfileAvatar,
  sendVerificationCode,
  verifyResetCode,
  resetPassword,
} from "../controllers/auth.controller.js";
import protectedRoute from "../middleware/auth.middleware.js";

// provide router
const router = express.Router();

// auth routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/check-auth", protectedRoute, checkAuth);

// password recovery routes
router.post("/reset-code", sendVerificationCode);
router.post("/verified-code", verifyResetCode);
router.post("/reset-password", resetPassword);

// user profile management routes
router.put("/update-profile", protectedRoute, updateProfileAvatar);
router.put("/update-username", protectedRoute, updateProfileName);

export default router;