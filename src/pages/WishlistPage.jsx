import React, { useEffect, useState } from "react";
import ProductCard from "../layouts/ProductCard";
import { wishlistAPI } from "../api/wishlistAPI";
import { Link, useNavigate } from "react-router-dom"; // navigate add kiya
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ArrowLeft, ArrowRight } from "lucide-react";
import Loader from "../layouts/Loader";

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadWishlist = async () => {
    // --- SAFE CHECK: Login nahi hai toh request mat bhejo ---
    const auth = localStorage.getItem("auth");
    if (!auth) {
      setLoading(false);
      navigate("/login"); // User ko login par bhej do
      return;
    }

    setLoading(true);
    try {
      const res = await wishlistAPI.get();
      if (res.ok) {
        setWishlist(res.wishlist || []);
      }
    } catch (err) {
      console.error("Wishlist error:", err);
      // toast.error("Failed to load wishlist"); // Isay silent rakhein taake loop logs na bharein
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader />
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 mt-6">
          Refreshing Archive
        </p>
      </div>
    );
  }

  // ... baaki ka return UI code wahi rahega jo aapne bheja tha ...
  return (
    <div className="min-h-screen bg-transparent text-gray-900 selection:bg-gray-100">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-12 pb-24">
        {/* ... (Your existing UI Code) ... */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Link 
            to="/" 
            className="inline-flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.3em] text-gray-400 hover:text-black transition-all mb-8 group"
          >
            <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
            Shop
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-gray-100 pb-8">
            <div>
              <h1 className="text-5xl md:text-7xl font-light tracking-tighter leading-none text-black mb-4">
                Wishlist <span className="italic font-serif text-gray-300">Edit</span>
              </h1>
              <p className="max-w-md text-gray-400 font-light text-sm leading-relaxed">
                Your curated pieces, integrated into your unique style.
              </p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-gray-300 hidden md:block">
              Archive — 0{wishlist.length}
            </span>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {wishlist.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 text-center">
              <Heart size={24} strokeWidth={1} className="mx-auto mb-4 text-gray-200" />
              <p className="text-xl font-light tracking-tight text-gray-300 mb-6">Archive is empty.</p>
              <Link to="/" className="text-[10px] font-bold uppercase tracking-widest border-b border-black pb-1">
                Browse Collection
              </Link>
            </motion.div>
          ) : (
            <motion.div 
              layout 
              initial="hidden" 
              animate="show" 
              variants={{ show: { transition: { staggerChildren: 0.05 } } }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12"
            >
              {wishlist.map((product) => (
                <motion.div layout key={product._id} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WishlistPage;