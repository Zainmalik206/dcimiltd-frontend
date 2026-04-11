import React from "react";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "How can I track my order?",
    answer:
      "Once your order is shipped, we’ll send you an email with a tracking number. You can also track it directly from your DC IMI LTD dashboard under 'My Orders'.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept Visa, MasterCard, PayPal, and Cash on Delivery (COD) for select locations.",
  },
  {
    question: "Can I cancel my order after placing it?",
    answer:
      "Yes, you can cancel an order within 2 hours of placing it by visiting your order details page.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Currently, we ship within select countries. International shipping options will be added soon!",
  },
];

export default function FAQs() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto py-16 px-6"
    >
      <div className="flex flex-col items-center mb-12">
        <HelpCircle size={42} className="text-orange-600 mb-3" />
        <h1 className="text-4xl font-bold text-gray-800">Frequently Asked Questions</h1>
        <p className="text-gray-500 mt-2 text-center">
          Everything you need to know about shopping with DC IMI LTD
        </p>
      </div>

      <div className="space-y-6">
        {faqs.map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.01 }}
            className="bg-white border border-gray-200 rounded-xl shadow-sm p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {item.question}
            </h3>
            <p className="text-gray-600 leading-relaxed">{item.answer}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
