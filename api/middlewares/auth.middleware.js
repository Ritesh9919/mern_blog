import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

const verifyJWT = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return next(new ApiError("Unauthorized", 401));
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return next(new ApiError("Invalid token", 403));
      }
      req.user = user;
      next();
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export default verifyJWT;
