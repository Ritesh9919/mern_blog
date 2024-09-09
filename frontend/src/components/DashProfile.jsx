import React, { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateUserSuccess,
  deleteUserSuccess,
  signoutSuccess,
} from "../redux/user/userSlice";
import { Alert, Button, TextInput, Modal } from "flowbite-react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";
import axios from "axios";
import { toast } from "react-toastify";
import { HiOutlineExclamationCircle } from "react-icons/hi";
function DashProfile() {
  const fileRef = useRef();
  const dispatch = useDispatch();
  const [imageFile, setImageFile] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [formData, setFormData] = useState({});
  const [showModel, setShowModel] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleChnage = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const uploadImage = async (image) => {
    setImageError(null);
    setImageUploading(true);
    const storage = new getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      "state_change",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageError(true);
        setImageFileUploadProgress(null);
        setImageFile(null);
        setFormData({ ...formData, profilePicture: null });
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setFormData({ ...formData, profilePicture: downloadUrl });
          setImageUploading(false);
        });
      }
    );
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage(imageFile);
    }
  }, [imageFile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `/api/users/update/${currentUser._id}`,
        formData
      );
      if (response.data.success) {
        dispatch(updateUserSuccess(response.data.data));
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const handleDeleteUser = async () => {
    setShowModel(false);
    try {
      const response = await axios.delete(
        `/api/users/delete/${currentUser._id}`
      );
      if (response.data.success) {
        dispatch(deleteUserSuccess());
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignout = async () => {
    try {
      const response = await axios.post("/api/auth/signout");
      if (response.data.success) {
        dispatch(signoutSuccess());
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="text-center my-7 font-semibold text-3xl">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          ref={fileRef}
          accept="image/*"
          hidden
          onChange={handleImageChange}
        />
        <div
          className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full relative"
          onClick={() => fileRef.current.click()}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${
                    imageFileUploadProgress / 100
                  })`,
                },
              }}
            />
          )}
          <img
            src={formData.profilePicture || currentUser.profilePicture}
            alt="user"
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              "opacity-60"
            }`}
          />
        </div>
        {imageError && (
          <Alert color="failure">
            Could not upload image (file must be less than 2mb)
          </Alert>
        )}
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
          onChange={handleChnage}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="Email"
          defaultValue={currentUser.email}
          onChange={handleChnage}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="Password"
          onChange={handleChnage}
        />
        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          className="uppercase"
          disabled={imageUploading}
        >
          Update
        </Button>
      </form>
      <div className="text-red-500 mt-5 flex justify-between items-center cursor-pointer">
        <span onClick={() => setShowModel(true)}>Delete Account</span>
        <span onClick={handleSignout}>Sign Out</span>
      </div>
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
              Are you sure you want delete your account?
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

export default DashProfile;
