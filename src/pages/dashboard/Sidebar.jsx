import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import { X, Globe, Clock, LayoutGrid, Zap, ShieldCheck } from "lucide-react";

const SidebarItem = ({ item, setOpen, darkMode }) => (
  <NavLink
    to={item.path}
    className={({ isActive }) =>
      `flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 group relative
       ${isActive 
         ? darkMode 
           ? "bg-indigo-500/10 text-indigo-400 font-bold" 
           : "bg-indigo-600 text-white shadow-[0_10px_20px_-5px_rgba(79,70,229,0.4)] font-bold"
         : darkMode 
           ? "text-slate-400 hover:bg-slate-800/50 hover:text-white" 
           : "text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
       }`
    }
    onClick={() => setOpen(false)}
  >
    {/* Active Indicator Line */}
    {({ isActive }) => (
      <>
        <motion.div 
          className="flex items-center gap-3 w-full z-10"
          whileHover={{ x: 4 }}
        >
          <item.icon size={19} className={`transition-transform duration-300 group-hover:scale-110`} />
          <span className="text-[13.5px] tracking-tight">{item.name}</span>
        </motion.div>
        
        {isActive && (
          <motion.div 
            layoutId="activeTab"
            className="absolute inset-0 rounded-2xl bg-indigo-600 -z-0"
            initial={false}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}
      </>
    )}
  </NavLink>
);

export default function Sidebar({ menuItems = [], open, setOpen, darkMode, pktTime, country }) {
  
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [open]);

  if (!menuItems || menuItems.length === 0) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Subtle Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]"
          />

          {/* Main Sidebar */}
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 250, damping: 32 }}
            className={`fixed top-0 left-0 h-full w-[290px] z-[70] flex flex-col shadow-[20px_0_50px_rgba(0,0,0,0.1)]
              ${darkMode 
                ? "bg-slate-900 border-r border-slate-800" 
                : "bg-white border-r border-slate-100"}
            `}
          >
            {/* Header / Brand */}
            <div className="p-8 pb-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                  <Zap size={22} className="text-white fill-white" />
                </div>
                <h2 className={`text-2xl font-black tracking-tighter ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  DC LMI<span className="text-indigo-600 font-medium"> LTD</span>
                </h2>
              </div>
              
              <button
                onClick={() => setOpen(false)}
                className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-slate-800 text-slate-500' : 'hover:bg-slate-50 text-slate-400'}`}
              >
                <X size={20} />
              </button>
            </div>

            {/* Status Section */}
            <div className="px-6 py-4">
              <div className={`p-4 rounded-[20px] ${darkMode ? 'bg-slate-800/40 border border-slate-700/50' : 'bg-slate-50 border border-slate-100'}`}>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Network Status</span>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-bold text-emerald-500 uppercase">Live</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                      <Clock size={14} className="text-indigo-500" /> {pktTime} PKT
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                      <Globe size={14} className="text-indigo-500" /> PK
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 mt-2 space-y-1 overflow-y-auto scrollbar-hide">
               <p className="text-[10px] uppercase font-black tracking-[0.2em] px-4 mb-4 text-slate-400">Management</p>
               {menuItems.map((item) => (
                <SidebarItem key={item.name} item={item} setOpen={setOpen} darkMode={darkMode} />
               ))}
            </nav>

            {/* Bottom Footer Section */}
            <div className="p-6 mt-auto">
              <div className={`p-4 rounded-2xl border ${darkMode ? 'border-slate-800 bg-slate-800/20' : 'border-indigo-100 bg-indigo-50/30'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600/10 flex items-center justify-center">
                    <ShieldCheck size={18} className="text-indigo-600" />
                  </div>
                  <div>
                    <p className={`text-[11px] font-black uppercase ${darkMode ? 'text-slate-300' : 'text-slate-800'}`}>Admin Access</p>
                    <p className="text-[10px] text-slate-400 font-medium">Verified Session</p>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-center mt-6 font-bold text-slate-400 uppercase tracking-tighter">
                © {new Date().getFullYear()} <i>DC LMI LTD</i> Terminal
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}