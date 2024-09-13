import express from "express";
const router = express.Router();
import verifyJWT from "../middlewares/auth.middleware.js";
import {
  createComment,
  getPostComments,
  likeComment,
} from "../controllers/comment.controller.js";
router.post("/create", verifyJWT, createComment);
router.get("/getComments/:postId", getPostComments);
router.put("/likeComment/:commentId", verifyJWT, likeComment);

export default router;
