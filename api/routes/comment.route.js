import express from "express";
const router = express.Router();
import verifyJWT from "../middlewares/auth.middleware.js";
import {
  createComment,
  getPostComments,
} from "../controllers/comment.controller.js";
router.post("/create", verifyJWT, createComment);
router.get("/getComments/:postId", getPostComments);

export default router;
