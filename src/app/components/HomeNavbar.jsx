"use client";

import React from "react";
import { FaCameraRetro } from "react-icons/fa";
import { motion } from "framer-motion";

export const Navbar = () => {
  // Animations
  const fadeLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  };

  const fadeRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  };

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand */}
        <motion.h1
          variants={fadeLeft}
          className="text-2xl font-extrabold tracking-wider drop-shadow-sm"
        >
          <span className="text-emerald-700">P</span>ik
          <span className="text-emerald-700">T</span>à
        </motion.h1>

        {/* Camera Icon */}
        <motion.div variants={fadeRight} className="text-emerald-700">
          <FaCameraRetro size={24} />
        </motion.div>
      </div>
    </motion.nav>
  );
};
