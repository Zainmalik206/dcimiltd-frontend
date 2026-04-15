import React, { useState, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom"; // Add this
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Countdown from 'react-countdown';
import { ShoppingBag, ArrowRight, Sparkles, Fingerprint, Globe, Zap, Star, ShieldCheck } from "lucide-react";
import MetaData from "../layouts/MetaData";
import Loader from "../layouts/Loader";
import ProductCard from "../layouts/ProductCard";
import { fetchProducts } from "../redux/actions/prodActions";
import HeroSlider from "../layouts/HeroSlider";

const Home = () => {
  const dispatch = useDispatch();
  const location = useLocation(); // URL monitor karne ke liye
  const { products, loading } = useSelector((state) => state.prodSlice);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const targetRef = useRef(null);

  const { scrollYProgress } = useScroll({ target: targetRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // URL Query Params check karein (Navbar clicks ke liye)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get("category");
    if (cat) {
      setSelectedCategory(cat);
      // Scroll to products section automatically
      const section = document.getElementById("collection-section");
      if (section) section.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  const categories = useMemo(() => {
    if (!products || products.length === 0) return ["All"];
    return ["All", ...new Set(products.map((p) => p.category))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return selectedCategory === "All" ? products : products.filter((p) => p.category === selectedCategory);
  }, [products, selectedCategory]);

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-[#F0F4F8]"><Loader /></div>;

  return (
    <div className="bg-[#F0F4F8] text-[#0F172A] font-sans selection:bg-blue-100 overflow-x-hidden">
      <MetaData title="DC IMI LTD | Sapphire Edition" />

      <div className="bg-[#002366] text-[#E2E8F0] text-[10px] font-black uppercase tracking-[0.4em] py-2.5 text-center shadow-xl">
        <motion.span animate={{ opacity: [0.6, 1, 0.6] }} transition={{ repeat: Infinity, duration: 3 }}>
          Summer Season Drop — The New Collection is Now Live
        </motion.span>
      </div>

      <HeroSlider
        products={products}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
      />

      {/* Infinite Brand Slider */}
      <div className="py-12 bg-white/40 border-b border-blue-100 overflow-hidden relative">
        <motion.div 
          animate={{ x: [0, -1000] }} 
          transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
          className="flex space-x-20 whitespace-nowrap w-max"
        >
          {[...['Petronas', 'PLUMBEZ', 'VITCAS', 'YONEX', 'PIGEON', 'NIKE', 'HENCKELS', 'ROLEX'], 
            ...['Petronas', 'PLUMBEZ', 'VITCAS', 'YONEX', 'PIGEON', 'NIKE', 'HENCKELS', 'ROLEX']].map((brand, i) => (
            <span key={i} className="text-4xl md:text-5xl font-black text-blue-200/50 uppercase tracking-tighter hover:text-[#0047AB] transition-all duration-500 cursor-default">
              {brand}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Value Props */}
      <section className="py-20 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        {[
          { icon: <Fingerprint size={20} />, title: "Unique Design", desc: "Crafted for individuals" },
          { icon: <Globe size={20} />, title: "Sustainably Sourced", desc: "Eco-friendly materials" },
          { icon: <Sparkles size={20} />, title: "Premium Finish", desc: "Unmatched quality" },
          { icon: <ShieldCheck size={20} />, title: "Secure Checkout", desc: "100% Protected" }
        ].map((item, i) => (
          <motion.div whileHover={{ y: -5 }} key={i} className="group p-6 rounded-3xl hover:bg-white hover:shadow-xl transition-all duration-500">
            <div className="text-[#0066b2] mb-4">{item.icon}</div>
            <h3 className="font-black uppercase text-[11px] tracking-widest mb-1">{item.title}</h3>
            <p className="text-slate-400 text-xs">{item.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Main Collection Section */}
      <section id="collection-section" className="py-12 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-5xl md:text-4xl font-black tracking-tighter text-[#002366] uppercase leading-[0.8]">
              FIND YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0047AB] to-[#00BFFF]">INTEREST</span>
            </h2>
          </div>
          
          {/* Lava Effect Switcher */}
          <div className="flex flex-wrap justify-center gap-2 relative p-1 bg-blue-50/50 rounded-full border border-blue-100">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`relative px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all z-10 ${
                  selectedCategory === cat ? "text-white" : "text-slate-500"
                }`}
              >
                {selectedCategory === cat && (
                  <motion.div layoutId="lava-bg" className="absolute inset-0 bg-[#002366] rounded-full -z-10" />
                )}
                {cat}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={product._id}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Lookbook & Footer logic remains same as per your original file */}
      <section ref={targetRef} className="py-32 bg-white relative overflow-hidden border-t border-blue-50">
          {/* ... original lookbook code ... */}
      </section>

      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="mx-auto mb-20 flex flex-col items-center gap-4 group"
      >
        <div className="w-12 h-12 rounded-full border border-blue-100 flex items-center justify-center transition-all group-hover:border-transparent">
          <ArrowRight className="-rotate-90" size={18} />
        </div>
        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-blue-300">Return to Horizon</span>
      </motion.button>
    </div>
  );
};

export default Home;