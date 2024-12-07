import express from "express";
import dotenv from "dotenv";
import authRoute from "./routes/auth.route.js";
import messageRoute from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config();

const app = express();
const port = process.env.PORT;

// global middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use("/api/auth", authRoute);
app.use("/api/message", messageRoute);

// start server
app.listen(port, () => {
  console.log(`connect on port ${port}`);
  connectDB();
});
