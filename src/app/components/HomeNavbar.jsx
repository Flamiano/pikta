"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaCameraRetro } from "react-icons/fa";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const HomeNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const pathname = usePathname();

  const isDarkPage = [
    "/pages/about",
    "/pages/motivation",
    "/pages/faqs",
  ].includes(pathname);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const fadeLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  };

  const fadeRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  };

  return (
    <>
      {/* Top Navbar */}
      <motion.nav
        initial="hidden"
        animate="visible"
        className="fixed top-0 left-0 w-full z-50 bg-white"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between font-serif">
          {/* Brand */}
          <motion.h1
            variants={fadeLeft}
            className={`text-2xl font-extrabold tracking-wider drop-shadow-sm ${
              isDarkPage ? "text-gray-900" : "text-gray-900"
            }`}
          >
            <span className="text-emerald-700">P</span>ik
            <span className="text-emerald-700">T</span>à
          </motion.h1>

          {/* Camera Icon Menu Trigger */}
          <motion.div
            variants={fadeRight}
            onClick={toggleMenu}
            className="cursor-pointer px-4 py-2 border border-emerald-500 bg-white rounded-full text-emerald-700 flex items-center gap-2 font-medium 
              transition-all duration-300 ease-in-out
              hover:bg-emerald-500 hover:text-white hover:shadow-lg hover:scale-105"
          >
            <FaCameraRetro size={20} />
            Menu
          </motion.div>
        </div>
      </motion.nav>

      {/* Slide-in Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.aside
            ref={menuRef}
            key="menu"
            initial={{ x: 220, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 220, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="fixed top-13 right-0 w-full lg:w-80 bg-white shadow-lg rounded-none lg:rounded-l-3xl p-6 z-40 flex flex-col gap-4 will-change-transform"
          >
            {/* Header Row: Title + Close */}
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-extrabold text-emerald-700">
                Navigate
              </h2>
              <button
                onClick={() => setMenuOpen(false)}
                className="text-gray-400 hover:text-red-500 transition cursor-pointer"
                aria-label="Close Menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Nav Links */}
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className={`text-md transition-colors duration-300 ease-in-out cursor-pointer ${
                pathname === "/"
                  ? "text-emerald-700 font-bold"
                  : "text-gray-700 hover:text-emerald-700"
              }`}
            >
              Home
            </Link>

            <Link
              href="/pages/about"
              onClick={() => setMenuOpen(false)}
              className={`text-md transition-colors duration-300 ease-in-out cursor-pointer ${
                pathname === "/pages/about"
                  ? "text-emerald-700 font-bold"
                  : "text-gray-700 hover:text-emerald-700"
              }`}
            >
              About
            </Link>

            <Link
              href="/pages/motivation"
              onClick={() => setMenuOpen(false)}
              className={`text-md transition-colors duration-300 ease-in-out cursor-pointer ${
                pathname === "/pages/motivation"
                  ? "text-emerald-700 font-bold"
                  : "text-gray-700 hover:text-emerald-700"
              }`}
            >
              Motivation
            </Link>

            <Link
              href="/pages/faqs"
              onClick={() => setMenuOpen(false)}
              className={`text-md transition-colors duration-300 ease-in-out cursor-pointer ${
                pathname === "/pages/faqs"
                  ? "text-emerald-700 font-bold"
                  : "text-gray-700 hover:text-emerald-700"
              }`}
            >
              FAQs
            </Link>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};
