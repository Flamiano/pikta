"use client";

import React from "react";
import { FaFacebookF, FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";

export const Footer = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="block bg-emerald-600 text-white font-poppins"
    >
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Brand */}
        <motion.div
          variants={fadeUp}
          className="hidden lg:block text-lg font-semibold"
        >
          Piktà
        </motion.div>

        {/* Center: Copyright */}
        <motion.div variants={fadeUp} className="text-sm text-center">
          &copy; {new Date().getFullYear()} All rights reserved.
        </motion.div>

        {/* Right: Social Icons */}
        <motion.div variants={fadeUp} className="flex gap-4">
          <a
            href="https://github.com/Flamiano/pikta"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-200 transition"
          >
            <FaGithub size={18} />
          </a>
          <a
            href="https://web.facebook.com/roel.flamiano.2025/about"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-200 transition"
          >
            <FaFacebookF size={18} />
          </a>
        </motion.div>
      </div>
    </motion.footer>
  );
};
