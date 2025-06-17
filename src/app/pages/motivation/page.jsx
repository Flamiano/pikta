"use client";

import { Footer } from "@/app/components/Footer";
import { HomeNavbar } from "@/app/components/HomeNavbar";
import { motion } from "framer-motion";
import { Users, Heart, Sparkles, Lightbulb, Globe, Brain } from "lucide-react";

export default function MotivationPage() {
  return (
    <>
      <HomeNavbar />
      <div className="min-h-screen bg-white px-6 py-12 max-w-full mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 font-serif mt-16">
        {/* Left Column: Motivation Text */}
        <div className="lg:col-span-3 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-6"
          >
            <h1 className="text-4xl font-extrabold text-emerald-700">
              Motivation Behind PikTà
            </h1>
            <p className="text-sm text-gray-600 sm:text-right mt-2 sm:mt-0 sm:ml-4">
              Made by{" "}
              <span className="font-semibold text-emerald-600">
                John Roel R. Flamiano
              </span>
              , a college BSIT student
            </p>
          </motion.div>

          {[
            {
              icon: <Users className="text-emerald-600 mt-1" />,
              text: "The idea for PikTà was inspired by one of my classmates. His curiosity and desire to build something exciting for events planted the first seed in my mind—and from that moment, I couldn’t stop thinking about it.",
            },
            {
              icon: <Heart className="text-pink-500 mt-1" />,
              text: "My girlfriend has always been a pillar of encouragement. Her unwavering support, creative input, and belief in me pushed me to follow through on this vision even during tough times.",
            },
            {
              icon: <Sparkles className="text-purple-500 mt-1" />,
              text: "Watching TikTok creators building innovative booths, camera setups, and event DIYs influenced both the design and energy behind PikTà. Social media became more than entertainment—it became an education and inspiration.",
            },
            {
              icon: <Lightbulb className="text-yellow-500 mt-1" />,
              text: "As a student of Information Technology, I’ve always wanted to create something that merges functionality and fun. PikTà is the perfect blend of what I’ve learned in class and what I love doing creatively.",
            },
            {
              icon: <Sparkles className="text-blue-400 mt-1" />,
              text: "This project isn’t just about tech—it’s about joy. It’s about capturing moments, making people smile, and creating a product that reflects the passion, culture, and energy of the Filipino youth.",
            },
            {
              icon: <Globe className="text-blue-600 mt-1" />,
              text: "I’ve always dreamed of creating something that could reach beyond our school or city. PikTà represents my first step toward building something with real impact, starting small but thinking big—maybe even global one day.",
            },
            {
              icon: <Brain className="text-indigo-600 mt-1" />,
              text: "This project challenged my problem-solving, design thinking, and coding skills all at once. Every bug, fix, and late-night debug taught me more than any classroom could—and I’m proud of how far I’ve come.",
            },
          ].map((item, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-lg text-gray-700 leading-relaxed mb-4 flex gap-3 items-start"
            >
              {item.icon}
              <span>{item.text}</span>
            </motion.p>
          ))}
        </div>

        {/* Right Column: Sidebar Boxes */}
        <div className="lg:col-span-1 space-y-6">
          {/* Box: Influences */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <h2 className="text-xl font-bold text-emerald-700 mb-4">
              Influences
            </h2>
            <p className="text-sm text-gray-700 mb-2">
              ✓ Classmates’ creativity
            </p>
            <p className="text-sm text-gray-700 mb-2">
              ✓ Supportive girlfriend
            </p>
            <p className="text-sm text-gray-700 mb-2">✓ TikTok tech trends</p>
            <p className="text-sm text-gray-700">✓ Passion for innovation</p>
          </motion.div>

          {/* Box: What Drives Me */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <h2 className="text-xl font-bold text-emerald-700 mb-4">
              What Drives Me
            </h2>
            <p className="text-sm text-gray-700 mb-2">
              ✓ Merging technology and creativity
            </p>
            <p className="text-sm text-gray-700 mb-2">
              ✓ Sharing joyful experiences
            </p>
            <p className="text-sm text-gray-700 mb-2">
              ✓ Learning and applying real-world skills
            </p>
            <p className="text-sm text-gray-700">✓ Making people smile</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <h2 className="text-xl font-bold text-emerald-700 mb-4">
              PikTà Vision
            </h2>
            <p className="text-sm text-gray-700 mb-2">
              ✓ Build a nationwide presence for events
            </p>
            <p className="text-sm text-gray-700">
              ✓ Inspire young tech creatives in the Philippines
            </p>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
