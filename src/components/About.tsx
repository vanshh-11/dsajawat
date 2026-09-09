import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { STATS } from "../types";
import { Award, Users, Globe, Heart, Sparkles } from "lucide-react";

function Counter({ to, suffix, index }: { to: number; suffix: string; index: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setVal(Math.round(to * eased));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  }, [isInView, to]);

  return (
    <motion.span
      ref={ref}
      className="block text-5xl md:text-6xl lg:text-7xl font-bold text-amber-400"
      style={{ fontFamily: "Georgia, serif" }}
      initial={{ opacity: 0, scale: 0.5, rotateX: -90 }}
      animate={isInView ? { opacity: 1, scale: 1, rotateX: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
    >
      {val.toLocaleString()}{suffix}
    </motion.span>
  );
}

const values = [
  { icon: Award, title: "Premium Quality", desc: "Every roll inspected", color: "from-amber-100 to-amber-200" },
  { icon: Users, title: "350+ Decorators", desc: "Trust our products", color: "from-green-100 to-green-200" },
  { icon: Globe, title: "240+ Cities", desc: "Pan India reach", color: "from-blue-100 to-blue-200" },
  { icon: Heart, title: "12+ Years", desc: "Of excellence", color: "from-pink-100 to-pink-200" },
];

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background with Decorative Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-50/50 via-white to-amber-50/30" />

      {/* Floating Decorative Shapes */}
      <motion.div
        className="absolute top-20 right-10 w-32 h-32 border-2 border-amber-200/50 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-20 left-10 w-24 h-24 border-2 border-amber-300/30 rounded-full"
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute top-1/3 left-1/4 w-4 h-4 bg-amber-400/40 rounded-full"
        animate={{ y: [0, -20, 0], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-2/3 right-1/4 w-3 h-3 bg-amber-300/50 rounded-full"
        animate={{ y: [0, 15, 0], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Overline */}
            <motion.div
              className="flex items-center gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <motion.div
                className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400"
                initial={{ width: 0 }}
                whileInView={{ width: 64 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
              />
              <motion.span
                className="text-sm font-bold tracking-[0.2em] uppercase text-amber-500 flex items-center gap-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <Sparkles size={14} />
                About Us
              </motion.span>
            </motion.div>

            {/* Heading */}
            <motion.h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight"
              style={{ fontFamily: "Georgia, serif" }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              A fabric house from Ludhiana, adorning India&apos;s grandest{" "}
              <span className="relative inline-block">
                <span className="text-amber-500">celebrations</span>
                <motion.span
                  className="absolute -bottom-2 left-0 w-full h-3 bg-amber-400/20 rounded-full"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                />
              </span>
              .
            </motion.h2>

            {/* Description */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-lg text-gray-600 leading-relaxed">
                For over a decade, D SAJAWAT has been the quiet hand behind some of the country&apos;s most exquisite wedding venues. We source, finish and supply premium fabrics - drapes, covers, sashes, florals.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                From a single roll to a banquet&apos;s worth - we deliver across India, on time, in finish.
              </p>
            </motion.div>
          </motion.div>

          {/* Right - Stats with Enhanced Animation */}
          <motion.div
            ref={ref}
            className="grid grid-cols-2 gap-6"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="group relative bg-white rounded-3xl p-8 lg:p-10 shadow-xl shadow-gray-200/50 text-center overflow-hidden"
                initial={{ opacity: 0, y: 60, rotateX: -30 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.3 + i * 0.15,
                  duration: 0.7,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                whileHover={{
                  y: -12,
                  boxShadow: "0 30px 60px rgba(0,0,0,0.15)",
                  scale: 1.03
                }}
              >
                {/* Decorative Corner */}
                <motion.div
                  className="absolute top-0 right-0 w-24 h-24 bg-amber-400/10 rounded-full -translate-y-1/2 translate-x-1/2"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />

                {/* Number with Glow */}
                <motion.div
                  className="relative inline-block"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className="relative z-10">
                    <Counter to={stat.value} suffix={stat.suffix} index={i} />
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-amber-400/20 blur-xl rounded-full"
                    animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </motion.div>

                <motion.span
                  className="block mt-4 text-sm font-semibold text-gray-500 uppercase tracking-wider"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.8 + i * 0.15 }}
                >
                  {stat.label}
                </motion.span>

                {/* Bottom Accent Line */}
                <motion.div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
