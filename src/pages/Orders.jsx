import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../pages/dashboard/Sidebar";
import { 
  Package, ShoppingBag, Truck, CheckCircle, Clock, 
  XCircle, ChevronRight, Filter, ArrowUpRight, Search, Zap
} from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "../context/auth";
import axios from "axios";
import apis from "../config/apis";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const Orders = () => {
  const navigate = useNavigate();
  const [auth] = useAuth();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (!auth?.token) return navigate("/login");
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${apis.orders}/myorders`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        setOrders(data);
        setFilteredOrders(data);
      } catch (err) {
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [auth, navigate]);

  useEffect(() => {
    setFilteredOrders(
      statusFilter === "all" ? orders : orders.filter(o => o.status?.toLowerCase() === statusFilter)
    );
  }, [statusFilter, orders]);

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered": return { color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", dot: "bg-emerald-500" };
      case "shipped": return { color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100", dot: "bg-indigo-500" };
      case "processing": return { color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100", dot: "bg-amber-500" };
      case "cancelled": return { color: "text-red-600", bg: "bg-red-50", border: "border-red-100", dot: "bg-red-500" };
      default: return { color: "text-slate-500", bg: "bg-slate-50", border: "border-slate-100", dot: "bg-slate-400" };
    }
  };

  return (
    <div className="flex bg-[#FBFBFE] min-h-screen overflow-x-hidden">
      {/* Sidebar stays fixed/absolute based on your implementation */}
      <Sidebar />
      
      {/* MAIN CONTENT AREA: Removed hardcoded large margins, added balanced padding */}
      <div className="flex-1 lg:pl-[260px] w-full transition-all duration-300">
        
        {/* TOP STATUS BAR */}
        <div className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 sticky top-0 z-30 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Network: Pakistan North</span>
          </div>
          <div className="hidden sm:block text-[10px] font-black text-slate-400 uppercase tracking-widest">
            ID IMI LTD <span className="text-indigo-600">v3.0</span>
          </div>
        </div>

        {/* Content Wrapper: Adjusted Max-Width to prevent excessive right-shift */}
        <main className="p-4 md:p-8 lg:p-10 max-w-[1200px] mx-auto">
          
          {/* HEADER */}
          <header className="mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-2 mb-2">
                 <div className="h-1 w-6 bg-indigo-600 rounded-full" />
                 <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">Logistics Portal</span>
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
                MY ORDERS <span className="text-slate-300">/</span>
              </h1>
            </motion.div>

            {/* STATUS TABS - Compact version to save space */}
            <div className="flex bg-slate-100/50 p-1 rounded-2xl overflow-x-auto no-scrollbar border border-slate-100">
              {['all', 'processing', 'shipped', 'delivered'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    statusFilter === tab 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </header>

          {/* FEED */}
          <div className="grid grid-cols-1 gap-5">
            {loading ? (
               <div className="h-64 flex items-center justify-center font-black text-slate-200 tracking-[0.5em] uppercase">Loading Streams...</div>
            ) : filteredOrders.length === 0 ? (
              <div className="py-32 text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm">
                <ShoppingBag size={48} className="mx-auto text-slate-100 mb-4" />
                <p className="text-slate-400 font-bold italic tracking-tight text-sm uppercase">No transaction history found.</p>
              </div>
            ) : (
              <AnimatePresence>
                {filteredOrders.map((order, i) => {
                  const style = getStatusStyle(order.status);
                  return (
                    <motion.div
                      key={order._id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => navigate(`/order/${order._id}`)}
                      className="group bg-white rounded-[2rem] border border-slate-100 p-5 md:p-7 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all cursor-pointer relative overflow-hidden"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        
                        {/* ID & Info */}
                        <div className="flex items-center gap-5">
                          <div className={`w-12 h-12 rounded-2xl ${style.bg} ${style.color} flex items-center justify-center shadow-sm`}>
                             <Package size={20} />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Order Ref</p>
                            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tighter">#{order._id.slice(-8).toUpperCase()}</h4>
                            <p className="text-[10px] text-slate-400 font-medium mt-0.5">{format(new Date(order.createdAt), "dd MMM, yyyy")}</p>
                          </div>
                        </div>

                        {/* Middle: Item Stacks */}
                        <div className="flex items-center gap-3 bg-slate-50/50 p-2 pr-6 rounded-2xl border border-slate-50">
                          <div className="flex -space-x-3">
                            {order.orderItems.slice(0, 3).map((item, idx) => (
                              <img key={idx} src={item.image} className="w-10 h-10 rounded-lg border-2 border-white shadow-sm object-cover" />
                            ))}
                            {order.orderItems.length > 3 && (
                               <div className="w-10 h-10 rounded-lg bg-slate-900 border-2 border-white flex items-center justify-center text-[8px] font-bold text-white">+{order.orderItems.length-3}</div>
                            )}
                          </div>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{order.orderItems.length} Item(s)</p>
                        </div>

                        {/* Status & Price */}
                        <div className="flex items-center justify-between md:justify-end gap-10 border-t md:border-t-0 pt-4 md:pt-0 border-slate-50">
                          <div className="text-left md:text-right">
                             <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Total</p>
                             <p className="text-xl font-black text-slate-900 tracking-tight">£{order.totalPrice.toLocaleString()}</p>
                          </div>
                          <div className={`px-4 py-1.5 rounded-full border ${style.border} ${style.bg} ${style.color} flex items-center gap-2`}>
                             <div className={`w-1.5 h-1.5 rounded-full ${style.dot} ${order.status !== 'delivered' && 'animate-ping'}`} />
                             <span className="text-[9px] font-black uppercase tracking-widest">{order.status || 'Pending'}</span>
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Orders;