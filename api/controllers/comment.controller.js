import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const createComment = async (req, res, next) => {
  try {
    const { content, userId, postId } = req.body;
    if (!req.user.userId === userId) {
      return next(
        new ApiError("You are not allowed to create this comment", 403)
      );
    }
    const comment = await Comment.create({ content, userId, postId });
    return res
      .status(201)
      .json(new ApiResponse(true, "Comment created successfully", comment));
  } catch (error) {
    next(error);
  }
};
