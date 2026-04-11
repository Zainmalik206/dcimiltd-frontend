import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../pages/dashboard/Sidebar";
import {
  Package, MapPin, CreditCard, CheckCircle, Truck, 
  ArrowLeft, Phone, User, Printer, Zap, ShieldCheck,
  ChevronRight, Box, Clock
} from "lucide-react";
import { format } from "date-fns";
import { addCommas } from "../functions/func";
import axios from "axios";
import apis from "../config/apis";
import { useAuth } from "../context/auth";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [auth] = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!auth?.token) return navigate("/login");
      try {
        setLoading(true);
        const { data } = await axios.get(`${apis.orders}/${id}`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        setOrder(data);
      } catch (err) {
        toast.error("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, auth, navigate]);

  if (loading) {
    return (
      <div className="flex bg-[#FBFBFE] min-h-screen">
        <Sidebar />
        <div className="flex-1 lg:pl-[260px] flex items-center justify-center">
          <div className="text-center font-black text-slate-200 tracking-[0.5em] animate-pulse uppercase">
            Synchronizing Hub...
          </div>
        </div>
      </div>
    );
  }

  // Animation Variants
  const containerVars = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex bg-[#FBFBFE] min-h-screen font-sans selection:bg-indigo-100">
      <Sidebar />
      
      <div className="flex-1 lg:pl-[260px] w-full transition-all duration-500">
        
        {/* PREMIUM TOP BAR */}
        <div className="bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4 sticky top-0 z-40 flex justify-between items-center">
          <button onClick={() => navigate("/orders")} className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-all group">
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">Back to Ledger</span>
          </button>
          
          <div className="flex items-center gap-3">
             <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-100">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-tighter">Live Tracker Active</span>
             </div>
             <button className="p-2.5 text-slate-400 hover:text-indigo-600 bg-white border border-slate-100 rounded-xl transition-all shadow-sm">
                <Printer size={18}/>
             </button>
          </div>
        </div>

        <motion.main 
          variants={containerVars}
          initial="hidden"
          animate="visible"
          className="p-4 md:p-8 lg:p-12 max-w-[1200px] mx-auto"
        >
          
          {/* HEADER & ACTION BAR */}
          <header className="mb-10 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-[2px] w-8 bg-indigo-600 rounded-full" />
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">Operational Manifest</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter uppercase">
                Order <span className="text-slate-300">#</span>{order._id.slice(-6).toUpperCase()}
              </h1>
            </div>
            
          
          </header>

          {/* DYNAMIC PROGRESS TRACKER */}
          <motion.div variants={itemVars} className="bg-white rounded-[2.5rem] border border-slate-100 p-8 lg:p-12 mb-10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-slate-50" />
            <div className="relative flex justify-between items-center max-w-3xl mx-auto">
              {/* Connecting Line Backdrop */}
              <div className="absolute top-5 left-0 w-full h-[2px] bg-slate-100 z-0" />
              {/* Animated Progress Line */}
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: order.isDelivered ? "100%" : order.isPaid ? "50%" : "15%" }}
                className="absolute top-5 left-0 h-[2px] bg-indigo-600 z-0 transition-all duration-1000 shadow-[0_0_10px_rgba(79,70,229,0.4)]"
              />

              {[
                { icon: <Box size={16}/>, label: 'Confirmed', done: true },
                { icon: <CreditCard size={16}/>, label: 'Payment', done: order.isPaid },
                { icon: <Truck size={16}/>, label: 'Shipping', done: order.isDelivered },
                { icon: <CheckCircle size={16}/>, label: 'Delivered', done: order.isDelivered }
              ].map((step, i) => (
                <div key={i} className="relative z-10 flex flex-col items-center gap-4">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-700 ${step.done ? 'bg-indigo-600 text-white rotate-[360deg] shadow-lg shadow-indigo-100' : 'bg-white border-2 border-slate-100 text-slate-300'}`}>
                    {step.icon}
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${step.done ? 'text-slate-900' : 'text-slate-300'}`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* MAIN CONTENT: Left Column */}
            <div className="lg:col-span-2 space-y-10">
              
              {/* ITEM LIST */}
              <motion.div variants={itemVars} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <Package size={16} className="text-indigo-600" /> Package Contents
                  </h3>
                  <div className="px-3 py-1 bg-slate-900 rounded-lg text-[9px] font-bold text-white uppercase tracking-tighter">
                    {order.orderItems.length} Units
                  </div>
                </div>
                <div className="p-8 space-y-8">
                  {order.orderItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-6 group cursor-pointer">
                      <div className="relative w-24 h-24 flex-shrink-0 rounded-[1.5rem] overflow-hidden border border-slate-100 shadow-inner">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/10 transition-colors" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900 text-xl leading-tight group-hover:text-indigo-600 transition-colors">{item.title}</h4>
                        <div className="flex items-center gap-3 mt-2">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">SKU: {item.product.slice(-5)}</span>
                           <div className="h-1 w-1 bg-slate-200 rounded-full" />
                           <span className="text-[10px] font-black text-indigo-500 uppercase tracking-tighter">Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black text-slate-900 tracking-tighter italic">£{addCommas(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* INFO CARDS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 {/* SHIPPING */}
                 <motion.div variants={itemVars} className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm group">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                      <MapPin size={22} />
                    </div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Shipping Destination</h3>
                    <div className="space-y-1">
                      <p className="text-xl font-black text-slate-900">{order.shippingAddress.fullName}</p>
                      <p className="text-slate-500 text-sm font-medium leading-relaxed italic">
                        {order.shippingAddress.address}, {order.shippingAddress.city}<br />
                        {order.shippingAddress.country} - {order.shippingAddress.postalCode}
                      </p>
                    </div>
                    <div className="mt-6 pt-6 border-t border-slate-50 flex items-center gap-3">
                       <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><Phone size={14}/></div>
                       <span className="text-xs font-black text-slate-900 tracking-tight">{order.shippingAddress.phone}</span>
                    </div>
                 </motion.div>

                 {/* LOGISTICS FEED */}
                 <motion.div variants={itemVars} className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
                    <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mb-6">
                      <Clock size={22} />
                    </div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 italic">Tracking History</h3>
                    <div className="space-y-6">
                       <div className="flex gap-4">
                          <div className="w-1.5 h-1.5 mt-1 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <div>
                             <p className="text-[9px] font-black text-slate-900 uppercase">Order Initiated</p>
                             <p className="text-[10px] font-medium text-slate-400 uppercase mt-0.5">{format(new Date(order.createdAt), "dd MMM, yyyy | hh:mm a")}</p>
                          </div>
                       </div>
                       <div className="flex gap-4">
                          <div className={`w-1.5 h-1.5 mt-1 rounded-full ${order.isPaid ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                          <div>
                             <p className="text-[9px] font-black text-slate-900 uppercase">Payment Lifecycle</p>
                             <p className="text-[10px] font-medium text-slate-400 uppercase mt-0.5">{order.isPaid ? 'Verification Success' : 'Awaiting Settlement'}</p>
                          </div>
                       </div>
                    </div>
                 </motion.div>
              </div>
            </div>

            {/* RIGHT COLUMN: Ledger Summary */}
            <div className="space-y-10">
               <motion.div variants={itemVars} className="bg-slate-900 text-white rounded-[3rem] p-10 shadow-2xl shadow-indigo-100 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 mb-10">Fiscal Summary</h3>
                  
                  <div className="space-y-5">
                    <div className="flex justify-between items-center text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                       <span>Market Value</span>
                       <span className="text-slate-200">£{addCommas(order.itemsPrice)}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                       <span>Logistics Fee</span>
                       <span className={order.shippingPrice === 0 ? "text-emerald-400" : "text-slate-200"}>
                         {order.shippingPrice === 0 ? "Complimentary" : `£${addCommas(order.shippingPrice)}`}
                       </span>
                    </div>
                    <div className="py-6 my-4 border-y border-white/5">
                       <div className="flex justify-between items-end">
                          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Net Settlement</span>
                          <div className="text-right">
                             <p className="text-3xl font-black tracking-tighter text-white">£{addCommas(order.totalPrice)}</p>
                             <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Inclusive of VAT</p>
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="mt-8 p-5 bg-white/5 rounded-3xl border border-white/10 flex items-center gap-4">
                     <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                        <CreditCard size={20} />
                     </div>
                     <div>
                        <p className="text-[9px] font-black text-indigo-300 uppercase tracking-widest">Source</p>
                        <p className="text-xs font-bold uppercase tracking-tight">{order.paymentMethod}</p>
                     </div>
                  </div>
               </motion.div>

               {/* TRUST BADGE */}
               <motion.div variants={itemVars} className="bg-indigo-50/40 border border-indigo-100 rounded-[2.5rem] p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <ShieldCheck className="text-indigo-600" size={24} />
                    <h4 className="text-xs font-black text-indigo-900 uppercase tracking-widest">DC IMI LTD Protect</h4>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                    This manifest is cryptographically verified. Any discrepancies in logistics should be reported to the enterprise support desk immediately.
                  </p>
                
               </motion.div>
            </div>

          </div>
        </motion.main>
      </div>
    </div>
  );
};

export default OrderDetail;