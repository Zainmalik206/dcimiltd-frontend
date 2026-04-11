import React from "react";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";

export default function TermsConditions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto py-16 px-6"
    >
      <div className="flex flex-col items-center mb-10">
        <FileText size={42} className="text-orange-600 mb-3" />
        <h1 className="text-4xl font-bold text-gray-800">Terms & Conditions</h1>
        <p className="text-gray-500 mt-2 text-center">
          Please read these terms carefully before using DC IMI LTD
        </p>
      </div>

      <div className="space-y-5 text-gray-700 leading-relaxed">
        <p>
          By accessing or using DC IMI LTD, you agree to comply with the terms and
          policies outlined here.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6">Use of Website</h2>
        <p>
          You agree not to misuse this website for unlawful activities or to
          distribute malicious content.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6">Pricing & Availability</h2>
        <p>
          Prices are subject to change without prior notice. Product availability
          may vary and is not guaranteed.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6">Limitation of Liability</h2>
        <p>
          DC IMI LTD shall not be held liable for indirect or consequential damages
          arising from the use of our services.
        </p>

        
      </div>
    </motion.div>
  );
}
