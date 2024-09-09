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
    console.error("error in userController updateUser api", error.message);
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (req.user.userId !== userId) {
      return next(new ApiError("You can only delete your account", 400));
    }
    await User.findByIdAndDelete(userId);
    return res.status(200).json(new ApiResponse(true, "user account deleted"));
  } catch (error) {
    console.error("erron in userController deleteUser api", error.message);
    next(error);
  }
};
