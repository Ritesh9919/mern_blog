import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import connectDB from "./config/database.js";
import errorHandlerMiddleware from "./middlewares/errorHandler.middleware.js";
import notFoundMiddleware from "./middlewares/notFound.middleware.js";

import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import postRouter from "./routes/post.route.js";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server is running on port:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });
