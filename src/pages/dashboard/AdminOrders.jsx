import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import apis from "../../config/apis";
import Loader from "../../layouts/Loader";
import { 
  PackageCheck, Truck, Trash2, 
  Search, Filter, ExternalLink, 
  Calendar, CreditCard, User, Hash, Clock, ChevronDown, CheckCircle2, AlertCircle
} from "lucide-react";
import { errorToast, successToast } from "../../functions/toastify";
import { useAuth } from "../../context/auth";
import { motion, AnimatePresence } from "framer-motion";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activePaymentMenu, setActivePaymentMenu] = useState(null);
  const [auth] = useAuth();
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${apis.orders}`, {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });
      // Backend should send populated user data
      setOrders(Array.isArray(data) ? data : data.orders || []);
    } catch (err) {
      errorToast(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${apis.orders}/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${auth?.token}` }
      });
      successToast(`Order marked as ${status}`);
      fetchOrders();
    } catch (err) {
      errorToast("Update failed");
    }
  };

  const updatePayment = async (id, isPaid) => {
    try {
      await axios.put(`${apis.orders}/${id}/payment`, { isPaid }, {
        headers: { Authorization: `Bearer ${auth?.token}` }
      });
      successToast(`Payment marked as ${isPaid ? "Paid" : "Pending"}`);
      setActivePaymentMenu(null);
      fetchOrders();
    } catch (err) {
      errorToast("Payment update failed");
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm("Permanent delete this order?")) return;
    try {
      await axios.delete(`${apis.orders}/${id}`, {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });
      successToast("Order removed");
      fetchOrders();
    } catch (err) {
      errorToast("Delete failed");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActivePaymentMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (auth?.token) fetchOrders();
  }, [auth]);

  const filteredOrders = orders.filter(order => 
    order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center bg-transparent">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFE] pb-12 pt-6 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
             <div className="flex items-center gap-2 mb-2">
              <div className="h-[2px] w-8 bg-indigo-600 rounded-full" />
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">Operational Ledger</span>
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">
              Order <span className="text-slate-300">Management</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Search by ID, Name or Email..."
                className="pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-[11px] font-bold uppercase w-full md:w-64 focus:ring-4 focus:ring-indigo-50 outline-none transition-all shadow-sm"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-indigo-600 transition shadow-sm">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* --- TABLE --- */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Transaction</th>
                  <th className="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Customer Info</th>
                  <th className="px-6 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Amount</th>
                  <th className="px-6 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Settlement</th>
                  <th className="px-6 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Logistic State</th>
                  <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50/50 transition-colors group">
                    
                    {/* ID Column */}
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                          <Hash className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-sm tracking-tighter uppercase">#{order._id.slice(-6)}</p>
                          <p className="text-[9px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-tighter">
                            <Calendar className="w-3 h-3" /> {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Customer Info (FIXED) */}
                    <td className="px-6 py-6">
                       <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-[10px] font-black uppercase shadow-sm">
                            {order.user?.name ? order.user.name.charAt(0) : "G"}
                          </div>
                          <div>
                            <p className="text-slate-900 text-[13px] font-black tracking-tight leading-none mb-1">
                              {order.user?.name || "Guest User"}
                            </p>
                            <p className="text-[10px] text-slate-400 font-bold lowercase tracking-tighter truncate w-32">
                              {order.user?.email || "No Email"}
                            </p>
                          </div>
                       </div>
                    </td>

                    {/* Price Column */}
                    <td className="px-6 py-6 text-center font-black text-slate-900 italic">
                       £{order.totalPrice?.toLocaleString()}
                    </td>

                    {/* Payment Status Submenu */}
                    <td className="px-6 py-6 text-center relative">
                      <button 
                        onClick={() => setActivePaymentMenu(activePaymentMenu === order._id ? null : order._id)}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border shadow-sm ${
                          order.isPaid 
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100" 
                          : "bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100"
                        }`}
                      >
                        {order.isPaid ? "Paid" : "Pending"}
                        <ChevronDown size={12} className={`transition-transform ${activePaymentMenu === order._id ? 'rotate-180' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {activePaymentMenu === order._id && (
                          <motion.div 
                            ref={menuRef}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute z-[100] left-1/2 -translate-x-1/2 mt-2 w-40 bg-white border border-slate-100 rounded-2xl shadow-xl p-2"
                          >
                            <button 
                              onClick={() => updatePayment(order._id, true)}
                              className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-emerald-50 rounded-xl transition-all group"
                            >
                              <span className="text-[10px] font-black text-slate-600 group-hover:text-emerald-600 uppercase">Paid</span>
                              <CheckCircle2 size={14} className="text-emerald-500" />
                            </button>
                            <button 
                              onClick={() => updatePayment(order._id, false)}
                              className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-amber-50 rounded-xl transition-all group mt-1"
                            >
                              <span className="text-[10px] font-black text-slate-600 group-hover:text-amber-600 uppercase">Pending</span>
                              <AlertCircle size={14} className="text-amber-500" />
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </td>

                    {/* Logistic State Dropdown */}
                    <td className="px-6 py-6 text-center">
                      <select
                        value={order.status || "Pending"}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-tighter outline-none cursor-pointer border transition-all ${
                          order.status === 'Delivered' ? 'bg-indigo-600 text-white border-indigo-700' : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => navigate(`/order/${order._id}`)}
                          className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all" 
                          title="View Manifest"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        
                        <button 
                          onClick={() => deleteOrder(order._id)}
                          className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
               Total {filteredOrders.length} active manifests
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;