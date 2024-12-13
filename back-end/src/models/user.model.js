import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "email is already exist"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minLength: [6, "password must be at least 6 characters"],
    },
    avatar: {
      type: String,
      default: "",
    },
    friends: [
      {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        username: { type: String },
        avatar: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
