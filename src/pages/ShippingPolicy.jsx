import React from "react";
import { motion } from "framer-motion";
import { Truck } from "lucide-react";

export default function ShippingPolicy() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl mx-auto py-16 px-6"
    >
      <div className="flex flex-col items-center mb-10">
        <Truck size={42} className="text-orange-600 mb-3" />
        <h1 className="text-4xl font-bold text-gray-800">Shipping Policy</h1>
        <p className="text-gray-500 mt-2 text-center">
          Transparent and reliable delivery with DC IMI LTD 🚚
        </p>
      </div>

      <div className="space-y-5 text-gray-700 leading-relaxed">
        <p>
          At DC IMI LTD, we aim to deliver your products quickly and safely. All
          orders are processed within <strong>1–2 business days</strong>.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6">Delivery Time</h2>
        <p>
          Domestic shipping usually takes <strong>3–7 business days</strong>.
          For remote locations, delivery may take slightly longer.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6">Shipping Charges</h2>
        <p>
          Shipping is <strong>free</strong> for orders above Rs:5K. For orders below
          Rs:5k, a flat rate of Rs:199 applies.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6">Order Tracking</h2>
        <p>
          Once shipped, you will receive a tracking ID via email and can monitor
          your package’s progress from your DC IMI LTD dashboard.
        </p>
      </div>
    </motion.div>
  );
}
