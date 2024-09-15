import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
    await User.create({ username, email, password });
    return res.status(201).json(new ApiResponse(true, "Signup successfully"));
  } catch (error) {
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
    const token = user.generateToken();
    return res
      .cookie("token", token, { httpOnly: true })
      .status(200)
      .json(new ApiResponse(true, "Signin successfully", user));
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email }).select(
      "-password"
    );
    if (user) {
      const token = await user.generateToken();

      res.cookie("token", token, { httpOnly: true }).status(200).json(user);
    } else {
      const generatePassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(generatePassword, 10);
      const newUser = await User.create({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-8),
        email: req.body.email,
        password: hashedPassword,
        profilePicture: req.body.photo,
      });
      const user = await User.findById(newUser._id).select("-password");
      const token = jwt.sign(
        { userId: newUser._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET
      );

      res.cookie("token", token, { httpOnly: true }).status(200).json(user);
    }
  } catch (error) {
    next(error);
  }
};

export const signout = async (req, res, next) => {
  try {
    await res
      .clearCookie("token")
      .status(200)
      .json(new ApiResponse(true, "Sign out successfully"));
  } catch (error) {
    next(error);
  }
};
