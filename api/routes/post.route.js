import express from "express";
const router = express.Router();

import verifyJwt from "../middlewares/auth.middleware.js";
import { createPost, getPosts } from "../controllers/post.controller.js";
router.post("/create", verifyJwt, createPost);
router.get("/getPosts", getPosts);

export default router;
