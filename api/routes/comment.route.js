import express from "express";
const router = express.Router();
import verifyJWT from "../middlewares/auth.middleware.js";
import { createComment } from "../controllers/comment.controller.js";
router.post("/create", verifyJWT, createComment);

export default router;
