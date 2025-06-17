"use client";

import { Footer } from "@/app/components/Footer";
import { HomeNavbar } from "@/app/components/HomeNavbar";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <>
      <HomeNavbar />
      <div className="min-h-screen bg-white px-6 py-12 max-w-full mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 font-serif mt-16">
        {/* Left Column: Essay Content */}
        <div className="lg:col-span-3 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-6"
          >
            <h1 className="text-6xl font-extrabold text-emerald-700">PikTà</h1>
            <p className="text-sm text-gray-600 sm:text-right mt-2 sm:mt-0 sm:ml-4">
              Made by{" "}
              <span className="font-semibold text-emerald-600">
                John Roel R. Flamiano
              </span>
              , a college BSIT student
            </p>
          </motion.div>

          {[
            "PikTà isn’t just a photo booth—it’s a storytelling machine. Every flash, every frame captures not just faces but emotions, celebrations, and milestones. Whether you’re hosting an elegant wedding or a wild birthday bash, PikTà turns fleeting moments into timeless memories.",
            "Born from the fusion of “picture” and the Filipino word “tara” (let’s go), PikTà represents spontaneity and joy. It speaks to the heart of gatherings—where people come together, laugh, pose, and relive every moment with a smile. We’re proud to say that our tech is locally made, thoughtfully designed, and culturally rooted.",
            "With customizable frames, real-time filters, a seamless UI, and instant sharing features, PikTà adapts to any event’s vibe. Guests walk away with not just photos but experiences—souvenirs that live in both print and pixels.",
            "Behind the scenes, our commitment to quality shines through—from good-resolution cameras and crisp printers to intuitive software that’s both fun and functional. We make sure every detail works harmoniously to give users the best possible photo booth encounter.",
            "PikTà continues to evolve with the latest trends in photography and digital sharing. We are committed to pushing boundaries and giving my clients the most immersive, delightful photo booth experience possible. Events change, memories last forever—and we’re here to capture each one with style.",
            "Join thousands who’ve already discovered the magic. With PikTà, there’s always a reason to smile. Book us today and let’s make your event unforgettable.",
            "My mission is to revolutionize how people interact with photography at events. From integrating AI-generated filters to offering eco-friendly printing options, PikTà aims to set new standards in the event tech space.",
            "Community is at the heart of what we do. We work closely with local artists, developers, and event organizers to ensure PikTà reflects the vibrant and dynamic spirit of the Filipino culture. Every activation is not just a service—it’s a celebration.",
            "Looking ahead, we envision PikTà as more than a photo booth. We’re building an interactive platform for creative expression, shared moments, and joyful storytelling. Because every click matters—and every smile is worth saving.",
            "Together with my clients, partners, and local communities, we’re shaping the future of event memories—fun, meaningful, and Filipino at heart.",
            "We prioritize accessibility and ease-of-use, ensuring every guest, regardless of age or ability, can fully enjoy the PikTà experience.",
            "I am fueled by passion, creativity, and the desire to elevate every moment into something truly magical.",
            "Your stories deserve to be captured beautifully—PikTà is here to make that happen, one click at a time.",
          ].map((text, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-lg text-gray-700 leading-relaxed mb-4"
            >
              {i === 0 ? (
                <>
                  <strong className="text-emerald-700">PikTà</strong>{" "}
                  {text.replace("PikTà", "")}
                </>
              ) : (
                text
              )}
            </motion.p>
          ))}
        </div>

        {/* Right Column: Sidebar Boxes */}
        <div className="lg:col-span-1 space-y-6">
          {/* Box 1: About PikTà */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <h2 className="text-xl font-bold text-emerald-700 mb-4">
              About PikTà
            </h2>
            <p className="text-sm text-gray-700 mb-2">
              ✓ Locally developed, proudly Filipino
            </p>
            <p className="text-sm text-gray-700 mb-2">
              ✓ Real-time filters, themes, and customization
            </p>
            <p className="text-sm text-gray-700 mb-2">
              ✓ Designed for all event types—big or small
            </p>
            <p className="text-sm text-gray-700 mb-2">
              ✓ Print and digital sharing capabilities
            </p>
            <p className="text-sm text-gray-700 mb-2">
              ✓ Environmentally friendly printing options
            </p>
            <p className="text-sm text-gray-700 mb-2">
              ✓ Seamless mobile experience
            </p>
            <p className="text-sm text-gray-700 mb-2">
              ✓ Collaborative with local creatives
            </p>
            <p className="text-sm text-gray-700">
              ✓ Committed to creating unforgettable memories
            </p>
          </motion.div>

          {/* Box 2: PikTà Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <h2 className="text-xl font-bold text-emerald-700 mb-4">
              PikTà Features
            </h2>
            <p className="text-sm text-gray-700 mb-2">
              ✓ One-touch photo capture
            </p>
            <p className="text-sm text-gray-700 mb-2">
              ✓ Custom event overlays and borders
            </p>
            <p className="text-sm text-gray-700 mb-2">
              ✓ GIF and Boomerang modes
            </p>
            <p className="text-sm text-gray-700 mb-2">
              ✓ Adjustable countdown timers
            </p>
            <p className="text-sm text-gray-700 mb-2">
              ✓ AI-powered enhancements
            </p>
            <p className="text-sm text-gray-700">
              ✓ Built-in analytics dashboard
            </p>
          </motion.div>

          {/* Box 3: Why Choose Us */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <h2 className="text-xl font-bold text-emerald-700 mb-4">
              Why Choose Us
            </h2>
            <p className="text-sm text-gray-700 mb-2">
              ✓ We value your memories
            </p>
            <p className="text-sm text-gray-700 mb-2">
              ✓ Affordable rates for every event
            </p>
            <p className="text-sm text-gray-700 mb-2">
              ✓ Trusted by hundreds of clients
            </p>
            <p className="text-sm text-gray-700 mb-2">
              ✓ Fast setup and professional support
            </p>
            <p className="text-sm text-gray-700 mb-2">
              ✓ Sleek and modern booth design
            </p>
            <p className="text-sm text-gray-700">✓ Flexible rental packages</p>
          </motion.div>

          {/* Box 4: Customer Experience */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <h2 className="text-xl font-bold text-emerald-700 mb-4">
              Customer Experience
            </h2>
            <p className="text-sm text-gray-700 mb-2">
              ✓ Live previews during shoots
            </p>
            <p className="text-sm text-gray-700 mb-2">
              ✓ Personalized customer interactions
            </p>
            <p className="text-sm text-gray-700 mb-2">✓ Rapid photo delivery</p>
            <p className="text-sm text-gray-700">
              ✓ Consistently good customer satisfaction
            </p>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
