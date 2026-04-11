import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux"; // 👈 Redux se connect karne ke liye
import { useAuth } from "../context/auth";
import { addCommas } from "../functions/func";
import { errorToast, successToast } from "../functions/toastify";
import apis from "../config/apis";
import MetaData from "../layouts/MetaData";

// Professional Icons
import { MapPin, CreditCard, ShieldCheck, Box, Info, ArrowRight, Truck, Mail } from "lucide-react";

const Checkout = () => {
  const navigate = useNavigate();
  const [auth] = useAuth();
  
  // 👈 Redux store se Cart ka sara data le rahe hain (Subtotal, Shipping, etc.)
  const { cartItems, subtotal, shippingPrice, totalPrice } = useSelector((state) => state.cart);

  const [form, setForm] = useState({
    fullName: "", 
    email: "", 
    phone: "", 
    address: "", 
    city: "", 
    postalCode: "", 
    country: "Pakistan",
  });

  useEffect(() => {
    if (auth?.user?.email) {
      setForm((prev) => ({ ...prev, email: auth.user.email }));
    }
  }, [auth]);

  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [loading, setLoading] = useState(false);

  const handleInput = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validateForm = () => {
    const { fullName, email, phone, address, city, postalCode } = form;
    if (!fullName || !email || !phone || !address || !city || !postalCode) {
      errorToast("Please fill in all delivery information");
      return false;
    }
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      errorToast("Please enter a valid email address");
      return false;
    }
    if (phone.length < 10) {
      errorToast("Please enter a valid contact number");
      return false;
    }
    if (cartItems.length === 0) {
      errorToast("Your cart is empty");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth?.token) return errorToast("Please login to continue");
    if (!validateForm()) return;
    
    const orderData = {
      orderItems: cartItems.map((i) => ({
        title: i.title, quantity: i.quantity, price: i.price,
        image: i.images?.[0]?.url || i.images?.[0] || "", product: i._id,
      })),
      shippingAddress: form, 
      email: form.email, 
      paymentMethod, 
      itemsPrice: subtotal,
      shippingPrice: shippingPrice, // 👈 Redux se aayi hui dynamic price
      taxPrice: 0,
      totalPrice: totalPrice, // 👈 Redux se aaya hua dynamic total
    };

    try {
      setLoading(true);
      const { data } = await axios.post(apis.orders, orderData, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      successToast("Order placed successfully!");
      // localStorage.removeItem("cartItems"); // Redux action handler handle karega isay clearCart se
      navigate("/order-success", { state: { order: data }, replace: true });
    } catch (err) {
      errorToast(err.response?.data?.message || "Order failed to process");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-12 px-4 md:px-10">
      <MetaData title="Checkout — Review & Pay" />
      
      <div className="max-w-[1400px] mx-auto">
        <div className="border-b-2 border-slate-900 pb-6 mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight italic uppercase tracking-tighter">Review <span className="text-blue-600">Order</span></h1>
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest mt-1">Finalize shipment & receipt details</p>
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm font-bold text-slate-900">
            <span className="flex items-center gap-2"><ShieldCheck size={18} className="text-blue-600"/> Secure SSL</span>
            <span className="flex items-center gap-2"><Truck size={18} className="text-blue-600"/> Express Delivery</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 space-y-10">
            {/* PRODUCT TABLE */}
            <div className="overflow-x-auto border border-slate-100 rounded-[2rem] shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 border-b border-slate-800 text-white">
                    <th className="p-5 text-[10px] font-black uppercase tracking-widest">Product Details</th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-widest">Qty</th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cartItems.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-5 flex items-center gap-4">
                        <div className="w-14 h-14 border border-slate-100 rounded-2xl bg-white p-1 shadow-inner">
                          <img src={item.images?.[0]?.url || item.images?.[0]} alt={item.title} className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm tracking-tight">{item.title}</p>
                          <p className="text-[9px] font-black text-blue-600 uppercase mt-0.5 tracking-tighter italic">ID: {item._id.slice(-6)}</p>
                        </div>
                      </td>
                      <td className="p-5 font-black text-slate-900 text-xs">{item.quantity}x</td>
                      <td className="p-5 font-black text-slate-900 text-right text-sm italic">£{addCommas(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* SHIPPING FORM */}
            <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-slate-900 p-2.5 rounded-xl text-white shadow-lg"><MapPin size={20}/></div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">Delivery Destination</h2>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Where should we send your package?</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Receiver Full Name</label>
                  <input required name="fullName" onChange={handleInput} placeholder="Hassan Ali" className="w-full p-4 bg-white border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none shadow-inner font-bold text-slate-900 text-sm" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email for Receipt</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input 
                      required 
                      type="email"
                      name="email" 
                      value={form.email}
                      onChange={handleInput} 
                      placeholder="hassan@example.com" 
                      className="w-full pl-12 pr-4 py-4 bg-white border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none shadow-inner font-bold text-slate-900 text-sm" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Mobile</label>
                  <input required name="phone" onChange={handleInput} placeholder="0300 1234567" className="w-full p-4 bg-white border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none shadow-inner font-bold text-slate-900 text-sm" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">City / Region</label>
                  <input required name="city" onChange={handleInput} placeholder="Lahore" className="w-full p-4 bg-white border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none shadow-inner font-bold text-slate-900 text-sm" />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Street Address</label>
                  <input required name="address" onChange={handleInput} placeholder="Office 402, 4th Floor, Tech Hub..." className="w-full p-4 bg-white border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none shadow-inner font-bold text-slate-900 text-sm" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Postal Code</label>
                  <input required name="postalCode" onChange={handleInput} placeholder="54000" className="w-full p-4 bg-white border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none shadow-inner font-bold text-slate-900 text-sm" />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white border-2 border-slate-900 rounded-[2.5rem] p-8 shadow-[12px_12px_0px_#0f172a]">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-slate-900 p-2.5 rounded-xl text-white"><CreditCard size={20}/></div>
                <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">Secure Payment</h2>
              </div>

              <div className="space-y-4">
                <label className="flex items-center justify-between p-5 border-2 border-slate-900 rounded-[1.5rem] cursor-pointer bg-blue-50/50">
                  <div className="flex items-center gap-4">
                    <input type="radio" checked readOnly className="w-5 h-5 accent-slate-900" />
                    <span className="font-black text-slate-900 uppercase text-xs tracking-widest">Cash on Delivery</span>
                  </div>
                  <span className="text-[9px] font-black bg-slate-900 text-white px-3 py-1 rounded-full uppercase tracking-tighter">Verified</span>
                </label>
              </div>

              <div className="mt-10 pt-8 border-t-2 border-slate-50 space-y-5">
                <div className="flex justify-between font-bold text-slate-400 text-[10px] uppercase tracking-widest">
                  <span>Gross Subtotal</span>
                  <span className="text-slate-900 font-black">£{addCommas(subtotal)}</span>
                </div>
                
                {/* 👈 DYNAMIC SHIPPING DISPLAY FROM REDUX */}
                <div className="flex justify-between font-bold text-slate-400 text-[10px] uppercase tracking-widest">
                  <span>Standard Logistics</span>
                  <span className={`font-black ${shippingPrice === 0 ? "text-emerald-500" : "text-slate-900"}`}>
                    {shippingPrice === 0 ? "FREE" : `£${addCommas(shippingPrice)}`}
                  </span>
                </div>
                
                <div className="pt-6 border-t border-slate-100 flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Payable Amount</p>
                    <p className="text-5xl font-black text-slate-900 tracking-tighter italic">£{addCommas(totalPrice)}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full mt-10 bg-slate-900 text-white flex items-center justify-center gap-4 py-6 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.3em] hover:bg-blue-600 transition-all duration-500 disabled:bg-slate-200 shadow-xl shadow-blue-100"
              >
                {loading ? "Authorizing..." : (
                  <>Confirm & Ship Order <ArrowRight size={18} /></>
                )}
              </button>
            </div>

            <div className="flex gap-4">
              <div className="flex-1 p-5 bg-slate-50 rounded-3xl flex flex-col gap-3 border border-slate-100 group hover:bg-white hover:shadow-xl transition-all duration-500">
                <Box className="text-blue-600 group-hover:scale-110 transition-transform" size={24}/>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Discrete Packing</span>
              </div>
              <div className="flex-1 p-5 bg-slate-50 rounded-3xl flex flex-col gap-3 border border-slate-100 group hover:bg-white hover:shadow-xl transition-all duration-500">
                <Info className="text-blue-600 group-hover:scale-110 transition-transform" size={24}/>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Global Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;