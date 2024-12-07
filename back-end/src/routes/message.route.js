import express from "express";
import protectedRoute from "../middleware/auth.middleware.js";
import {
  getMessages,
  getUserFrindes,
  sendMessage,
} from "../controllers/message.controller.js";
const router = express.Router();

router.get("/users", protectedRoute, getUserFrindes);
router.get("/messages/:id", protectedRoute, getMessages);
router.post("/send/:id", protectedRoute, sendMessage);
export default router;
