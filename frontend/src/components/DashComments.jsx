import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Table, Modal, Button } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

function DashComments() {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModel, setShowModel] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState(null);

  useEffect(() => {
    async function fetchComments() {
      try {
        const { data } = await axios.get(`/api/comments/getComments`);
        if (data.success) {
          if (data.data.comments.length < 9) {
            setShowMore(false);
          }
          setComments(data.data.comments);
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
    if (currentUser.isAdmin) {
      fetchComments();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    try {
      const startIndex = users.length;
      const { data } = await axios.get(
        `/api/comments/getComments?startIndex=${startIndex}`
      );
      if (data.success) {
        setComments((prev) => [...prev, ...data.data.comments]);
      }
      if (data.data.comments.length < 9) {
        setShowMore(false);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleDeleteComment = async () => {
    setShowModel(false);
    try {
      const { data } = await axios.delete(
        `/api/comments/deleteComment/${commentIdToDelete}`
      );
      if (data.success) {
        setComments((prev) => {
          return prev.filter((comment) => comment._id !== commentIdToDelete);
        });
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && comments.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Comment content</Table.HeadCell>
              <Table.HeadCell>Number of likes</Table.HeadCell>
              <Table.HeadCell>PostId</Table.HeadCell>
              <Table.HeadCell>UserId</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {comments.map((comment) => (
              <Table.Body className="divide-y" key={comment._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(comment.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>{comment.content}</Table.Cell>
                  <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                  <Table.Cell>{comment.postId}</Table.Cell>
                  <Table.Cell>{comment.userId}</Table.Cell>
                  <Table.Cell>
                    <span
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                      onClick={() => {
                        setShowModel(true);
                        setCommentIdToDelete(comment._id);
                      }}
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              className="w-full text-teal-500 self-center py-7 texr-sm"
              onClick={handleShowMore}
            >
              Show More
            </button>
          )}
        </>
      ) : (
        <p>You have no comments yet!</p>
      )}
      <Modal
        show={showModel}
        onClose={() => setShowModel(false)}
        popup
        size={"md"}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-4 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want delete this comment?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteComment}>
                Yes I'am sure
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

export default DashComments;
