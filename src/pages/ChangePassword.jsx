import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import apis from "../config/apis";
import { errorToast, successToast, warningToast } from "../functions/toastify";
import MetaData from "../layouts/MetaData";
import Loader from "../layouts/Loader";


 const ChangePassword=()=> {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(`${apis.auth}/change-password`, {
        token,
        password: newPassword,
        confirmPassword: confirmNewPassword,
      });

      if (data.warning) warningToast(data.warning);
      else if (data.error) errorToast(data.error);
      else if (data.message) {
        successToast(data.message);
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      console.error(err.message);
      errorToast("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <>
      <MetaData title="Change Password" />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans">
        <div className="bg-white p-10 rounded-lg shadow-xl w-full max-w-md text-center">
          <h2 className="text-3xl font-normal text-gray-800 mb-8">
            Set New Password
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
            <div>
              <label
                htmlFor="newPassword"
                className="block text-left text-sm font-bold text-gray-700 mb-2"
              >
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                placeholder="Enter New Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-800"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                
              />
            </div>

            <div>
              <label
                htmlFor="confirmNewPassword"
                className="block text-left text-sm font-bold text-gray-700 mb-2"
              >
                Confirm New Password
              </label>
              <input
                id="confirmNewPassword"
                type="password"
                placeholder="Confirm New Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-800"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-md text-lg transition duration-200 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Changing..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
export default ChangePassword;
