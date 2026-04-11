import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import MetaData from "../layouts/MetaData";
import apis from "../config/apis";
import { Mail, MapPin, Send, CheckCircle, ChevronDown } from "lucide-react";

const Contactus = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "", 
    subject: "General Inquiry",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill in all required fields!");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${apis.contact}`, formData);
      setSuccessMsg(`Thank you, ${formData.name.split(" ")[0]}! We will get back to you soon.`);
      setFormData({ name: "", email: "", phone: "", subject: "General Inquiry", message: "" });
    } catch (error) {
      alert("Failed to send. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Google Maps Link
  const mapUrl = "https://www.google.com/maps/search/?api=1&query=Gulberg+III+Lahore+Pakistan";

  return (
    <div className="pt-32 bg-[#F9F8F6] text-[#1a1a1a] min-h-screen pb-20 px-6">
      <MetaData title="Contact — Studio DC IMI LTD" />

      <div className="max-w-6xl mx-auto">
        {!successMsg ? (
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            
            {/* --- LEFT: UPDATED INFO --- */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-5 space-y-12 py-5"
            >
              <div>
                <h1 className="text-7xl font-light tracking-tighter mb-4 italic font-serif">Reach Out.</h1>
                <p className="text-stone-500 text-lg leading-relaxed max-w-sm">
                  Whether it's a technical query or a partnership proposal, we are ready to listen.
                </p>
              </div>

              <div className="space-y-8">
                {/* EMAIL */}
                <motion.div whileHover={{ x: 10 }} className="flex items-center gap-5 group">
                  <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:bg-black group-hover:text-white transition-all duration-500">
                    <Mail size={22} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Email Us</p>
                    <p className="text-2xl font-bold">support@dcimiltd.com</p>
                  </div>
                </motion.div>

                {/* VISIT US (LINKED TO MAP) */}
                <motion.a 
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ x: 10 }} 
                  className="flex items-center gap-5 group cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:bg-black group-hover:text-white transition-all duration-500">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Visit Us</p>
                    <p className="text-2xl font-bold underline decoration-stone-200 group-hover:decoration-black transition-all">Gulberg III, Lahore, PK</p>
                  </div>
                </motion.a>
              </div>
            </motion.div>

            {/* --- RIGHT: THE FORM (Balanced Size) --- */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-7"
            >
              <form onSubmit={handleSubmit} className="bg-white p-10 md:p-14 rounded-[50px] shadow-2xl shadow-stone-200/50 border border-stone-100 space-y-10">
                
                <div className="grid md:grid-cols-2 gap-10">
                  <div className="group border-b-2 border-stone-100 pb-2 focus-within:border-black transition-all duration-500">
                    <label className="text-[12px] font-black uppercase tracking-widest text-stone-400 group-focus-within:text-black">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-transparent outline-none py-2 text-2xl font-bold placeholder:text-stone-100 uppercase"
                      placeholder="NAME"
                    />
                  </div>
                  <div className="group border-b-2 border-stone-100 pb-2 focus-within:border-black transition-all duration-500">
                    <label className="text-[12px] font-black uppercase tracking-widest text-stone-400 group-focus-within:text-black">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-transparent outline-none py-2 text-2xl font-bold placeholder:text-stone-100 uppercase"
                      placeholder="EMAIL"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                  <div className="group border-b-2 border-stone-100 pb-2 focus-within:border-black transition-all duration-500">
                    <label className="text-[12px] font-black uppercase tracking-widest text-stone-400 group-focus-within:text-black">Phone Number</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-transparent outline-none py-2 text-2xl font-bold placeholder:text-stone-100"
                      placeholder="+92..."
                    />
                  </div>
                  <div className="group border-b-2 border-stone-100 pb-2 focus-within:border-black transition-all duration-500 relative">
                    <label className="text-[12px] font-black uppercase tracking-widest text-stone-400 group-focus-within:text-black">Subject</label>
                    <div className="relative">
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full bg-transparent outline-none py-2 text-2xl font-bold appearance-none cursor-pointer pr-10 uppercase"
                      >
                        <option className="bg-white text-base py-4">General Inquiry</option>
                        <option className="bg-white text-base py-4">Support</option>
                        <option className="bg-white text-base py-4">Partnerships</option>
                        <option className="bg-white text-base py-4">Feedback</option>
                        <option className="bg-white text-base py-4">Other</option>
                      </select>
                      <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400 group-focus-within:text-black transition-all" size={24} />
                    </div>
                  </div>
                </div>

                <div className="group border-b-2 border-stone-100 pb-2 focus-within:border-black transition-all duration-500">
                  <label className="text-[12px] font-black uppercase tracking-widest text-stone-400 group-focus-within:text-black">Message</label>
                  <textarea
                    name="message"
                    rows="3"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full bg-transparent outline-none py-2 text-2xl font-bold resize-none placeholder:text-stone-100 uppercase"
                    placeholder="TELL US MORE..."
                  ></textarea>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: "#000" }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#111] text-white py-7 rounded-3xl text-[12px] font-black uppercase tracking-[0.6em] flex items-center justify-center gap-4 shadow-xl transition-all"
                >
                  {loading ? "SENDING..." : <>SEND ENQUIRY <Send size={16} /></>}
                </motion.button>
              </form>
            </motion.div>
          </div>
        ) : (
          /* SUCCESS SCREEN */
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <CheckCircle size={90} className="mb-6 text-black" />
            <h2 className="text-7xl font-black tracking-tighter mb-4 italic font-serif text-stone-400">Sent.</h2>
            <p className="text-2xl text-stone-500 font-light">{successMsg}</p>
            <button onClick={() => setSuccessMsg("")} className="mt-12 font-black uppercase border-b-2 border-black pb-1 tracking-widest text-[10px]">Send New Inquiry</button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Contactus;