"use client";

import { Footer } from "@/app/components/Footer";
import { HomeNavbar } from "@/app/components/HomeNavbar";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FAQPage() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What is PikTà?",
      answer:
        "PikTà is your premier photo booth experience designed for modern events. Capture memories instantly with good photo strips and digital images.",
    },
    {
      question: "How does the photo booth work?",
      answer:
        "Simply step in, pose, and let PikTà do the rest! Our interactive booth guides you through the photo-taking process with ease.",
    },
    {
      question: "Can I customize my photo strip?",
      answer:
        "Yes! PikTà offers layout and theme customization so you can match your event's vibe perfectly.",
    },
    {
      question: "Is the booth mobile and event-ready?",
      answer:
        "Absolutely! PikTà is fully portable and ideal for birthdays, weddings, corporate events, and more.",
    },
    {
      question: "Do I get digital copies?",
      answer:
        "Yes, guests can receive digital copies of their photos instantly via Download.",
    },
  ];

  return (
    <>
      <HomeNavbar />

      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white mt-18 font-serif">
        <div className="relative bg-emerald-500 overflow-hidden">
          <div className="max-w-7xl mx-auto py-20 px-6">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-5xl font-extrabold text-white"
            >
              Have Questions?
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="mt-4 text-xl text-emerald-100"
            >
              We've got you covered with the most common answers about PikTà
            </motion.p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto px-4 py-12"
        >
          {" "}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-extrabold text-emerald-700 mb-6 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isActive = activeIndex === index;

                return (
                  <div
                    key={index}
                    className={`border rounded-xl transition-all duration-200 overflow-hidden ${
                      isActive
                        ? "border-emerald-400 shadow-md"
                        : "border-gray-200 hover:border-emerald-200"
                    }`}
                  >
                    <button
                      onClick={() => toggleAccordion(index)}
                      className={`flex justify-between items-center w-full p-5 text-left ${
                        isActive ? "bg-emerald-50" : "bg-white"
                      } cursor-pointer`}
                    >
                      <h3 className="text-lg font-semibold text-gray-800">
                        {faq.question}
                      </h3>
                      <svg
                        className={`w-5 h-5 transform transition-transform duration-200 ${
                          isActive
                            ? "rotate-180 text-emerald-600"
                            : "text-gray-400"
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {/* Only render content when active to avoid layout jump */}
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          key="content"
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.2 }}
                          className="px-5 pb-5 text-gray-600"
                        >
                          <p>{faq.answer}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
}
