"use client";
import { useEffect, useState } from "react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import "./globals.css";

export default function Home() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % 1); // Placeholder for rotating slogans/texts
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800 font-poppins relative overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 pt-40 lg:pt-52 pb-32 text-center relative z-10 bg-white">
        {/* Branding Line */}
        <p className="text-sm text-gray-600 font-semibold tracking-widest mb-2 uppercase">
          <span className="text-emerald-500">R</span>oel{" "}
          <span className="text-emerald-500">D</span>evv
        </p>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-2">
          Your Premier <span className="text-emerald-500">Photo Booth</span>{" "}
          Experience
        </h1>

        {/* Description */}
        <p className="text-lg text-gray-600 max-w-3xl mb-4">
          Elevate your events with style and creativity. Whether it’s a wedding,
          corporate gathering, or celebration, our photo booth adds a personal,
          interactive, and unforgettable touch.
        </p>

        {/* Call to Action */}
        <a
          href="#explore"
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-6 py-3 rounded-full shadow-md transition duration-300"
        >
          Get Started
        </a>
      </main>

      <Footer />
    </div>
  );
}
