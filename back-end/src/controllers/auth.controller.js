import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateJWT } from "../utils/utils.js";
import cloudinary from "./../lib/cloudinary.js";
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    generateJWT(newUser._id, res);
    await newUser.save();
    res.status(201).json({
      status: "success",
      data: {
        user: {
          username: newUser.username,
          email: newUser.email,
          avatar: null,
          createdAt: newUser.createdAt,
        },
      },
      message: "Account has been created ",
    });
  } catch (error) {
    if (error.message.startsWith("E11000")) {
      res.status(400).json({
        status: "fail",
        message: "Email already exists",
      });
    }
    res.status(500).json({
      status: "error",
      message: "something want wrong, try again",
    });
  }
};

const login = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).json({
      status: "fail",
      message: "Please provide email and password",
    });
    return;
  }
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ status: "fail", message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ status: "fail", message: "Invalid email or password" });
    }
    const token = generateJWT(user._id, res);
    res.status(200).json({
      status: "success",
      token: token,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar || null,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      res.status(401).json({ status: "error", message: "Invalid token" });
    }

    if (error.name.contains("opration")) {
    }

    res.status(500).json({ status: "error", message: error.message });
  }
};

const logout = (req, res) => {
  res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ status: "success", message: "Logged out" });
};

const updateProfileAvatar = async (req, res) => {
  const { avatar } = req.body;
  const { _id } = req.user;

  if (!avatar) {
    res.status(400).json({
      status: "fail",
      message: "Please provide avatar picture",
    });
  }

  try {
    const uploadRes = await cloudinary.uploader.upload(avatar);
    if (!uploadRes) {
      res
        .status(500)
        .json({ status: "fail", message: "something want wrong, try again" });
    }
    const userUpdated = await User.findByIdAndUpdate(
      _id,
      { avatar: uploadRes.secure_url },
      { new: true }
    ).select("-password");
    if (!userUpdated) {
      return res
        .status(401)
        .json({ status: "fail", message: "User not found" });
    }
    res.status(200).json({
      status: "success",
      data: { user: userUpdated },
      message: "profile picutre updated successfully",
    });
  } catch (error) {}
};

const updateProfileName = async (req, res) => {
  const { username } = req.body;
  const { _id } = req.user;
  if (!username) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide username",
    });
  }

  try {
    const userUpdated = await User.findByIdAndUpdate(
      _id,
      { username },
      { new: true }
    ).select("-password");
    if (!userUpdated) {
      return res
        .status(401)
        .json({ status: "fail", message: "User not found" });
    }
    res.status(200).json({
      status: "success",
      data: { user: userUpdated },
      message: "profile name updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "something want wrong, try again",
    });
  }
};

const checkAuth = (req, res) => {
  res.status(200).json({ status: "success", data: { user: req.user } });
};

export {
  register,
  login,
  logout,
  updateProfileAvatar,
  checkAuth,
  updateProfileName,
};
