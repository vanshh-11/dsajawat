import React from "react";
import { motion } from "framer-motion";
import { FEATURES } from "../types";
import { Palette, Ruler, Package, Truck, Award, Heart, LucideIcon, Sparkles } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Palette,
  Ruler,
  Package,
  Truck,
  Award,
  Heart,
};

export default function Features() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-amber-50/30 to-white" />

      {/* Floating Decorative Elements */}
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 bg-amber-400/10 rounded-full blur-xl"
        animate={{ y: [0, -30, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-32 h-32 bg-amber-300/10 rounded-full blur-2xl"
        animate={{ y: [0, 30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="flex items-center justify-center gap-4 mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <motion.div
              className="h-px w-20 bg-gradient-to-r from-transparent to-amber-400"
              initial={{ width: 0 }}
              whileInView={{ width: 80 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
            />
            <motion.span
              className="text-sm font-bold tracking-[0.2em] uppercase text-amber-500 flex items-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles size={14} />
              Why Choose Us
            </motion.span>
            <motion.div
              className="h-px w-20 bg-gradient-to-l from-transparent to-amber-400"
              initial={{ width: 0 }}
              whileInView={{ width: 80 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
            />
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900"
            style={{ fontFamily: "Georgia, serif" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            What makes us <span className="text-amber-500">different</span>
          </motion.h2>

          <motion.p
            className="mt-6 text-lg text-gray-500 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            We combine quality, service, and innovation to deliver excellence in every fabric
          </motion.p>
        </motion.div>

        {/* Enhanced Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature, i) => {
            const Icon = iconMap[feature.icon] || Award;
            return (
              <motion.div
                key={feature.title}
                className="group relative bg-white rounded-3xl p-8 shadow-lg shadow-gray-100 overflow-hidden cursor-pointer"
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: i * 0.1,
                  duration: 0.6,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                whileHover={{
                  y: -10,
                  boxShadow: "0 30px 60px rgba(0,0,0,0.12)",
                  scale: 1.02
                }}
              >
                {/* Animated Background Gradient on Hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-amber-50 to-amber-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />

                {/* Floating Decorative Circle */}
                <motion.div
                  className="absolute -top-8 -right-8 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
                />

                {/* Icon Container with Enhanced Animation */}
                <motion.div
                  className="relative w-18 h-18 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center mb-8"
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  {/* Icon Glow */}
                  <motion.div
                    className="absolute inset-0 bg-amber-400/30 rounded-2xl blur-md"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <Icon
                    size={32}
                    className="relative z-10 text-amber-600 group-hover:text-white transition-colors duration-300"
                  />

                  {/* Sparkle on Hover */}
                  <motion.div
                    className="absolute -top-2 -right-2"
                    initial={{ opacity: 0, scale: 0 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Sparkles size={16} className="text-amber-400" />
                  </motion.div>
                </motion.div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-amber-700 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    {feature.desc}
                  </p>
                </div>

                {/* Bottom Accent Line with Animation */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 to-amber-500 rounded-b-3xl"
                  initial={{ scaleX: 0, originX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />

                {/* Side Accent */}
                <motion.div
                  className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-400 to-amber-500 rounded-l-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />

                {/* Arrow Indicator */}
                <motion.div
                  className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ x: -10, opacity: 0 }}
                  whileHover={{ x: 0, opacity: 1 }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-amber-500">
                    <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
