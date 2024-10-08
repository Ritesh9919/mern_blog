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

export const getPosts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    return res.status(200).json(
      new ApiResponse(true, "Posts feched successfully", {
        posts,
        totalPosts,
        lastMonthPosts,
      })
    );
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const { postId, userId } = req.params;

    if (!req.user.isAdmin || req.user.userId !== userId) {
      return next(new ApiError("You are not allowed to delete this post", 403));
    }

    await Post.findByIdAndDelete(postId);
    return res.status(200).json(new ApiResponse(true, "Post has been deleted"));
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const { userId, postId } = req.params;

    if (!req.user.isAdmin || req.user.userId !== userId) {
      return next(new ApiError("You are not allowed to update this post", 403));
    }
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          image: req.body.image,
          category: req.body.category,
        },
      },
      { new: true }
    );
    return res
      .status(200)
      .json(new ApiResponse(true, "Post update successfully", post));
  } catch (error) {
    next(error);
  }
};
