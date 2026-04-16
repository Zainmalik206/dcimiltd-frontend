import React, { useState } from "react";
import MetaData from "../../layouts/MetaData";
import apis from "../../config/apis";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"; // Animations
import { Mail, ArrowLeft } from "lucide-react"; // Icons
import {
  errorToast,
  successToast,
  warningToast,
} from "../../functions/toastify";

const ForgetPassword = () => {
  const [user, setUser] = useState({ email: "" });
  const [loading, setLoading] = useState(false);

  const changeHandler = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const ForgetPasswordHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${apis.auth}/forget-password`, user);
      if (data.warning) {
        warningToast(data.warning);
      } else if (data.error) {
        errorToast(data.error);
      } else {
        successToast(data.message);
      }
    } catch (err) {
      errorToast("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MetaData title="Reset Your Password" />
      
      <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc] relative overflow-hidden px-4 font-sans">
        
        {/* Soft Background Accents */}
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-orange-50/50 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-50/40 rounded-full blur-[100px]"></div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 w-full max-w-[440px]"
        >
          <div className="bg-white border border-gray-100 p-10 md:p-12 rounded-[2.5rem] shadow-[0_25px_70px_rgba(0,0,0,0.03)] text-center">
            
            {/* Minimalist Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500">
                <Mail size={32} strokeWidth={1.5} />
              </div>
            </div>

            <header className="mb-10">
              <h2 className="text-3xl font-light text-gray-900 tracking-tight mb-2">
                Password <span className="font-semibold text-orange-600">Recovery</span>
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Enter your registered email address and we'll send you a secure link to reset your password.
              </p>
            </header>

            <form onSubmit={ForgetPasswordHandler} className="space-y-6 text-left">
              <div className="group">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1 group-focus-within:text-orange-500 transition-colors">
                  Registered Email
                </label>
                <div className="relative">
                  <input
                    name="email"
                    value={user.email}
                    onChange={changeHandler}
                    placeholder="name@example.com"
                    type="email"
                    required
                    className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none transition-all duration-300 focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-100/50 text-gray-700"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-2xl text-lg font-medium transition-all duration-300 shadow-xl 
                  ${loading ? "bg-gray-300 cursor-not-allowed" : "bg-black hover:bg-gray-900 text-white shadow-gray-200"}`}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </motion.button>

              <div className="pt-4 flex justify-center">
                <Link 
                  to="/login" 
                  className="flex items-center space-x-2 text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-orange-600 transition-colors"
                >
                  <ArrowLeft size={14} />
                  <span>Back to Login</span>
                </Link>
              </div>
            </form>
          </div>

          <p className="text-center mt-8 text-gray-400 text-xs tracking-widest uppercase">
            Secured by DC LMI Ltd Authentication
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default ForgetPassword;