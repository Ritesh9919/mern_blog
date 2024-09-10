import express from "express";
const router = express.Router();

import verifyJwt from "../middlewares/auth.middleware.js";
import { createPost } from "../controllers/post.controller.js";
router.post("/create", verifyJwt, createPost);

export default router;
