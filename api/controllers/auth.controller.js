import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!email || !username || !password) {
      return next(new ApiError("All fields are required", 400));
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ApiError("user already signup", 400));
    }
    const user = await User.create({ username, email, password });
    return res.status(201).json(new ApiResponse(true, "Signup successfully"));
  } catch (error) {
    console.error("error in authController signup api", error.message);
    next(error);
  }
};

export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ApiError("Both fields are required", 400));
    }
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return next(new ApiError("user does not exist", 404));
    }
    const isPasswordCurrect = await existingUser.comparePassword(password);
    if (!isPasswordCurrect) {
      return next(new ApiError("Invalid Credentials", 401));
    }
    const user = await User.findById(existingUser._id).select("-password");
    const expiryDate = new Date(Date.now() + 3600000);
    const token = user.generateToken();
    return res
      .cookie("token", token, { httpOnly: true, expires: expiryDate })
      .status(200)
      .json(new ApiResponse(true, "Signin successfully", user));
  } catch (error) {
    console.error("error in authController signin api", error.message);
    next(error);
  }
};
