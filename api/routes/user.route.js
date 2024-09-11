import express from "express";
const router = express.Router();
import {
  test,
  updateUser,
  deleteUser,
  getUsers,
} from "../controllers/user.controller.js";
import verifyJwt from "../middlewares/auth.middleware.js";
router.get("/test", test);
router.put("/update/:userId", verifyJwt, updateUser);
router.delete("/delete/:userId", verifyJwt, deleteUser);
router.get("/getUsers", verifyJwt, getUsers);

export default router;
