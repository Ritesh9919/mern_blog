import { Button, Textarea } from "flowbite-react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Comment from "./Comment";

function CommentSection({ postId }) {
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await axios.get(`/api/comments/getComments/${postId}`);
        if (data.success) {
          setComments(data.data);
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    fetchComments();
  }, [postId]);

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
        setComments([data, ...comments]);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const { data } = await axios.put(
        `/api/comments/likeComment/${commentId}`
      );
      if (data.success) {
        setComments(
          comments.map((c) =>
            c._id == commentId
              ? {
                  ...c,
                  likes: data.data.likes,
                  numberOfLikes: data.data.likes.length,
                }
              : c
          )
        );
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
      {comments.length == 0 ? (
        <p className="text-sm my-5">No comments yet</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-start gap-1">
            <p>Comments</p>
            <div className="border border-gray-400 rounded-sm py-1 px-2">
              <p>{comments.length}</p>
            </div>
          </div>
          {comments.map((comment) => (
            <Comment key={comment._id} comment={comment} onLike={handleLike} />
          ))}
        </>
      )}
    </div>
  );
}

export default CommentSection;
