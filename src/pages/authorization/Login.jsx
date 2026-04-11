import React, { useEffect, useState } from "react";
import MetaData from "../../layouts/MetaData";
import { Link, useNavigate } from "react-router-dom";
import { errorToast, successToast } from "../../functions/toastify";
import { Eye, EyeOff, Mail, Lock } from "lucide-react"; // Icons for premium feel
import { useAuth } from "../../context/auth";
import { GoogleLogin } from "@react-oauth/google";
import apis from "../../config/apis";
import { motion } from "framer-motion"; // Animation library

const Login = () => {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (auth?.token) {
      navigate("/dashboard");
    }
  }, [auth, navigate]);

  const changeHandler = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${apis.auth}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      const data = await res.json();

      if (data.ok === true) {
        localStorage.setItem("auth", JSON.stringify(data));
        setAuth(data);
        successToast("Login Successful!");
        navigate("/dashboard");
      } else {
        errorToast(data.error || data.warning || "Login Failed");
      }
    } catch (err) {
      errorToast("Server error, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MetaData title="Login - DC IMI LTD" />

      <div className="min-h-screen flex items-center justify-center bg-[#fdfdfd] relative overflow-hidden px-4">
        
        {/* Animated Background Blobs */}
        <div className="absolute top-[-15%] right-[-10%] w-[50%] h-[50%] bg-orange-50 rounded-full blur-[130px] opacity-60"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[110px] opacity-50"></div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 w-full max-w-[460px]"
        >
          <div className="bg-white/80 backdrop-blur-xl border border-gray-100 p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.04)]">
            
            <header className="text-center mb-10">
              <h2 className="text-4xl font-light text-gray-900 tracking-tight">
                Welcome <span className="font-semibold text-orange-500">Back</span>
              </h2>
              <p className="text-gray-400 text-sm mt-2">Enter your details to access your account</p>
            </header>

            <form onSubmit={loginHandler} className="space-y-6">
              {/* Email Input */}
              <div className="group">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1 group-focus-within:text-orange-500 transition-colors">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={changeHandler}
                    required
                    className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none transition-all duration-300 focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-50/50 text-gray-700"
                    placeholder="name@example.com"
                  />
                  <Mail className="absolute right-4 top-4 text-gray-300 group-focus-within:text-orange-200" size={20} />
                </div>
              </div>

              {/* Password Input */}
              <div className="group">
                <div className="flex justify-between items-center mb-2 ml-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] group-focus-within:text-orange-500 transition-colors">
                    Password
                  </label>
                  <Link to="/forget-password" name="forget" className="text-[10px] font-bold text-orange-600 uppercase tracking-widest hover:underline">
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={user.password}
                    onChange={changeHandler}
                    required
                    className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none transition-all duration-300 focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-50/50 text-gray-700"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-gray-300 hover:text-orange-500 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-2xl text-lg font-medium transition-all duration-300 shadow-xl shadow-gray-200 
                  ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-gray-900 hover:bg-black text-white"}`}
              >
                {loading ? "Verifying..." : "Sign In"}
              </motion.button>
            </form>

            <div className="my-8 flex items-center justify-center space-x-4">
              <div className="h-[1px] w-full bg-gray-100"></div>
              <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">OR</span>
              <div className="h-[1px] w-full bg-gray-100"></div>
            </div>

            {/* Google Login Section */}
            <div className="flex justify-center transform scale-110">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  const token = credentialResponse?.credential;
                  if (!token) return errorToast("Google token missing");
                  try {
                    const res = await fetch("http://localhost:1726/api/v1/auth/google", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ token }),
                    });
                    const data = await res.json();
                    if (data.ok === true) {
                      localStorage.setItem("auth", JSON.stringify(data));
                      setAuth(data);
                      successToast(`Welcome back!`);
                      navigate("/dashboard");
                    } else {
                      errorToast(data.message || "Google Login Failed");
                    }
                  } catch (err) {
                    errorToast("Server error");
                  }
                }}
                onError={() => errorToast("Google Login Cancelled")}
                theme="filled_black"
                shape="pill"
                size="large"
                text="continue_with"
                width="300"
              />
            </div>

            <footer className="mt-10 text-center">
              <p className="text-gray-500 text-sm">
                New to DC IMI LTD?{" "}
                <Link to="/signup" className="text-orange-600 font-bold hover:underline ml-1">
                  Create Account
                </Link>
              </p>
            </footer>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Login;