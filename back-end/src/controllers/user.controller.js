import FriendRequest from "../models/friendRequest.modal.js";
import User from "../models/user.model.js";
import cloudinary from "./../lib/cloudinary.js";

const getUserFrindes = async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    return res.status(401).json({
      status: "fail",
      message: "something went wrong - Please Login again",
    });
  }
  try {
    const userFriends = await User.findById(userId)
    .populate("friends.id").exec()
    console.log(userFriends.friends);

    if (!userFriends) {
      return res.status(400).json({
        status: "fail",
        message: "something went wrong - Please try again",
      });
    }
    return res.status(200).json({
      status: "success",
      data: {
        friends: userFriends || [],
        total: userFriends.length || 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message || "something went wrong, please try again",
    });
  }
};
const getFriendRequests = async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    return res.status(401).json({
      status: "fail",
      message: "something went wrong - Please Login again",
    });
  }
  try {
    const friendRequests = await FriendRequest.find({
      receviedId: userId,
      status: "pending",
    }).sort({ createdAt: -1 });
    if (friendRequests.length < 1) {
      return res.status(200).json({
        status: "success",
        data: { friendRequests: [] },
        message: "No friend requests yet",
      });
    }
    return res.status(200).json({
      status: "success",
      data: {
        requests: friendRequests,
        total: friendRequests.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message || "something went wrong, please try again",
    });
  }
};
const sendFriendRequest = async (req, res) => {
  const { id } = req.body;
  const { _id } = req.user;

  if (!id) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide user id",
    });
  }
  if (_id === id) {
    return res.status(400).json({
      status: "fail",
      message: "You can't send friend request to yourself",
    });
  }
  if (!_id) {
    return res.status(401).json({
      status: "fail",
      message: "something went wrong - Please Login again",
    });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "User not found",
      });
    }
    const sender = await User.findById(_id);
    if (!sender) {
      return res.status(401).json({
        status: "fail",
        message: "something went wrong - Please Login again",
      });
    }
    if (sender.friends.includes(id)) {
      return res.status(400).json({
        status: "fail",
        message: "You are already friends with this user",
      });
    }
    const friendRequest = await FriendRequest.create({
      senderId: sender._id,
      receviedId: user._id,
      status: "pending",
    });
    if (!friendRequest) {
      return res.status(500).json({
        status: "fail",
        message: "Something went wrong - please try again",
      });
    }
    return res.status(200).json({
      status: "success",
      data: { friendRequest },
      message: "Friend request sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message || "something went wrong.",
    });
  }
};
const acceptFriendRequest = async (req, res) => {
  const { requestId } = req.body;
  const { _id } = req.user;

  if (!requestId) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide friend request id",
    });
  }
  if (!_id) {
    return res.status(401).json({
      status: "fail",
      message: "Unauthorized - Please Login first",
    });
  }

  try {
    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      return res.status(400).json({
        status: "fail",
        message: "Friend request not found or already accepted",
      });
    }

    const receiver = await User.findById(_id);
    if (!receiver) {
      return res.status(401).json({
        status: "fail",
        message: "User not found - Please Login again",
      });
    }

    const sender = await User.findById(friendRequest.senderId);
    if (!sender) {
      return res.status(400).json({
        status: "fail",
        message: "User not found",
      });
    }
    receiver.friends.push(friendRequest.senderId);
    sender.friends.push(_id);
    receiver.save();
    sender.save();
    friendRequest.status = "accepted";
    friendRequest.save();
    return res.status(200).json({
      status: "success",
      data: { friendRequest },
      message: "Friend request accepted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message || "something went wrong.",
    });
  }
};
const rejectFriendRequest = async (req, res) => {
  const { requestId } = req.body;

  if (!requestId) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide request id",
    });
  }
  try {
    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      return res.status(400).json({
        status: "fail",
        message: "request not found or already accepted",
      });
    }
    friendRequest.status = "rejected";
    friendRequest.save();
    return res.status(200).json({
      status: "success",
      message: "request rejected",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message || "something went wrong.",
    });
  }
};
const removeFriend = async (req, res) => {
  const { friendId } = req.body;
  const { _id } = req.user;
  if (!friendId) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide friend id",
    });
  }

  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "something went wrong - Please Login again",
      });
    }
    const friend = await User.findById(friendId);
    if (!friend) {
      return res.status(400).json({
        status: "fail",
        message: "User not found",
      });
    }
    if (!user.friends.includes(friendId)) {
      return res.status(400).json({
        status: "fail",
        message: "You are not friends with this user",
      });
    }
    if (friend.friends.includes(_id)) {
      friend.friends.pull(_id);
      friend.save();
      user.friends.pull(friendId);
      user.save();
      return res.status(200).json({
        status: "success",
        message: "Friend removed",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message || "something went wrong.",
    });
  }
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
      res.status(500).json({
        status: "fail",
        message: error.message || "something went wrong.",
      });
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
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message || "something went wrong.",
    });
  }
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
      message: error.message || "something went wrong.",
    });
  }
};
const searchNewFriends = async (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide username",
    });
  }
  try {
    const users = await User.find({
      username: { $regex: username, $options: "i" },
    }).select("-password", "-__v", "email", "friends");
    if (!users) {
      return res.status(204).json({ status: "success", message: " Not found" });
    }
    res.status(200).json({ status: "success", data: { users } });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message || "something went wrong.",
    });
  }
};

const discoverNewFriends = async (req, res) => {
  const { _id } = req.user;
  try {
    const users = await User.find({
      _id: { $ne: _id, $nin: req.user.friends },
    }).select(["-password", "-__v", "-email", "-friends"]);
    if (!users) {
      return res.status(204).json({ status: "success", message: " Not found" });
    }
    res.status(200).json({
      status: "success",
      data: { result: users },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message || "something went wrong.",
    });
  }
};
export {
  getUserFrindes,
  getFriendRequests,
  sendFriendRequest,
  acceptFriendRequest,
  updateProfileAvatar,
  updateProfileName,
  rejectFriendRequest,
  removeFriend,
  searchNewFriends,
  discoverNewFriends,
};
