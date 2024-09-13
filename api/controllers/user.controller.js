import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

export const test = (req, res) => {
  return res.send("Hello World");
};

export const updateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (req.user.userId !== userId) {
      return next(new ApiError("You can only update your profile", 400));
    }
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          profilePicture: req.body.profilePicture,
        },
      },
      { new: true }
    ).select("-password");
    return res
      .status(200)
      .json(new ApiResponse(true, "User profile updated", user));
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!req.user.isAdmin && req.user.userId !== userId) {
      return next(new ApiError("You can only delete your account", 400));
    }
    await User.findByIdAndDelete(userId);
    return res.status(200).json(new ApiResponse(true, "user account deleted"));
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(ApiError("You are not allowed to see all users", 403));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit)
      .select("-password");

    const totalUsers = await User.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    return res.status(200).json(
      new ApiResponse(true, "User fetched successfully", {
        users,
        totalUsers,
        lastMonthUsers,
      })
    );
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");
    if (!user) {
      return next(new ApiError("User not found", 404));
    }
    return res
      .status(200)
      .json(new ApiResponse(true, "User fetched successfully", user));
  } catch (error) {
    next(error);
  }
};
