import express from "express";
const router = express.Router();
import { test, updateUser } from "../controllers/user.controller.js";
import verifyJwt from "../middlewares/auth.middleware.js";
router.get("/test", test);
router.put("/update/:userId", verifyJwt, updateUser);

export default router;
