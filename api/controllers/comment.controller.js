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

export const editComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(new ApiError("Comment not found", 404));
    }
    if (!req.user.isAdmin && comment.userId !== req.params.commentId) {
      return next(
        new ApiError("You are not allowed to edit this comment", 403)
      );
    }
    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      { $set: { content: req.body.content } },
      { new: true }
    );

    return res
      .status(200)
      .json(
        new ApiResponse(true, "Comment updated successfully", editedComment)
      );
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return next(new ApiError("Comment not found", 404));
    }
    if (!req.user.isAdmin && comment.userId !== commentId) {
      return next(
        new ApiError("You are not allowed to delete this comment", 403)
      );
    }
    await Comment.findByIdAndDelete(commentId);
    return res
      .status(200)
      .json(new ApiResponse(true, "Comment deleted successfully"));
  } catch (error) {
    next(error);
  }
};

export const getComments = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return next("You are not allow to get all comments", 403);
    }
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "desc" ? -1 : 1;
    const comments = await Comment.find({})
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: sortDirection });

    const totalComments = await Comment.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthComments = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    return res.status(200).json(
      new ApiResponse(true, "Comments fetched successfully", {
        comments,
        totalComments,
        lastMonthComments,
      })
    );
  } catch (error) {
    console.error(error);
    next(error);
  }
};
