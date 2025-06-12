"use client";

import React from "react";
import { FaCameraRetro } from "react-icons/fa";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand */}
        <h1 className="text-2xl font-extrabold tracking-wider drop-shadow-sm">
          <span className="text-emerald-700">P</span>ik
          <span className="text-emerald-700">T</span>à
        </h1>

        {/* Camera Icon */}
        <div className="text-emerald-700">
          <FaCameraRetro size={24} />
        </div>
      </div>
    </nav>
  );
};
