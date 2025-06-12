import React from "react";
import { FaFacebookF, FaGithub } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="hidden lg:block bg-emerald-600 text-white font-poppins">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Brand */}
        <div className="text-lg font-semibold">Piktà</div>

        {/* Center: Copyright */}
        <div className="text-sm text-center">
          &copy; {new Date().getFullYear()} All rights reserved.
        </div>

        {/* Right: Social Icons */}
        <div className="flex gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-200 transition"
          >
            <FaGithub size={18} />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-200 transition"
          >
            <FaFacebookF size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
};
