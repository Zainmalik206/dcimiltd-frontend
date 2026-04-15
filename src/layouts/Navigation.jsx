import React, { useState, useRef, useEffect } from "react";
import { ShoppingBag, ShoppingCart, User, Menu, X, Search, Heart, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false); // Categories dropdown state
  const [searchTerm, setSearchTerm] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  const accountRef = useRef(null);
  const navigate = useNavigate();
  
  // Redux se products aur cart lena
  const { products } = useSelector((state) => state.prodSlice || { products: [] });
  const { cartItems } = useSelector((state) => state.cart || { cartItems: [] });
  const cartCount = cartItems?.length || 0;

  // Unique Categories nikalna
  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/aboutus" },
    { name: "Contact", href: "/contactus" },
  ];

  useEffect(() => {
    const clickOutside = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
      setMenuOpen(false);
    }
  };

  const handleCategoryClick = (cat) => {
    // Ye home page par filter set karne ke liye query param bhejega
    navigate(`/?category=${cat}`);
    setCatOpen(false);
    setMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-1" : "bg-white border-b py-2"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          
          {/* LOGO */}
          <motion.div whileHover={{ scale: 1.02 }} className="flex items-center space-x-2 cursor-pointer group">
            <Link to="/" className="flex items-center space-x-2">
              <div className="p-1.5 bg-orange-600 rounded-lg shadow-sm">
                  <ShoppingBag className="text-white" size={22} />
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">
                DC LMI <span className="text-orange-600">LTD</span>
              </h1>
            </Link>
          </motion.div>

          {/* SEARCH BAR (Desktop) */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 mx-8">
            <div className="relative w-full max-w-md mx-auto">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-full border border-gray-200 bg-gray-50 py-1.5 pl-10 pr-4 text-sm focus:bg-white focus:ring-1 focus:ring-gray-300 outline-none transition-all"
              />
              <Search className="absolute left-3.5 top-2.5 text-gray-400" size={16} />
            </div>
          </form>

          {/* RIGHT ICONS */}
          <div className="flex items-center space-x-5">
            <div ref={accountRef} className="relative hidden md:block">
              <motion.button
                whileHover={{ rotate: 15, scale: 1.1 }}
                onClick={() => setAccountOpen(!accountOpen)}
                className="text-slate-600 hover:text-orange-600 transition p-1"
              >
                <User size={22} />
              </motion.button>

              <AnimatePresence>
                {accountOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-3 w-40 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-50"
                  >
                    <Link to="/login" className="block px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-orange-50 hover:text-orange-600">Login</Link>
                    <Link to="/signup" className="block px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-orange-50 hover:text-orange-600 border-t border-gray-50">Sign Up</Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/wishlist" className="hidden md:block">
              <motion.div whileHover={{ scale: 1.2, color: "#ef4444" }} className="text-slate-600">
                <Heart size={22} />
              </motion.div>
            </Link>

            <Link to="/cart" className="relative group">
              <motion.div whileHover={{ y: -3, scale: 1.05 }} className="text-slate-700 group-hover:text-orange-600">
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-orange-600 text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center border border-white">
                    {cartCount}
                  </span>
                )}
              </motion.div>
            </Link>

            <button className="md:hidden text-slate-800 p-1" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* DESKTOP NAV LINKS */}
        <nav className="hidden md:flex justify-center items-center space-x-8 py-1">
          {navLinks.map((link) => (
            <Link key={link.name} className="relative text-xs font-bold text-slate-500 hover:text-slate-900 group uppercase tracking-widest" to={link.href}>
              {link.name}
              <span className="absolute -bottom-1 left-0 h-[2px] bg-orange-600 w-0 group-hover:w-full transition-all duration-300" />
            </Link>
          ))}

          {/* CATEGORIES DROPDOWN */}
          <div 
            className="relative group cursor-pointer"
            onMouseEnter={() => setCatOpen(true)}
            onMouseLeave={() => setCatOpen(false)}
          >
            <button className="flex items-center text-xs font-bold text-slate-500 hover:text-slate-900 uppercase tracking-widest">
              Categories <ChevronDown size={14} className="ml-1" />
            </button>
            
            <AnimatePresence>
              {catOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-0 mt-2 w-48 bg-white shadow-2xl rounded-xl py-3 z-[100] border border-gray-50"
                >
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryClick(cat)}
                      className="w-full text-left px-5 py-2 text-[10px] font-black uppercase tracking-wider text-slate-600 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    >
                      {cat}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden overflow-hidden bg-white border-t border-gray-100">
              <div className="flex flex-col space-y-4 px-4 py-6">
                <form onSubmit={handleSearch} className="relative w-full">
                  <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search..." className="w-full rounded-full border border-gray-100 bg-gray-50 py-2 pl-10 pr-4 text-sm outline-none" />
                  <Search className="absolute left-3.5 top-2.5 text-gray-400" size={16} />
                </form>
                {navLinks.map((link) => (
                  <Link key={link.name} to={link.href} onClick={() => setMenuOpen(false)} className="text-sm font-bold text-slate-700 py-2 border-b border-gray-50 uppercase tracking-wide">
                    {link.name}
                  </Link>
                ))}
                {/* Mobile Categories */}
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pt-2">Shop by Category</p>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <button key={cat} onClick={() => handleCategoryClick(cat)} className="text-left py-2 text-xs font-bold text-slate-600">
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}