import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeItemFromCart, increaseItemQty, decreaseItemQty, clearCartItems } from "../redux/actions/cartActions";
import { X, Minus, Plus, ArrowRight, Trash2, ShieldCheck, RefreshCcw, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { addCommas } from "../functions/func";
import MetaData from "../layouts/MetaData";

const Cart = () => {
  const { cartItems, subtotal, shippingPrice, totalPrice } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  return (
    <div className="pt-32 bg-[#FBFBFC] min-h-screen pb-24 px-8">
      <MetaData title="Shopping Cart — DC IMI LTD" />
      
      <div className="max-w-7xl mx-auto">
        {/* REFINED HEADER */}
        <div className="flex items-baseline justify-between mb-12 border-b border-gray-100 pb-6">
          <div className="flex items-baseline gap-4">
            <h1 className="text-3xl font-light tracking-tight text-gray-900">Your Cart</h1>
            <span className="text-sm text-gray-400 font-medium">({cartItems.length} items)</span>
          </div>
          <button 
            onClick={() => dispatch(clearCartItems())}
            className="text-[11px] font-medium uppercase tracking-widest text-gray-400 hover:text-red-500 flex items-center gap-1.5 transition-colors"
          >
            <Trash2 size={13} /> Clear Selection
          </button>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* --- LEFT: CLEAN ITEM LIST --- */}
          <div className="lg:col-span-8 space-y-4">
            <AnimatePresence mode="popLayout">
              {cartItems.map((item) => (
                <motion.div 
                  key={item._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="group relative flex flex-col md:flex-row items-center gap-8 bg-white p-6 rounded-3xl border border-gray-50 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-all duration-500"
                >
                  {/* Image Area */}
                  <div className="w-28 h-28 bg-[#F9F9F9] rounded-2xl flex-shrink-0 overflow-hidden">
                    <img 
                      src={item.images?.[0]?.url || item.images?.[0]} 
                      alt={item.title} 
                      className="w-full h-full object-contain p-3 mix-blend-multiply group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-grow space-y-1">
                    <h3 className="text-lg font-medium text-gray-800 tracking-tight">{item.title}</h3>
                    <p className="text-gray-400 text-[11px] uppercase tracking-wider">Product ID: {item._id.slice(-6).toUpperCase()}</p>
                    <p className="text-lg font-semibold text-gray-900 pt-2">£ {addCommas(item.price)}</p>
                  </div>

                  {/* Qty & Line Total */}
                  <div className="flex items-center gap-10">
                    <div className="flex items-center bg-white border border-gray-100 rounded-full px-2 py-1 shadow-sm">
                      <button onClick={() => dispatch(decreaseItemQty(item._id))} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-black transition-all"><Minus size={14}/></button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => dispatch(increaseItemQty(item._id))} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-black transition-all"><Plus size={14}/></button>
                    </div>
                    
                    <div className="text-right w-24">
                        <p className="text-lg font-medium text-gray-900">£{addCommas(item.price * item.quantity)}</p>
                    </div>

                    <button 
                      onClick={() => dispatch(removeItemFromCart(item._id))}
                      className="absolute top-6 right-6 md:static text-gray-200 hover:text-red-400 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* TRUST INDICATORS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-10">
                <div className="flex items-center gap-3 p-5 bg-transparent border border-gray-100 rounded-2xl">
                    <Truck size={18} className="text-gray-400" />
                    <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Fast Delivery</span>
                </div>
                <div className="flex items-center gap-3 p-5 bg-transparent border border-gray-100 rounded-2xl">
                    <RefreshCcw size={18} className="text-gray-400" />
                    <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">7 Day Easy Returns</span>
                </div>
                <div className="flex items-center gap-3 p-5 bg-transparent border border-gray-100 rounded-2xl">
                    <ShieldCheck size={18} className="text-gray-400" />
                    <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Secure Payment</span>
                </div>
            </div>
          </div>

          {/* --- RIGHT: REFINED SUMMARY --- */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-[32px] p-10 sticky top-32 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-50">
              <h2 className="text-xl font-medium text-gray-900 mb-8">Summary</h2>
              
              <div className="space-y-5 mb-8">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span className="text-gray-900 font-medium">£{addCommas(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium tracking-tight">
                    {shippingPrice === 0 ? "Free" : `£${addCommas(shippingPrice)}`}
                  </span>
                </div>
                
                <div className="h-[1px] bg-gray-50 my-4"></div>
                
                <div className="flex justify-between items-baseline pt-2">
                  <span className="text-sm font-medium text-gray-900">Total</span>
                  <p className="text-3xl font-bold text-gray-900 tracking-tight">£{addCommas(totalPrice)}</p>
                </div>
              </div>

              <Link 
                to="/checkout" 
                className="w-full bg-gray-900 text-white flex items-center justify-center gap-3 py-5 rounded-2xl text-[13px] font-medium tracking-wide hover:bg-black transition-all duration-300 shadow-xl shadow-gray-100 group"
              >
                Checkout <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <p className="mt-6 text-center text-[11px] text-gray-400 leading-relaxed font-medium">
                Taxes and shipping calculated at checkout.<br/>
                All transactions are secure and encrypted.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;