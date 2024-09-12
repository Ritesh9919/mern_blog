import { Button, Textarea } from "flowbite-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

function CommentSection({ postId }) {
  const [comment, setComment] = useState("");
  const { currentUser } = useSelector((state) => state.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`/api/comments/create`, {
        content: comment,
        postId,
        userId: currentUser._id,
      });
      if (data.success) {
        setComment("");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className="max-w-3xl mx-auto p-3">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in user as:</p>
          <img
            className="h-5 w-5 object-cover rounded-full"
            src={currentUser.profilePicture}
            alt="profile image"
          />
          <Link
            className="text-xs text-cyan-600 hover:underline"
            to={"/dashboard?tab=profile"}
          >{`@${currentUser.username}`}</Link>
        </div>
      ) : (
        <div className="text-teal-500">
          You must be signed to comment.
          <Link className="text-blue-500 hover:underline" to={"/sign-in"}>
            Sign In
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="border border-teal-500 rounded-md p-3"
        >
          <Textarea
            placeholder="Add a comment..."
            rows={"3"}
            maxLength={200}
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500 text-xs">
              {200 - comment.length} character remaining
            </p>
            <Button type="submit" outline gradientDuoTone={"purpleToBlue"}>
              Submit
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

export default CommentSection;
