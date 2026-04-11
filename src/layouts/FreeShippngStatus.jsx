import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const messages = [
  { text: "🚚 Free Shipping on orders over £75", color: "from-emerald-500 to-green-600" },
  { text: "💳 Secure Payment • Easy Returns", color: "from-indigo-500 to-blue-600" },
  { text: "🔥 Weekend Flash Sale — Don’t Miss Out on Hot Deals!", color: "from-red-500 to-orange-600" },
];

const FreeShippingStatus = () => {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleClose = () => setVisible(false);

  const current = messages[index];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="topbar"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`relative w-full bg-gradient-to-r ${current.color} text-white shadow-md`}
        >
          <div className="max-w-7xl mx-auto flex justify-center items-center py-2 px-4 text-sm md:text-base font-medium tracking-wide">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                {current.text}
              </motion.div>
            </AnimatePresence>

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition"
              aria-label="Close announcement bar"
            >
              <X size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FreeShippingStatus;
