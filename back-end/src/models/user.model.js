import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "username is required"],
      unique: [true, "username is already in use"],
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
        friendshipDate: { type: Date, default: Date.now },
      },
    ],
    bio: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
