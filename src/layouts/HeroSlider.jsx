import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { addCommas } from "../functions/func";

const HeroSlider = ({
  products = [],
  selectedCategory,
}) => {
  const navigate = useNavigate();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const sliderIntervalRef = useRef(null);

  const sliderProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    return selectedCategory === "All"
      ? products.slice(0, 7)
      : products
          .filter(
            (p) =>
              p.category &&
              p.category.toLowerCase().trim() ===
                selectedCategory.toLowerCase().trim()
          )
          .slice(0, 6);
  }, [products, selectedCategory]);

  const currentProduct = sliderProducts[currentSlideIndex];

  useEffect(() => {
    setCurrentSlideIndex(0);
    if (sliderIntervalRef.current) clearInterval(sliderIntervalRef.current);

    if (sliderProducts.length < 2) return;

    sliderIntervalRef.current = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % sliderProducts.length);
    }, 5000);

    return () => clearInterval(sliderIntervalRef.current);
  }, [selectedCategory, sliderProducts.length]);

  const nextSlide = () => {
    if (sliderProducts.length > 0)
      setCurrentSlideIndex((prev) => (prev + 1) % sliderProducts.length);
  };

  const prevSlide = () => {
    if (sliderProducts.length > 0)
      setCurrentSlideIndex(
        (prev) => (prev - 1 + sliderProducts.length) % sliderProducts.length
      );
  };

  const handleShopNow = () => {
    if (currentProduct?._id) {
      navigate(`/products/${currentProduct._id}`);
    }
  };

  return (
    <section className="relative z-0 w-full h-[70vh] md:h-[75vh] lg:h-[65vh] overflow-hidden bg-gradient-to-br from-[#F0F7FF] via-[#E0EFFF] to-[#F8FAFC] flex items-center justify-center">

      {/* Background Soft Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[60%] bg-blue-200/30 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[60%] bg-yellow-100/40 blur-[120px] rounded-full" />

      {/* Main Content */}
      <div className="relative w-full h-full flex flex-col-reverse md:flex-row items-center justify-center p-6 z-20 max-w-7xl mx-auto">

        {/* Details Section */}
        <div className="text-center md:text-left w-full md:w-1/2 p-4 md:p-8">
          <AnimatePresence mode="wait">
            {currentProduct && (
              <motion.div
                key={`hero-details-${selectedCategory}-${currentSlideIndex}`}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.7, ease: "circOut" }}
                className="text-[#0F172A]"
              >
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 mb-4 block">Exclusive Drop</span>
                <h1 className="text-4xl md:text-6xl font-black mb-4 leading-[0.9] uppercase tracking-tighter">
                  {currentProduct.title || "Elite Collection"}
                </h1>
                <p className="text-sm md:text-base mb-8 text-slate-500 max-w-md mx-auto md:mx-0 font-medium leading-relaxed">
                  {currentProduct.description
                    ? currentProduct.description.substring(0, 120) + "..."
                    : "Experience the pinnacle of craft and design in our latest limited edition series."}
                </p>
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <p className="text-3xl font-black text-[#B48C1D]">
                    <span className="text-xs mr-1 opacity-60">£</span>{addCommas(currentProduct.price)}
                  </p>
                  <motion.button
                    className="bg-[#002366] text-white font-black uppercase tracking-[0.2em] py-4 px-10 rounded-full text-[10px] shadow-xl hover:shadow-blue-200 transition-all"
                    whileHover={{ scale: 1.05, backgroundColor: "#003399" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleShopNow}
                  >
                    Discover Now
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Image Section */}
        <div className="relative w-full md:w-1/2 flex items-center justify-center h-1/2 md:h-full">
          <AnimatePresence mode="wait">
            {currentProduct && (
              <motion.img
                key={`hero-image-${selectedCategory}-${currentSlideIndex}`}
                src={currentProduct.images?.[0]?.url || "https://via.placeholder.com/800x600"}
                alt={currentProduct.title}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="w-auto h-full max-h-[85%] md:max-h-[85%] object-contain z-20"
                style={{ filter: "drop-shadow(0 30px 40px rgba(0, 35, 102, 0.15))" }}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrows */}
      {sliderProducts.length > 1 && (
        <>
          <motion.button
            onClick={prevSlide}
            className="absolute left-8 top-1/2 transform -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full border border-slate-200 bg-white/50 backdrop-blur-md text-slate-400 hover:text-[#002366] hover:border-[#002366] transition-all z-30"
            whileHover={{ scale: 1.1 }}
          >
            <ChevronLeft size={20} />
          </motion.button>
          <motion.button
            onClick={nextSlide}
            className="absolute right-8 top-1/2 transform -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full border border-slate-200 bg-white/50 backdrop-blur-md text-slate-400 hover:text-[#002366] hover:border-[#002366] transition-all z-30"
            whileHover={{ scale: 1.1 }}
          >
            <ChevronRight size={20} />
          </motion.button>
        </>
      )}

      {/* Slider Progress Bar (New subtle feature) */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/30 z-40">
        <motion.div 
          key={currentSlideIndex}
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 5, ease: "linear" }}
          className="h-full bg-[#B48C1D]"
        />
      </div>
    </section>
  );
};

export default HeroSlider;