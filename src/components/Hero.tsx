import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowDown, Crown, MapPin, Award, Truck } from "lucide-react";
import { BRAND } from "../types";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }
  },
};

const features = [
  { icon: Award, text: "Premium Quality" },
  { icon: Truck, text: "Pan India Delivery" },
  { icon: Sparkles, text: "Bulk Orders" },
];

export default function Hero({ onOpenQuote }: { onOpenQuote: () => void }) {
  const scrollToCollections = () => {
    document.getElementById("collections")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="top" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with Enhanced Ken Burns + Parallax */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1920')" }}
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 20, ease: "easeOut" }}
      />

      {/* Multiple Gradient Overlays for Depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />

      {/* Animated Light Effects - Enhanced */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large Orbital Light */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-amber-500/20 to-amber-400/10 rounded-full blur-[120px]"
          animate={{
            x: [0, 150, 0],
            y: [0, 80, 0],
            scale: [1, 1.3, 1],
            rotate: [0, 45, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-l from-amber-400/15 to-amber-300/10 rounded-full blur-[100px]"
          animate={{
            x: [0, -120, 0],
            y: [0, -60, 0],
            scale: [1.2, 1, 1.2],
            rotate: [0, -30, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 bg-amber-400/40 rounded-full"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 0.8, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Decorative Lines */}
        <motion.div
          className="absolute top-20 left-20 w-40 h-px bg-gradient-to-r from-amber-400/50 to-transparent"
          animate={{ x: [0, 30, 0], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-32 right-20 w-32 h-px bg-gradient-to-l from-amber-400/50 to-transparent"
          animate={{ x: [0, -20, 0], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 3.5, repeat: Infinity }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto"
        >
          {/* Location Badge - Entrance Animation */}
          <motion.div variants={itemVariants} className="flex items-center justify-center gap-4 mb-10">
            <motion.div
              className="h-px w-20 bg-gradient-to-r from-transparent to-amber-400"
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            />
            <motion.div
              className="flex items-center gap-2 text-sm font-semibold text-amber-400 tracking-[0.25em] uppercase"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <MapPin size={16} />
              </motion.div>
              Ludhiana, Punjab | Pan India Delivery
            </motion.div>
            <motion.div
              className="h-px w-20 bg-gradient-to-l from-transparent to-amber-400"
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            />
          </motion.div>

          {/* Main Title - Word by Word Animation */}
          <motion.h1
            variants={itemVariants}
            className="text-6xl md:text-7xl lg:text-[100px] font-bold text-white mb-6 tracking-tight leading-none"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {["D", "SAJAWAT"].map((word, wordIndex) => (
              <span key={wordIndex} className="inline-block mr-4">
                {word.split("").map((letter, i) => (
                  <motion.span
                    key={`${wordIndex}-${i}`}
                    className="inline-block"
                    initial={{ opacity: 0, y: 60, rotateX: -90 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.4 + wordIndex * 0.3 + i * 0.05,
                      ease: [0.34, 1.56, 0.64, 1],
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
            ))}
          </motion.h1>

          {/* Tagline with Icon */}
          <motion.div variants={itemVariants} className="flex items-center justify-center gap-4 mb-8">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Crown className="text-amber-400" size={32} />
            </motion.div>
            <motion.p
              className="text-2xl md:text-4xl text-amber-400 italic"
              style={{ fontFamily: "Georgia, serif" }}
            >
              {BRAND.tagline}
            </motion.p>
            <motion.div
              animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              <Crown className="text-amber-400" size={32} />
            </motion.div>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-14 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            Premium fabrics for weddings & events. Trusted by India&apos;s top decorators with Pan India delivery.
          </motion.p>

          {/* CTA Buttons - Staggered Animation */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 justify-center">
            <motion.button
              onClick={scrollToCollections}
              className="px-12 py-5 bg-gradient-to-r from-amber-400 to-amber-500 text-white font-bold rounded-full flex items-center justify-center gap-4 text-lg shadow-2xl shadow-amber-500/40 relative overflow-hidden group"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 25px 80px rgba(212, 175, 55, 0.5)"
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ delay: 1.3 }}
            >
              {/* Shine Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                initial={{ x: "-100%" }}
                whileHover={{ x: "200%" }}
                transition={{ duration: 0.6 }}
              />
              <Sparkles size={22} className="relative z-10" />
              <span className="relative z-10">Explore Collections</span>
            </motion.button>
            <motion.button
              onClick={onOpenQuote}
              className="px-12 py-5 bg-white/10 backdrop-blur-xl border-2 border-white/40 text-white font-bold rounded-full flex items-center justify-center gap-4 text-lg hover:bg-white hover:text-gray-900 transition-all relative overflow-hidden group"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{
                scale: 1.05,
                borderColor: "rgba(212, 175, 55, 0.8)",
                boxShadow: "0 25px 60px rgba(212, 175, 55, 0.2)"
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ delay: 1.4 }}
            >
              <span className="relative z-10">Get a Quote</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="relative z-10"
              >
                →
              </motion.div>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#fdf6eb] to-transparent pointer-events-none" />
    </section>
  );
}
