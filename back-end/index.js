import express from "express";
import dotenv from "dotenv";
import authRoute from "./src/routes/auth.route.js";
import messageRoute from "./src/routes/message.route.js";
import { connectDB } from "./src/lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// global middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }))
app.use(cors({
  origin: "https://bluechat-api.vercel.app" || "http://localhost:3001",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use("/api/auth", authRoute);
app.use("/api/message", messageRoute);

// start server
app.listen(port, () => {
  console.log(`connect on port ${port}`);
  connectDB();
});
