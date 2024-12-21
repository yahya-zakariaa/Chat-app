import express from "express";
import dotenv from "dotenv";
import authRoute from "./src/routes/auth.route.js";
import messageRoute from "./src/routes/message.route.js";
import userRoute from "./src/routes/user.route.js";
import { connectDB } from "./src/lib/db.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
dotenv.config();

const app = express();
const port = process.env.PORT || 3002;

// global middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000", // السماح لجميع النطاقات
    credentials: true, // للسماح بإرسال الكوكيز مع الطلبات
  })
);

app.use(helmet());
app.use("/api/auth", authRoute);
app.use("/api/message", messageRoute);
app.use("/api/user", userRoute);

// start server
app.listen(port, () => {
  console.log(`connect on port ${port}`);
  connectDB();
});
