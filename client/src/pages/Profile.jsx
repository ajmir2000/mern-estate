import { useSelector } from "react-redux";
import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} from "../redux/user/userSlice.js";
import { useDispatch } from "react-redux";
export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePercent, setFilePercent] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      uploadFileHandler(file);
    }
  }, [file]);

  // this function is for upload file to server and this is for store images in uploads folder Local
  const uploadFileHandler = async (file) => {
    const uploadFormData = new FormData();

    uploadFormData.append("image", file);

    try {
      setFileUploadError(false);

      setFilePercent(0);

      const res = await axios.post("/api/upload", uploadFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },

        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );

          setFilePercent(percent);
        },
      });

      // update image instantly
      setFormData((prev) => ({
        ...prev,
        avatar: `http://localhost:3000${res.data}`,
      }));

      setTimeout(() => {
        setFilePercent(0);
      }, 3000);
    } catch (error) {
      console.log(error);

      setFileUploadError(true);
    }
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateUserStart());

      const res = await axios.post(
        `/api/user/update/${currentUser._id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = res.data;

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));

        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(
        updateUserFailure(error.response?.data?.message || error.message),
      );
    }
  };
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await axios.delete(`/api/user/delete/${currentUser._id}`);
      const data = res.data;
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          id="image-file"
          label="Choose File"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser?.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
          onError={(e) => {
            e.target.src =
              "https://cdn-icons-png.flaticon.com/512/149/149071.png";
          }}
        />

        {/* show percentage */}
        <p className="text-center text-sm">
          {fileUploadError ? (
            <span className="text-red-600">
              Error Image Upload (image must be less than 2MB and only .jpg,
              .jpeg, and .png files are allowed)
            </span>
          ) : filePercent > 0 && filePercent < 100 ? (
            <span className="text-slate-700">
              Uploading...
              {filePercent}%
            </span>
          ) : filePercent === 100 ? (
            <span className="text-green-600">
              Upload completed successfully!
            </span>
          ) : null}
        </p>
        <input
          type="text"
          placeholder="username"
          id="username"
          className="border p-3 rounded-lg"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          className="border p-3 rounded-lg"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          {loading ? "Updating..." : "Update"}
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer hover:underline">
          Delete Account
        </span>
        <span className="text-red-700 cursor-pointer hover:underline">
          Sign out
        </span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : null}</p>
      <p className="text-green-700 mt-5">
        {updateSuccess ? "User is Updated Successfully" : null}
      </p>
    </div>
  );
}
