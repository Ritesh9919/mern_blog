import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./config/database.js";
import errorHandlerMiddleware from "./middlewares/errorHandler.middleware.js";
import notFoundMiddleware from "./middlewares/notFound.middleware.js";

import userRouter from "./routes/user.route.js";

const PORT = process.env.PORT || 3000;
const app = express();

app.use("/api/users", userRouter);
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
