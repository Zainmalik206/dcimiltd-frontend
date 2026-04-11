import React from "react";
import { motion } from "framer-motion";
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Send,
  ArrowRight
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    quickLinks: [
      { name: "Home", href: "/" },
      { name: "About Us", href: "/aboutus" },
      { name: "Dashboard", href: "/dashboard" },
      { name: "Contact Us", href: "/contactus" },
    ],
    support: [
      { name: "FAQs", href: "/faqs" },
      { name: "Shipping Policy", href: "/shipping-policy" },
      { name: "Return Policy", href: "/returns-policy" },
      { name: "Terms & Conditions", href: "/terms-conditions" },
    ]
  };

  return (
    <footer className="relative bg-white border-t border-slate-100 pt-20 pb-10 overflow-hidden">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-20" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20">
          
          {/* Brand Identity Section */}
          <div className="lg:col-span-4 space-y-6">
            <motion.h2 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-3xl font-black text-slate-900 tracking-tighter"
            >
              𝓓𝓒 𝓘𝓜𝓘 <span className="text-indigo-600">𝓛𝓣𝓓</span>
            </motion.h2>
            <p className="text-slate-500 text-base leading-relaxed font-medium max-w-sm">
              Elevating your lifestyle with curated collections and seamless technology. 
              Quality, trust, and luxury — delivered to your doorstep.
            </p>
            <div className="flex items-center gap-3">
              {[
                { Icon: Facebook, href: "https://www.facebook.com/zain.hassan.276333" },
                { Icon: Instagram, href: "https://www.instagram.com/zayn_malik206" },
                { Icon: Twitter, href: "#" },
                { Icon: Linkedin, href: "https://www.linkedin.com/in/zainhassan206" }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  whileHover={{ y: -5, backgroundColor: '#4f46e5', color: '#fff' }}
                  href={social.href}
                  target="_blank"
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition-all shadow-sm"
                >
                  <social.Icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Company</h3>
              <ul className="space-y-4">
                {footerLinks.quickLinks.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="group text-slate-500 hover:text-indigo-600 font-medium transition-colors flex items-center gap-2">
                      <span className="w-0 h-px bg-indigo-600 transition-all group-hover:w-3" />
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-6">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Support</h3>
              <ul className="space-y-4">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="group text-slate-500 hover:text-indigo-600 font-medium transition-colors flex items-center gap-2">
                      <span className="w-0 h-px bg-indigo-600 transition-all group-hover:w-3" />
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="lg:col-span-4 space-y-6 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
            <h3 className="text-xl font-black text-slate-900">Join the Club</h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
              Subscribe to get exclusive early access to drops and premium offers.
            </p>
            <form className="relative group">
              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-white border-none rounded-2xl px-6 py-4 pr-14 text-sm font-bold text-slate-900 focus:ring-4 focus:ring-indigo-100 transition-all outline-none shadow-sm"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-indigo-600 transition-all active:scale-90 shadow-lg"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* Middle Divider with Logo */}
        <div className="mt-20 py-10 border-y border-slate-50 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex flex-col md:flex-row gap-6 md:gap-12">
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Location</p>
                  <p className="text-sm font-bold text-slate-900 leading-none">Lahore, PK</p>
                </div>
              </div>
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Call Us</p>
                  <p className="text-sm font-bold text-slate-900 leading-none">+92 310 7485703</p>
                </div>
              </div>
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Support</p>
                  <p className="text-sm font-bold text-slate-900 leading-none">hi@dcimiltd.com</p>
                </div>
              </div>
           </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm font-medium text-slate-400">
            © {currentYear} <span className="text-slate-900 font-bold">DC IMI LTD.</span> All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-[11px] font-black uppercase text-slate-400 hover:text-indigo-600 tracking-widest transition-colors">Privacy</a>
            <a href="#" className="text-[11px] font-black uppercase text-slate-400 hover:text-indigo-600 tracking-widest transition-colors">Cookies</a>
            <a href="#" className="text-[11px] font-black uppercase text-slate-400 hover:text-indigo-600 tracking-widest transition-colors">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}