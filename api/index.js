import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./config/database.js";

const PORT = process.env.PORT || 3000;
const app = express();

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server is running on port:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });
