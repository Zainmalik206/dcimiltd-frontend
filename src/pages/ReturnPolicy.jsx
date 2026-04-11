import React from "react";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";

export default function ReturnPolicy() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl mx-auto py-16 px-6"
    >
      <div className="flex flex-col items-center mb-10">
        <RotateCcw size={42} className="text-orange-600 mb-3" />
        <h1 className="text-4xl font-bold text-gray-800">Return & Refund Policy</h1>
        <p className="text-gray-500 mt-2 text-center">
          Hassle-free returns, because your satisfaction matters 💫
        </p>
      </div>

      <div className="space-y-5 text-gray-700 leading-relaxed">
        <p>
          If you're not fully satisfied with your purchase, you can return the
          item within <strong>7 days</strong> of receiving it.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6">Conditions for Return</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>The product must be unused and in its original packaging.</li>
          <li>Proof of purchase is required for processing.</li>
          <li>Items like underwear or hygiene products are non-returnable.</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-800 mt-6">Refund Process</h2>
        <p>
          Once your return is approved, refunds will be initiated within{" "}
          <strong>5–7 business days</strong> to your original payment method.
        </p>
      </div>
    </motion.div>
  );
}
