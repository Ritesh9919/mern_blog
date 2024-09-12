import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Table, Modal, Button } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";

function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModel, setShowModel] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const { data } = await axios.get(`/api/users/getUsers`);
        if (data.success) {
          if (data.data.users.length < 9) {
            setShowMore(false);
          }
          setUsers(data.data.users);
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    try {
      const startIndex = users.length;
      const { data } = await axios.get(
        `/api/users/getUsers?startIndex=${startIndex}`
      );
      if (data.success) {
        setUsers((prev) => [...prev, ...data.data.users]);
      }
      if (data.data.users.length < 9) {
        setShowMore(false);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  //   const handleDeletePost = async () => {
  //     setShowModel(false);
  //     try {
  //       const { data } = await axios.delete(
  //         `/api/posts/delete/${postIdToDelete}/${currentUser._id}`
  //       );
  //       console.log(data);
  //       if (data.success) {
  //         setUserPosts((prev) => {
  //           return prev.filter((post) => post._id !== postIdToDelete);
  //         });
  //         toast.success(data.message);
  //       }
  //     } catch (error) {
  //       toast.error(error.response.data.message);
  //     }
  //   };

  const handleDeleteUser = async () => {};

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date created</Table.HeadCell>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {users.map((user) => (
              <Table.Body className="divide-y" key={user._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className="w-10 h-10 object-cover bg-gray-500 rounded-full"
                    />
                  </Table.Cell>
                  <Table.Cell>{user.username}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>
                    {user.isAdmin ? (
                      <FaCheck className="text-green-500" />
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                      onClick={() => {
                        setShowModel(true);
                        setUserIdToDelete(user._id);
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
        <p>You have no users yet!</p>
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
              Are you sure you want delete this user?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
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

export default DashUsers;
