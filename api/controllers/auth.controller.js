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
