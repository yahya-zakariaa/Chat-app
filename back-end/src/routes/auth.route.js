import express from "express";
import {
  register,
  login,
  logout,
  checkAuth,
  updateProfileName,
} from "../controllers/auth.controller.js";
import protectedRoute from "../middleware/auth.middleware.js";
import { updateProfileAvatar } from "../controllers/auth.controller.js";

// provide router
const router = express.Router();

// routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-profile", protectedRoute, updateProfileAvatar);
router.put("/update-username", protectedRoute, updateProfileName);
router.get("/check-auth", protectedRoute, checkAuth);

export default router;
