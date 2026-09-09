import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import ShinyText from "./ShinyText";

export default function LoadingScreen() {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-[#fdf6eb] via-[#faf5ed] to-[#fdf6eb]"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-500/60 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Large Ambient Blobs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-amber-400/20 rounded-full blur-[100px]"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-amber-500/15 rounded-full blur-[80px]"
          animate={{
            x: [0, -80, 0],
            y: [0, -40, 0],
            scale: [1.2, 1, 1.2],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Decorative Rings */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-amber-400/30 rounded-full"
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-amber-400/20 rounded-full"
          animate={{ rotate: -360, scale: [1.1, 1, 1.1] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Logo Container */}
      <div className="relative text-center z-10">
        {/* Brand Name with ShinyText */}
        <motion.div
          className="relative text-5xl md:text-7xl font-bold tracking-wider mb-4"
          style={{ fontFamily: "Georgia, serif" }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <ShinyText
            text="D SAJAWAT"
            speed={3}
            color="#b8860b"
            shineColor="#f4d47c"
            spread={120}
            direction="left"
          />
        </motion.div>

        {/* Tagline with ShinyText */}
        <motion.p
          className="text-lg md:text-xl italic mb-10"
          style={{ fontFamily: "Georgia, serif" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <ShinyText
            text="Where Elegance Meets Celebration"
            speed={4}
            color="#92400e"
            shineColor="#fbbf24"
            spread={120}
            direction="right"
            delay={1}
          />
        </motion.p>

        {/* Location Badge */}
        <motion.div
          className="flex items-center justify-center gap-2 mb-10"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.6 }}
        >
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400/50" />
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600/70 tracking-[0.2em] uppercase">
            <MapPin size={11} />
            <span>Ludhiana, Punjab</span>
            <span className="text-amber-400/30 mx-0.5">|</span>
            <span>Pan India</span>
          </div>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400/50" />
        </motion.div>

        {/* Elegant Loading Bar */}
        <div className="w-72 mx-auto">
          <motion.div
            className="relative h-1 bg-amber-400/30 rounded-full overflow-hidden"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "100%" }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            {/* Shimmer Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/50 to-transparent"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
            />

            {/* Progress Bar */}
            <motion.div
              className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 rounded-full relative"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.8, delay: 1, ease: "easeInOut" }}
            >
              {/* Glowing Edge */}
              <motion.div
                className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-amber-300 rounded-full shadow-[0_0_20px_rgba(212,175,55,0.8)]"
                animate={{ opacity: [0.5, 1, 0.5], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Loading Text with Dots Animation */}
        <motion.p
          className="mt-6 text-amber-700/60 text-sm tracking-wider"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          Preparing your experience
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ...
          </motion.span>
        </motion.p>
      </div>

      {/* Corner Decorations */}
      <motion.div
        className="absolute top-10 left-10 w-24 h-24 border border-amber-400/40 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-32 h-32 border border-amber-400/30 rounded-full"
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute top-20 right-20 w-4 h-4 bg-amber-500/50 rounded-full"
        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 left-20 w-3 h-3 bg-amber-600/60 rounded-full"
        animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      />
    </motion.div>
  );
}
