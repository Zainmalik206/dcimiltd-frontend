import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
import axios from "axios";
import apis from "../../config/apis";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { ShoppingBag, Zap, Star, ShieldCheck, Globe } from "lucide-react";
import { motion } from "framer-motion";

const UserDashboard = () => {
  const [auth, setAuth] = useAuth(); // setAuth yahan add kiya hai logout ke liye
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Agar token hi nahi hai toh foran bahar
    if (!auth?.token) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(`${apis.orders}/myorders`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        setOrders(data.slice(0, 4));
      } catch (err) {
        // ========== SINGLE TOAST FOR SESSION EXPIRY ==========
        if (err.response && err.response.status === 401) {
          // Sirf aik toast aur seedha logout logic
          toast.error("Session Expired. Please login again.", { 
            toastId: "session-expired", // Duplicate toast rokne ke liye id
            autoClose: 1500 
          });
          
          setAuth({ ...auth, user: null, token: "" });
          localStorage.removeItem("auth");
          navigate("/login");
        } else {
          // Baqi kisi bhi error ke liye ye chalega
          toast.error("Failed to load orders");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [auth?.token, navigate, setAuth]);

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-indigo-100">
      
      {/* 1. CINEMATIC TOP WELCOME BANNER */}
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative h-64 md:h-72 w-full bg-[#0A0F1D] overflow-hidden flex flex-col justify-center px-8 md:px-16"
      >
        <div className="absolute inset-0 opacity-20">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute -top-20 -right-20 w-96 h-96 bg-indigo-500 rounded-full blur-[120px]"
          />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        </div>

        <div className="relative z-10 space-y-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-3"
          >
            <span className="px-3 py-1 bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] rounded-md">
              System Access Granted
            </span>
            <div className="flex items-center gap-1 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
              <Globe size={12} /> Pakistan • Live
            </div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ delay: 0.7, duration: 1 }}
            className="text-4xl md:text-6xl font-black text-white tracking-tighter"
          >
            WELCOME TO <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 uppercase">DASHBOARD</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 1.2 }}
            className="text-white text-sm md:text-base font-medium max-w-xl tracking-tight"
          >
            Experience the next generation of e-commerce management with <span className="text-indigo-400 text-uppercase font-black">DC IMI LTD Elite</span>. Your personalized data stream is now active.
          </motion.p>
        </div>
      </motion.div>

      {/* 2. RUNNING TEXT MARQUEE */}
      <div className="bg-white border-y border-slate-100 py-3 overflow-hidden">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          className="whitespace-nowrap flex items-center gap-16 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400"
        >
          <span className="flex items-center gap-2"> New Arrivals in Tech</span>
          <span className="flex items-center gap-2"><ShieldCheck size={14} className="text-indigo-500"/> Verified Security Protocols</span>
          <span className="flex items-center gap-2"><Zap size={14} className="text-indigo-500"/> Fast Shipping Across Punjab</span>
          <span className="flex items-center gap-2"><Star size={14} className="text-indigo-500"/> Exclusive Membership Rewards</span>
          <span className="flex items-center gap-2"> New Arrivals in Tech</span>
          <span className="flex items-center gap-2"><ShieldCheck size={14} className="text-indigo-500"/> Verified Security Protocols</span>
        </motion.div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* 3. DATA STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <StatCard label="Orders Stream" value={orders.length} sub="Syncing Real-time" icon={<ShoppingBag size={20}/>} />
          <StatCard label="Credit" value="450" sub="Loyalty Points" icon={<Zap size={20}/>} />
          <StatCard label="Trust Factor" value="98%" sub="Elite Status" icon={<Star size={20}/>} />
        </div>

        {/* 4. ACTIVITY DATA SHOWCASE */}
        <div className="bg-slate-50/50 rounded-[3rem] border border-slate-100 p-10">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Recent Data Streams</h2>
          </div>

          {loading ? (
            <div className="py-20 text-center font-black text-slate-200 text-sm animate-pulse tracking-widest uppercase">Initializing System...</div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {orders.length > 0 ? (
                orders.map((order, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ delay: i * 0.1 }}
                    key={order._id}
                    className="bg-white p-7 rounded-[2rem] border border-transparent hover:border-slate-200 hover:shadow-xl transition-all flex justify-between items-center group cursor-pointer"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                        <p className="text-[10px] font-black">0{i+1}</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 uppercase tracking-tighter">Order ID: {order._id.slice(-6).toUpperCase()}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">{format(new Date(order.createdAt), "MMMM dd, yyyy")}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-slate-900 tracking-tight">Rs. {order.totalPrice}</p>
                      <div className="flex items-center justify-end gap-2 mt-1">
                         <span className={`w-2 h-2 rounded-full ${order.isDelivered ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'}`} />
                         <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">
                           {order.isDelivered ? "Delivered" : "In Progress"}
                         </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-10 text-slate-400 font-bold uppercase tracking-widest text-xs">No Recent Orders Found</div>
              )}
            </div>
          )}
        </div>
      </main>

      <Outlet />
    </div>
  );
};

const StatCard = ({ label, value, sub, icon }) => (
  <motion.div 
    whileHover={{ y: -10, scale: 1.02 }}
    className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/5 transition-all relative overflow-hidden group"
  >
    <div className="absolute top-[-20px] right-[-20px] text-slate-50 group-hover:text-indigo-50/50 transition-colors">
       {React.cloneElement(icon, { size: 100 })}
    </div>
    <div className="relative z-10">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">{label}</p>
      <h4 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">{value}</h4>
      <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{sub}</p>
    </div>
  </motion.div>
);

export default UserDashboard;