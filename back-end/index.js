import express from "express";
import dotenv from "dotenv";
import authRoute from "./src/routes/auth.route.js";
import messageRoute from "./src/routes/message.route.js";
import { connectDB } from "./src/lib/db.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// global middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: (origin, callback) => {
      if (
        [
          "https://chat-app-api.vercel.app",
          "http://localhost:3001",
          "https://chat-app-api-lemon.vercel.app",
        ].includes(origin) ||
        !origin
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use("/api/auth", authRoute);
app.use("/api/message", messageRoute);

// start server
app.listen(port, () => {
  console.log(`connect on port ${port}`);
  connectDB();
});
