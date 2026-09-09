import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const transformations = [
  {
    before: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&h=400&fit=crop",
    after: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=400&fit=crop",
    title: "Wedding Venue Transformation",
    desc: "From ordinary ballroom to breathtaking celebration space",
  },
  {
    before: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&h=400&fit=crop",
    after: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=400&fit=crop",
    title: "Table Setting Elegance",
    desc: "Simple tables transformed into luxurious dining experiences",
  },
  {
    before: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&h=400&fit=crop",
    after: "https://images.unsplash.com/photo-1529636798458-92182e662485?w=600&h=400&fit=crop",
    title: "Stage Decoration Magic",
    desc: "Bare stage converted into a stunning focal point",
  },
];

export default function BeforeAfter() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden bg-gradient-to-b from-white to-amber-50/30">
      {/* Background Decorative Elements */}
      <motion.div
        className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-amber-50/50 to-transparent"
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
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
              Our Work
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
            See the <span className="text-amber-500">Transformation</span>
          </motion.h2>

          <motion.p
            className="mt-6 text-lg text-gray-500 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            Witness the magic of our fabrics and decorations - before and after comparisons
          </motion.p>
        </motion.div>

        {/* Transformation Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {transformations.map((item, i) => (
            <motion.div
              key={i}
              className="group bg-white rounded-3xl overflow-hidden shadow-xl shadow-gray-200/50"
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                delay: i * 0.15,
                duration: 0.7,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              whileHover={{
                y: -10,
                boxShadow: "0 30px 60px rgba(0,0,0,0.15)",
              }}
            >
              {/* Before/After Image Container */}
              <div className="relative aspect-[4/3] overflow-hidden">
                {/* Before Image */}
                <div className="absolute inset-0">
                  <img
                    src={item.before}
                    alt="Before"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm font-semibold">
                    Before
                  </div>
                </div>

                {/* After Image with Slider Effect */}
                <div className="absolute inset-0 overflow-hidden" style={{ clipPath: "inset(0 50% 0 0)" }}>
                  <img
                    src={item.after}
                    alt="After"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 px-4 py-2 bg-amber-500/90 backdrop-blur-sm rounded-full text-white text-sm font-semibold">
                    After
                  </div>
                </div>

                {/* Slider Handle */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
                  style={{ left: "50%", transform: "translateX(-50%)" }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
                    <div className="flex gap-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400">
                        <path d="M15 18l-6-6 6-6"/>
                      </svg>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400">
                        <path d="M9 18l6-6-6-6"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3
                  className="text-xl font-bold text-gray-900 mb-2"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <motion.a
            href="#contact"
            className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-white font-bold rounded-full shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <Sparkles size={20} />
            <span>Transform Your Event</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
