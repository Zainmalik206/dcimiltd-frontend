import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Heart, Star } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { addCommas } from "../functions/func";
import { wishlistAPI } from "../api/wishlistAPI";
import { successToast } from "../functions/toastify";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((s) => s.cart);
  const { _id, images = [], title, brand, price, stock, ratings } = product;

  const cartItem = cartItems.find((i) => i._id === _id);
  const cartQty = cartItem?.quantity || 0;

  const [inWishlist, setInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await wishlistAPI.get();
        if (res.ok && isMounted) {
          // Check if current product is in the wishlist array
          const exists = res.wishlist?.some((item) => (item._id === _id || item === _id));
          setInWishlist(!!exists);
        }
      } catch (e) {
        console.error("Wishlist load error:", e);
      }
    })();
    return () => { isMounted = false; };
  }, [_id]);

  const toggleWishlist = async (e) => {
    e.stopPropagation();
    if (loading) return;
    setLoading(true);
    
    const res = inWishlist ? await wishlistAPI.remove(_id) : await wishlistAPI.add(_id);
    
    if (res.ok) {
      setInWishlist(!inWishlist);
      successToast(inWishlist ? "Removed from wishlist" : "Added to wishlist");
    }
    setLoading(false);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (cartQty < stock) {
      dispatch(addToCart(product));
    } else {
      toast.error(`Stock limit reached`);
    }
  };

  const mainImage = images[0]?.url || "/placeholder.png";
  const hoverImage = images[1]?.url || mainImage;

  return (
    <motion.div
      onClick={() => navigate(`/products/${_id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white rounded-[1.5rem] overflow-hidden transition-all duration-500 hover:shadow-[0_25px_50px_-12px_rgba(0,35,102,0.15)] cursor-pointer border border-slate-100 hover:border-blue-50"
    >
      <div className="relative aspect-[4/5] bg-[#f8faff] overflow-hidden">
        <motion.img
          src={mainImage}
          alt={title}
          className="absolute inset-0 w-full h-full object-contain p-6"
          animate={{ scale: isHovered ? 1.08 : 1, opacity: isHovered && images[1] ? 0 : 1 }}
          transition={{ duration: 0.6, ease: "circOut" }}
        />

        {images[1] && (
          <motion.img
            src={hoverImage}
            alt={title}
            className="absolute inset-0 w-full h-full object-contain p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1.08 : 1 }}
            transition={{ duration: 0.6, ease: "circOut" }}
          />
        )}

        <button
          onClick={toggleWishlist}
          className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-md z-10 transition-all duration-300 ${
            inWishlist ? "bg-red-50 text-red-500 shadow-md" : "bg-white/90 text-slate-400 hover:text-red-500 shadow-sm"
          }`}
        >
          <Heart size={16} fill={inWishlist ? "currentColor" : "none"} />
        </button>

        {stock - cartQty <= 0 && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center z-20">
            <span className="bg-slate-900 text-white text-[9px] font-black uppercase tracking-[0.3em] px-5 py-2.5 rounded-full shadow-2xl">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-4 md:p-5">
        <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-1 opacity-80">
          {brand || "Premium Brand"}
        </p>

        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-slate-800 text-sm md:text-base leading-tight truncate pr-2">
            {title}
          </h3>
          <div className="flex items-center gap-0.5 whitespace-nowrap">
            <Star size={12} className="fill-yellow-400 text-yellow-400" />
            <span className="text-[11px] font-black text-slate-400">{ratings || "5.0"}</span>
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-4">
          <div className="flex items-baseline gap-1">
            <span className="text-[10px] font-bold text-slate-400">£</span>
            <span className="text-xl font-black text-[#002366] leading-none">
              {addCommas(price)}
            </span>
          </div>

          <motion.button
            whileHover={{ y: -2, backgroundColor: "#003399" }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            disabled={stock - cartQty <= 0}
            className={`w-full py-3.5 rounded-full flex items-center justify-center gap-2 transition-all duration-300 font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-blue-100 ${
              stock - cartQty <= 0 
              ? "bg-slate-100 text-slate-300 cursor-not-allowed shadow-none" 
              : "bg-[#002366] text-white"
            }`}
          >
            <ShoppingBag size={14} strokeWidth={3} />
            <span>Add to Cart</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;