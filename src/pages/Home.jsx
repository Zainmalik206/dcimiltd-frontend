import React, { useState, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  const { products, loading, error } = useSelector((state) => state.prodSlice);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const targetRef = useRef(null);

  // Parallax Effect for the Lookbook section
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

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

      {/* 1. CINEMATIC TOP TICKER (Sapphire Theme) */}
      <div className="bg-[#002366] text-[#E2E8F0] text-[10px] font-black uppercase tracking-[0.4em] py-2.5 text-center shadow-xl border-b border-blue-900/50">
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

     {/* 2. SEAMLESS INFINITE BRAND SLIDER */}
<div className="py-12 bg-white/40 border-b border-blue-100 overflow-hidden relative">
  {/* Soft fade effect edges par (Optional: for cinematic look) */}
  <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#F0F4F8] to-transparent z-10" />
  <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#F0F4F8] to-transparent z-10" />

  <motion.div 
    animate={{ x: [0, -1000] }} 
    transition={{ 
      repeat: Infinity, 
      duration: 12, // Speed tez kar di (30 se 12 par)
      ease: "linear" 
    }}
    className="flex space-x-20 whitespace-nowrap w-max"
  >
    {/* Array ko double kiya taake loop seamless rahay */}
    {[...['Petronas', 'PLUMBEZ', 'VITCAS', 'YONEX', 'PIGEON', 'NIKE', 'HENCKELS', 'ROLEX'], 
      ...['Petronas', 'PLUMBEZ', 'VITCAS', 'YONEX', 'PIGEON', 'NIKE', 'HENCKELS', 'ROLEX']].map((brand, i) => (
      <span 
        key={i} 
        className="text-4xl md:text-5xl font-black text-blue-200/50 uppercase tracking-tighter hover:text-[#0047AB] transition-all duration-500 cursor-default inline-block"
      >
        {brand}
      </span>
    ))}
  </motion.div>
</div>

      {/* 3. VALUE PROPS */}
      <section className="py-20 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        {[
          { icon: <Fingerprint size={20} />, title: "Unique Design", desc: "Crafted for individuals" },
          { icon: <Globe size={20} />, title: "Sustainably Sourced", desc: "Eco-friendly materials" },
          { icon: <Sparkles size={20} />, title: "Premium Finish", desc: "Unmatched quality" },
          { icon: <ShieldCheck size={20} />, title: "Secure Checkout", desc: "100% Protected" }
        ].map((item, i) => (
          <motion.div whileHover={{ y: -5 }} key={i} className="group p-6 rounded-3xl hover:bg-white hover:shadow-xl hover:shadow-blue-100 transition-all duration-500 border border-transparent hover:border-blue-50">
            <div className="text-[#0066b2] mb-4">{item.icon}</div>
            <h3 className="font-black uppercase text-[11px] tracking-widest mb-1">{item.title}</h3>
            <p className="text-slate-400 text-xs">{item.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* 4. FLASH SALE COUNTDOWN (Sapphire Blue Gradient) */}
      <section className="mx-6 lg:mx-auto max-w-7xl mb-24 p-12 rounded-[3rem] bg-gradient-to-br from-[#002366] via-[#0047AB] to-[#0066b2] text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/20 blur-[100px] rounded-full" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <span className="text-blue-200 font-black uppercase tracking-widest text-[10px] opacity-80">Season Drop Live</span>
            <h2 className="text-4xl font-black tracking-tighter uppercase mt-2">OUR Midnight Sale</h2>
          </div>
          <Countdown 
            date={Date.now() + 500000000} 
            renderer={({ days, hours, minutes, seconds }) => (
              <div className="flex gap-4">
                {[days, hours, minutes, seconds].map((v, i) => (
                  <div key={i} className="flex flex-col items-center bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20">
                    <span className="text-3xl font-black tracking-tighter text-white">{v}</span>
                    <span className="text-[8px] uppercase font-bold text-blue-200"> {['Days', 'Hrs', 'Min', 'Sec'][i]}</span>
                  </div>
                ))}
              </div>
            )}
          />
        </div>
      </section>

      {/* 5. MAIN COLLECTION */}
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-5xl md:text-4xl font-black tracking-tighter text-[#002366] uppercase leading-[0.8]">
              FIND YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0047AB] to-[#00BFFF]">INTEREST</span>
            </h2>
          </div>
          {/* Lava Effect Category Switcher - Sapphire Version */}
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

      {/* 6. LOOKBOOK (Sapphire Parallax) */}
      <section ref={targetRef} className="py-32 bg-white relative overflow-hidden border-t border-blue-50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div style={{ y }} className="relative rounded-[3rem] overflow-hidden shadow-2xl group border-[12px] border-blue-50/50">
            <img 
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000" 
              alt="Luxury lifestyle"
              className="w-full aspect-[4/5] object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#002366]/80 to-transparent" />
            <div className="absolute bottom-10 left-10 text-white">
              <p className="text-[10px] font-black tracking-[0.3em] uppercase mb-2">Deep Sea Drop</p>
              <h3 className="text-3xl font-black uppercase tracking-tighter">Art of Depth</h3>
            </div>
          </motion.div>

          <div className="space-y-8">
            <span className="text-[#0047AB] font-black uppercase tracking-[0.4em] text-[10px]">Sapphire Heritage</span>
            <h2 className="text-6xl md:text-8xl font-black text-[#002366] leading-[0.85] tracking-tighter uppercase">
              Beyond <br /> The <br /> <span className="italic text-blue-100">Surface</span>
            </h2>
            <p className="text-lg text-slate-500 max-w-sm leading-relaxed">
              Experience the clarity of premium design. Our Sapphire drop focuses on the intersection of deep aesthetics and raw performance.
            </p>
            <motion.button 
              whileHover={{ x: 10, color: "#0047AB" }}
              className="flex items-center text-xs font-black uppercase tracking-widest text-[#002366] border-b-2 border-[#0047AB] pb-2"
            >
              Explore the Depths <ArrowRight className="ml-3" size={16} />
            </motion.button>
          </div>
        </div>
      </section>

      {/* 7. FLOATING BACK TO TOP (Sapphire Theme) */}
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