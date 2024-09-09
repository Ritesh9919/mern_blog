import express from "express";
const router = express.Router();
import {
  signup,
  signin,
  google,
  signout,
} from "../controllers/auth.controller.js";
import verifyJwt from "../middlewares/auth.middleware.js";
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);
router.post("/signout", verifyJwt, signout);

export default router;
