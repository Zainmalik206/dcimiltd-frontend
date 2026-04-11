import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Check, Package, ArrowRight, Home } from "lucide-react"
import { addCommas } from "../functions/func";
import { motion } from "framer-motion";

const OrderSuccess = () => {
  const location = useLocation();
  const order = location.state?.order;

  return (
    <div className="min-h-[90vh] bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        
        {/* 1. ANIMATED SUCCESS ICON */}
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-100 shadow-sm"
        >
          <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-200">
            <Check className="w-10 h-10 text-white" strokeWidth={3} />
          </div>
        </motion.div>

        {/* 2. TEXT CONTENT */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic mb-3">
            Order <span className="text-emerald-500">Confirmed</span>
          </h1>
          <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-[280px] mx-auto mb-10">
            Your order has been successfully placed and is now being processed by our team.
          </p>
        </motion.div>

        {/* 3. ORDER TICKET (Minimal) */}
        {order && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-50 rounded-[2rem] p-6 mb-10 border border-slate-100 relative overflow-hidden"
          >
            {/* Decorative dots for ticket feel */}
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full" />
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full" />
            
            <div className="flex justify-between items-center pb-4 border-b border-dashed border-slate-200">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tracking ID</span>
              <span className="text-sm font-bold text-slate-900 tracking-tight">#{order._id.slice(-8).toUpperCase()}</span>
            </div>
            
            <div className="flex justify-between items-center pt-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Value</span>
              <span className="text-lg font-black text-emerald-600 italic">£{addCommas(order.totalPrice)}</span>
            </div>
          </motion.div>
        )}

        {/* 4. ACTIONS */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col gap-3"
        >
          <Link
            to="/orders"
            className="group flex items-center justify-center gap-3 bg-slate-900 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all duration-300 shadow-xl shadow-slate-200"
          >
            <Package size={16} />
            Track My Order
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/"
            className="flex items-center justify-center gap-2 text-slate-400 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:text-slate-900 transition-colors"
          >
            <Home size={14} />
            Back to Home
          </Link>
        </motion.div>

        {/* 5. FOOTER */}
        <p className="text-[9px]  font-bold text-slate-300 uppercase tracking-[0.3em] mt-12">
          Confirmation sent to your registered email
        </p>
      </div>
    </div>
  );
};

export default OrderSuccess;