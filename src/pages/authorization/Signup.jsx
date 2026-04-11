import React, { useState } from "react";
import MetaData from "../../layouts/MetaData";
import apis from "../../config/apis";
import axios from "axios";
import { Link } from "react-router-dom";
import { errorToast, successToast, warningToast } from "../../functions/toastify";
import { motion } from "framer-motion"; // Animations ke liye

const Signup = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const changeHandler = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const signupHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${apis.auth}/pre-signup`, user);
      if (data.warning) return warningToast(data.warning);
      if (data.error) return errorToast(data.error);
      successToast(data.message);
    } catch {
      errorToast("Signup failed! Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MetaData title="Join DC IMI LTD" />
      <div className="min-h-screen flex items-center justify-center bg-[#fdfdfd] relative overflow-hidden">
        
        {/* Subtle Background Elements for Luxury Feel */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-50 rounded-full blur-[120px] opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-50 rounded-full blur-[100px] opacity-50"></div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 w-full max-w-[450px] px-6"
        >
          <div className="bg-white/80 backdrop-blur-md border border-gray-100 p-10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
            
            <header className="mb-10">
              <h2 className="text-4xl font-light tracking-tight text-gray-900 mb-2">
                Create <span className="font-semibold text-orange-500">Account</span>
              </h2>
              <p className="text-gray-500 text-sm">Elevate your shopping experience today.</p>
            </header>

            <form onSubmit={signupHandler} className="space-y-6">
              <CustomInput 
                label="Email Address" 
                name="email" 
                type="email"
                placeholder="name@example.com"
                value={user.email} 
                onChange={changeHandler} 
              />
              
              <CustomInput 
                label="Password" 
                name="password" 
                type="password" 
                placeholder="••••••••"
                value={user.password} 
                onChange={changeHandler} 
              />

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                type="submit" 
                className={`w-full py-4 rounded-xl text-lg font-medium transition-all duration-300 shadow-lg 
                  ${loading ? 'bg-gray-400 cursor-not-initialized' : 'bg-gray-900 hover:bg-black text-white shadow-gray-200'}`}
              >
                {loading ? "Processing..." : "Get Started"}
              </motion.button>
            </form>

            <footer className="mt-8 pt-6 border-t border-gray-50 text-center">
              <p className="text-gray-600 text-sm">
                Already have an account?{" "}
                <Link to="/login" className="text-orange-600 font-semibold hover:underline ml-1">
                  Sign In
                </Link>
              </p>
            </footer>
          </div>
        </motion.div>
      </div>
    </>
  );
};

/* Reusable Premium Input Component */
const CustomInput = ({ label, ...props }) => (
  <div className="group text-left">
    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1 transition-colors group-focus-within:text-orange-500">
      {label}
    </label>
    <input 
      {...props} 
      className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-xl outline-none transition-all duration-300 
                 focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-50/50 placeholder:text-gray-300 text-gray-700"
    />
  </div>
);

export default Signup;