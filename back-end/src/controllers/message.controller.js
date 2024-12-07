import User from "../models/user.model.js";
import Message from "./../models/message.modal.js";

const getUserFrindes = async (req, res) => {
  const userId = req.user._id;
  try {
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select(
      "-password"
    );
    res.status(200).json({ status: "success", data: { users: filteredUsers } });
  } catch (error) {
    console.log("error in getUserFrindes", error);
    res.status(500).json({
      status: "error",
      message: error.message || "internal server error",
    });
  }
};

const getMessages = async (req, res) => {
  try {
    const { id: reseverId } = req.params;
    const senderId = req.user._id;
    const messages = await Message.find({
      $or: [
        { senderId, receviedId: reseverId },
        { senderId: reseverId, receviedId: senderId },
      ],
    });

    res.status(200).json({ status: "success", data: { messages } });
  } catch (error) {
    console.log("error in getMessages", error);
    res.status(500).json({
      status: "error",
      message: error.message || "internal server error",
    });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { id: reseverId } = req.params;
    const senderId = req.user._id;
    const { text, image } = req.body;
    let imageUrl;
    if (image) {
      const uploadRes = await cloudinary.uploader.upload(image);
      imageUrl = uploadRes.secure_url;
    }

    const message = await Message.create({
      senderId,
      receviedId: reseverId,
      text,
      image: imageUrl,
    });
    await message.save();
    // socket io code ===>
  } catch (error) {
    console.log("error in sendMessage", error);
    res.status(500).json({
      status: "error",
      message: error.message || "internal server error",
    });
  }
};
export { getUserFrindes, getMessages, sendMessage };
