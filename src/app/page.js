"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "./components/HomeNavbar";
import { Footer } from "./components/Footer";
import "./globals.css";


export default function Home() {
  const [showOverlay, setShowOverlay] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const router = useRouter();

  const handleStart = () => {
    setShowOverlay(true);
    let count = 5;
    setCountdown(count);
    const interval = setInterval(() => {
      count--;
      setCountdown(count);
      if (count === 0) {
        clearInterval(interval);
        router.push("/main");
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800 font-poppins relative overflow-x-hidden">
      <Navbar />

      {/* Countdown Overlay */}
      {showOverlay && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <h1 className="text-white text-6xl font-bold">{countdown}</h1>
        </div>
      )}

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 pt-37 lg:pt-52 pb-32 text-center relative z-10 bg-white">
        <p className="text-sm text-gray-600 font-semibold tracking-widest mb-2">
          <span className="text-emerald-500">m</span>ade by{" "}
          <span className="text-emerald-500">r</span>oel
        </p>

        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-2">
          Your Premier <span className="text-emerald-500">Photo Booth</span>{" "}
          Experience
        </h1>

        <p className="text-lg text-gray-600 max-w-3xl mb-4">
          Elevate your events with style and creativity. Whether it’s corporate
          gathering, or celebration. My photo booth adds a personal,
          interactive, and unforgettable touch.
        </p>

        {/* Call to Action Button (NOT Link anymore) */}
        <button
          onClick={handleStart}
          className="bg-white-500 hover:bg-emerald-600 hover:text-white border-1 text-emerald-500 font-medium px-12 py-2 rounded-full shadow-md transition duration-300 cursor-pointer"
        >
          Start
        </button>
      </main>

      <Footer />
    </div>
  );
}
