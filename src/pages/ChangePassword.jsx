import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import apis from "../config/apis";
import { errorToast, successToast, warningToast } from "../functions/toastify";
import MetaData from "../layouts/MetaData";
import Loader from "../layouts/Loader";
import { motion } from "framer-motion"; 
import { Lock, Eye, EyeOff, ShieldCheck, ArrowLeft } from "lucide-react";

const ChangePassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmNewPassword) {
      return errorToast("Passwords do not match!");
    }

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
      <MetaData title="Set New Password - DC IMI LTD" />

      {loading ? (
        <Loader />
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-[#fdfdfd] relative overflow-hidden px-4 font-sans">
          
          {/* Animated Background Blobs */}
          <div className="absolute top-[-15%] left-[-5%] w-[50%] h-[50%] bg-orange-50 rounded-full blur-[130px] opacity-60"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[110px] opacity-50"></div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 w-full max-w-[460px]"
          >
            <div className="bg-white/80 backdrop-blur-xl border border-gray-100 p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.04)]">
              
              {/* Security Icon Header */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 shadow-inner">
                  <ShieldCheck size={32} strokeWidth={1.5} />
                </div>
              </div>

              <header className="text-center mb-10">
                <h2 className="text-3xl font-light text-gray-900 tracking-tight">
                  Secure <span className="font-semibold text-orange-500">Update</span>
                </h2>
                <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                  Please enter your new secure password below to regain access.
                </p>
              </header>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* New Password Input */}
                <div className="group text-left">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1 group-focus-within:text-orange-500 transition-colors">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none transition-all duration-300 focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-50/50 text-gray-700"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <Lock className="absolute right-12 top-4 text-gray-300 group-focus-within:text-orange-200" size={18} />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-4 text-gray-300 hover:text-orange-500 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div className="group text-left">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1 group-focus-within:text-orange-500 transition-colors">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none transition-all duration-300 focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-50/50 text-gray-700"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      disabled={loading}
                    />
                    <Lock className="absolute right-4 top-4 text-gray-300 group-focus-within:text-orange-200" size={18} />
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 rounded-2xl text-lg font-medium transition-all duration-300 shadow-xl shadow-gray-200 
                    ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-gray-900 hover:bg-black text-white"}`}
                >
                  {loading ? "Updating..." : "Update Password"}
                </motion.button>

                {/* Back Link */}
                <div className="pt-2 flex justify-center">
                  <Link 
                    to="/login" 
                    className="flex items-center space-x-2 text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-orange-600 transition-colors"
                  >
                    <ArrowLeft size={14} />
                    <span>Return to Login</span>
                  </Link>
                </div>
              </form>
            </div>
            
            <p className="text-center mt-8 text-gray-400 text-xs tracking-widest uppercase">
              Encrypted End-to-End By DC IMI LTD
            </p>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default ChangePassword;