import React, { useState, useRef, useEffect } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { FiLogOut, FiUser, FiBell } from "react-icons/fi";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import { successToast } from "../functions/toastify";
import { motion, AnimatePresence } from "framer-motion";

const TopNavbar = ({ setOpen }) => {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // Dropdown ko refer karne ke liye ref
  const dropdownRef = useRef(null);

  // Bahar click karne par band karne ka logic
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const logoutHandler = () => {
    localStorage.removeItem("auth");
    setAuth(null);
    successToast("Logged out successfully!");
    navigate("/login");
  };

  if (!auth?.user?.email) return null;
  const user = auth.user;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-slate-200/60 shadow-sm">
      <div className="px-4 md:px-8 py-6"> 
        <div className="flex items-center justify-between relative">
          
          {/* Left: Menu Button */}
          <div className="flex items-center">
            <button
              onClick={() => setOpen(true)}
              className="p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition-all duration-300 border border-slate-100 shadow-sm active:scale-95"
            >
              <AiOutlineMenu size={22} />
            </button>
          </div>

          {/* Center: Brand Title */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter leading-none">
              <span className="text-slate-900 uppercase text-center block md:inline">DC LMI LTD</span>
              <span className="text-indigo-600 uppercase text-center block md:inline md:ml-2"> STORE</span>
            </h1>
          </div>

          {/* Right Area: Notifications + Profile */}
          <div className="flex items-center gap-3 md:gap-5">
            
            <button className="relative p-3 rounded-2xl text-slate-500 hover:bg-slate-50 hover:text-indigo-600 transition-all active:scale-90 border border-transparent hover:border-slate-100">
              <FiBell size={22} />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full shadow-sm"></span>
            </button>

            {/* Profile Dropdown Container */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 p-1 pr-4 rounded-2xl border border-slate-200/60 bg-white hover:bg-indigo-50/50 hover:border-indigo-200 transition-all duration-300 shadow-sm"
              >
                <div className="relative group">
                  <img
                    src={user.profile_picture || `https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=4f46e2&color=fff&bold=true`}
                    alt="Profile"
                    className="w-10 h-10 rounded-xl object-cover shadow-md ring-2 ring-white group-hover:ring-indigo-100 transition-all"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-sm"></div>
                </div>

                <div className="hidden sm:block text-left">
                  <p className="text-[14px] font-black text-slate-800 leading-none uppercase">
                    {user.first_name}
                  </p>
                </div>
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    className="absolute right-0 mt-5 w-72 bg-white rounded-[28px] shadow-[0_25px_60px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden z-50 origin-top-right"
                  >
                    <div className="p-7 bg-slate-900 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/30 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                      <div className="relative z-10">
                        <p className="font-black text-white text-xl tracking-tight leading-tight uppercase">
                          {user.first_name} {user.last_name}
                        </p>
                        <p className="text-xs text-slate-400 mt-2 font-medium bg-white/5 inline-block px-2 py-1 rounded-md">{user.email}</p>
                      </div>
                    </div>

                    <div className="p-4 bg-white">
                      <button
                        onClick={() => { setDropdownOpen(false); navigate("/profile"); }}
                        className="w-full px-5 py-3.5 flex items-center gap-4 hover:bg-indigo-50 rounded-[20px] transition-all group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                          <FiUser size={18} />
                        </div>
                        <span className="font-bold text-slate-700 text-[14px]">Profile Settings</span>
                      </button>

                      <div className="h-[1px] bg-slate-100 my-3 mx-4"></div>

                      <button
                        onClick={logoutHandler}
                        className="w-full px-5 py-3.5 flex items-center gap-4 hover:bg-rose-50 rounded-[20px] transition-all group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-all shadow-sm">
                          <FiLogOut size={18} />
                        </div>
                        <span className="font-bold text-rose-600 text-[14px]">System Logout</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;