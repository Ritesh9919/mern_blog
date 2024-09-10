import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const createPost = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return next(new ApiError("You are not allow to create post", 403));
    }
    if (!req.body.title || !req.body.content) {
      return next(new ApiError("Please provide all required fields", 400));
    }
    const slug = req.body.title
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, "");
    const post = await Post.create({
      ...req.body,
      slug,
      userId: req.user.userId,
    });
    return res
      .status(201)
      .json(new ApiResponse(true, "Post created successfully", post));
  } catch (error) {
    next(error);
  }
};
