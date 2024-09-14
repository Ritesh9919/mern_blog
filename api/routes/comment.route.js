import express from "express";
const router = express.Router();
import verifyJWT from "../middlewares/auth.middleware.js";
import {
  createComment,
  getPostComments,
  likeComment,
  editComment,
  deleteComment,
  getComments,
} from "../controllers/comment.controller.js";
router.post("/create", verifyJWT, createComment);
router.get("/getPostComments/:postId", getPostComments);
router.put("/likeComment/:commentId", verifyJWT, likeComment);
router.put("/editComment/:commentId", verifyJWT, editComment);
router.delete("/deleteComment/:commentId", verifyJWT, deleteComment);
router.get("/getComments", verifyJWT, getComments);

export default router;
