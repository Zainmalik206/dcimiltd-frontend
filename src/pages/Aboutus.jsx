import React from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, Zap, Sparkles, 
  ArrowRight, Fingerprint, Compass, Diamond, Star 
} from "lucide-react";
import MetaData from "../layouts/MetaData";
import { Link } from "react-router-dom";

export default function AboutUs() {
  
  // 1. Snappy Slide-in from Left/Right
  const slideInLeft = {
    initial: { opacity: 0, x: -100 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { type: "spring", stiffness: 100, damping: 20, duration: 0.8 }
  };

  const slideInRight = {
    initial: { opacity: 0, x: 100 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { type: "spring", stiffness: 100, damping: 20, duration: 0.8 }
  };

  // 2. Jhatke wala Pop-up (Scale + Y)
  const snappyPop = {
    initial: { opacity: 0, scale: 0.8, y: 50 },
    whileInView: { opacity: 1, scale: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { type: "spring", stiffness: 120, damping: 12 }
  };

  return (
    <>
      <MetaData title="About Studio DC LMI LTD — Interactive Experience" />
      
      <section className="min-h-screen bg-[#FDFCFB] text-[#111] pt-32 pb-20 px-6 overflow-hidden">
        
        {/* --- Hero Section (Slide from Left) --- */}
        <motion.div 
          {...slideInLeft}
          className="max-w-7xl mx-auto border-b border-stone-200 pb-24"
        >
          <div className="flex items-center gap-4 mb-10">
            <span className="h-[1px] w-12 bg-stone-900"></span>
            <p className="text-[10px] font-black uppercase tracking-[0.6em] text-stone-400">
              The Evolution of Commerce
            </p>
          </div>
          
          <h1 className="text-[12vw] md:text-[9vw] font-light leading-[0.8] tracking-tighter mb-16">
            Studio <br />
            <span className="italic font-serif text-stone-300">Experience.</span>
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-end">
            <p className="text-xl md:text-2xl font-light leading-relaxed text-stone-500 max-w-xl">
              Beyond the transaction. A **living ecosystem** where high-fidelity code meets **uncompromising aesthetics**.
            </p>

            {/* --- ROLLER PAIYA (Rotating Badge) --- */}
            <motion.div 
              className="flex justify-start md:justify-end"
              whileHover={{ rotate: 5 }}
            >
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="bg-stone-900 text-white rounded-full w-40 h-40 flex items-center justify-center border border-stone-700 shadow-2xl relative"
                >
                    <span className="text-[8px] font-black uppercase tracking-[0.4em] absolute text-center">
                        DC LMI LTD <br/> Studio • 2026
                    </span>
                </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* --- Philosophy Grid (Alternate Sliding) --- */}
        <div className="max-w-7xl mx-auto py-40 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
                { icon: Fingerprint, title: "Authentic Trace", desc: "100% Genuine guaranteed.", anim: slideInLeft },
                { icon: Compass, title: "Curated Path", desc: "We define the trends.", anim: snappyPop },
                { icon: Diamond, title: "Digital Luxury", desc: "Fast, fluid, and intuitive.", anim: slideInRight }
            ].map((item, i) => (
                <motion.div 
                  key={i}
                  {...item.anim}
                  className="group p-10 bg-white rounded-[40px] border border-stone-100 shadow-sm hover:shadow-xl transition-shadow"
                >
                    <div className="bg-stone-900 text-white w-14 h-14 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#D4AF37] transition-colors duration-500">
                        <item.icon strokeWidth={1} size={24} />
                    </div>
                    <h3 className="text-xs font-black uppercase tracking-[0.4em] mb-4">{item.title}</h3>
                    <p className="text-stone-500 font-light text-sm">{item.desc}</p>
                </motion.div>
            ))}
        </div>

        {/* --- Stats Banner (Full Reveal Slide) --- */}
        <motion.div 
            initial={{ opacity: 0, scaleY: 0 }}
            whileInView={{ opacity: 1, scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="bg-stone-900 text-white rounded-[60px] py-32 px-12 mb-32 origin-bottom"
        >
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-16">
                {["50k+", "24h", "4.9", "99%"].map((val, i) => (
                    <motion.div 
                      key={i}
                      initial={{ y: 50, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 + (i * 0.1) }}
                      className="text-center"
                    >
                        <h4 className="text-6xl font-light tracking-tighter text-stone-100">{val}</h4>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-500 mt-2">Achievement</p>
                    </motion.div>
                ))}
            </div>
        </motion.div>

        {/* --- Feature Banners (Horizontal Slide-in) --- */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 mb-40">
            <motion.div 
               {...slideInLeft}
               className="bg-[#F9F8F6] p-16 rounded-[60px] border border-stone-200"
            >
                <ShieldCheck size={60} strokeWidth={0.5} className="mb-10 text-stone-800" />
                <h3 className="text-4xl font-light mb-6 tracking-tight italic font-serif">Encrypted Trust.</h3>
                <p className="text-stone-500 font-light leading-relaxed text-lg">
                  Proprietary algorithms protecting your identity and every transaction.
                </p>
            </motion.div>

            <motion.div 
               {...slideInRight}
               className="bg-stone-900 text-white p-16 rounded-[60px]"
            >
                <Zap size={60} strokeWidth={0.5} className="mb-10 text-amber-400" />
                <h3 className="text-4xl font-light mb-6 tracking-tight italic font-serif text-stone-200">Instant Logic.</h3>
                <p className="text-stone-400 font-light leading-relaxed text-lg">
                  Zero latency from click to courier. Optimized for the modern pace.
                </p>
            </motion.div>
        </div>

        {/* --- Final CTA (Snappy Scale-in) --- */}
        <motion.div 
            {...snappyPop}
            className="max-w-5xl mx-auto bg-stone-50 border border-stone-200 rounded-[70px] p-24 text-center shadow-2xl shadow-stone-100"
        >
            <h2 className="text-5xl md:text-8xl font-light tracking-tighter mb-12">
                Elevate <br />
                <span className="italic font-serif text-stone-400 lowercase">Everyday.</span>
            </h2>
            <Link 
              to="/" 
              className="group inline-flex items-center gap-6 bg-stone-900 text-white py-8 px-20 rounded-full text-[11px] font-black uppercase tracking-[0.5em] hover:bg-black transition-all"
            >
              Enter Collection
              <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </Link>
        </motion.div>
      </section>
    </>
  );
}