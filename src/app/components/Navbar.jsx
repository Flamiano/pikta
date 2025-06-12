"use client";

import React, { useState, useRef, useEffect } from "react";
import { Menu, X } from "lucide-react";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navLinks = ["Explore", "Gallery", "Inspire", "Contact"];
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between relative">
        {/* Brand */}
        <h1 className="text-2xl font-extrabold tracking-wider drop-shadow-sm">
          <span className="text-emerald-700">P</span>ik
          <span className="text-emerald-700">T</span>à
        </h1>

        {/* Menu button with dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-5 py-2 cursor-pointer text-emerald-700 border border-emerald-300 rounded-full hover:bg-emerald-200 transition"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Dropdown menu with slide animation */}
          <div
            className={`absolute right-0 mt-2 w-44 bg-white border border-emerald-200 rounded-xl shadow-lg p-4 space-y-2 z-50
              transform transition-all duration-300 ease-out
              ${
                isOpen
                  ? "translate-x-0 opacity-100 pointer-events-auto"
                  : "translate-x-10 opacity-0 pointer-events-none"
              }`}
          >
            {navLinks.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="block text-emerald-700 text-sm font-medium hover:text-emerald-500 transition"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
