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

export const getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    });
    return res
      .status(200)
      .json(new ApiResponse(true, "Comments fetched successfully", comments));
  } catch (error) {
    next(error);
  }
};

export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next("Comment not found", 404);
    }
    let deleted;
    const userIndex = comment.likes.indexOf(req.user.userId);
    if (userIndex == -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.userId);
      deleted = false;
    } else {
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
      deleted = true;
    }
    await comment.save();
    return res
      .status(201)
      .json(new ApiResponse(true, deleted ? "DisLiked" : "Liked", comment));
  } catch (error) {
    next(error);
  }
};
