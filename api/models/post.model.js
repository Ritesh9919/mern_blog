import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default:
        "https://tse1.mm.bing.net/th?id=OIP.YGfq_GJBwNN6KeRny0yT3gHaHa&pid=Api&P=0&h=180",
    },
    category: {
      type: String,
      default: "uncatogorized",
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export const Post = mongoose.model("Post", postSchema);
