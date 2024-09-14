import { Button, Textarea, Modal } from "flowbite-react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Comment from "./Comment";
import { HiOutlineExclamationCircle } from "react-icons/hi";

function CommentSection({ postId }) {
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [showModel, setShowModel] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState(null);

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
        setComments([data, ...comments]);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await axios.get(
          `/api/comments/getPostComments/${postId}`
        );
        if (data.success) {
          setComments(data.data);
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    fetchComments();
  }, [postId]);

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

  const editComment = (comment, editedComment) => {
    setComments(
      comments.map((c) =>
        c._id === comment._id ? { ...c, content: editedComment } : c
      )
    );
  };

  const handleDeleteComment = async (commentId) => {
    setShowModel(false);
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const { data } = await axios.delete(
        `/api/comments/deleteComment/${commentId}`
      );
      if (data.success) {
        setComments(comments.filter((c) => c._id !== commentId));
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as:</p>
          <img
            className="h-5 w-5 object-cover rounded-full"
            src={currentUser.profilePicture}
            alt=""
          />
          <Link
            to={"/dashboard?tab=profile"}
            className="text-xs text-cyan-600 hover:underline"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-teal-500 my-5 flex gap-1">
          You must be signed in to comment.
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
            rows="3"
            maxLength="200"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500 text-xs">
              {200 - comment.length} characters remaining
            </p>
            <Button outline gradientDuoTone="purpleToBlue" type="submit">
              Submit
            </Button>
          </div>
        </form>
      )}
      {comments.length === 0 ? (
        <p className="text-sm my-5">No comments yet!</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
            <p>Comments</p>
            <div className="border border-gray-400 py-1 px-2 rounded-sm">
              <p>{comments.length}</p>
            </div>
          </div>
          {comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onLike={handleLike}
              onEdit={editComment}
              onDelete={(commentId) => {
                setShowModel(true);
                setCommentIdToDelete(commentId);
              }}
            />
          ))}
        </>
      )}
      <Modal
        show={showModel}
        onClose={() => setShowModel(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this comment?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => handleDeleteComment(commentIdToDelete)}
              >
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModel(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default CommentSection;
