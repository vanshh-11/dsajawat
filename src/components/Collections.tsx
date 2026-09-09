import React, { useRef, useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { COLLECTIONS, Collection } from "../types";
import { useProducts, Product } from "../hooks/useProducts";
import { ArrowRight } from "lucide-react";

interface UnifiedCollection {
  id: string;
  title: string;
  overline: string;
  desc: string;
  image: string;
}

function toUnifiedCollection(item: Product | Collection, isFromApi: boolean): UnifiedCollection {
  if (isFromApi) {
    const p = item as Product;
    return {
      id: p.id,
      title: p.title,
      overline: p.overline || "Series",
      desc: p.description || "",
      image: p.images?.[0] || "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800",
    };
  }
  const c = item as Collection;
  return {
    id: c.id,
    title: c.title,
    overline: c.overline,
    desc: c.desc,
    image: c.image,
  };
}

interface CollectionCardProps {
  collection: UnifiedCollection;
  index: number;
}

function CollectionCard({ collection, index }: CollectionCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      const width = rect.width;
      const height = rect.height;
      const mouseX = (e.clientX - rect.left) / width - 0.5;
      const mouseY = (e.clientY - rect.top) / height - 0.5;
      x.set(mouseX);
      y.set(mouseY);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const { image, title, overline, desc } = collection;

  return (
    <motion.div
      ref={cardRef}
      className="group relative overflow-hidden rounded-3xl cursor-pointer"
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        delay: index * 0.08,
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.03 }}
    >
      <div
        className="relative aspect-[4/5] overflow-hidden"
        style={{ transform: "translateZ(30px)" }}
      >
        <motion.img
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
          animate={{ scale: [1, 1.1] }}
          transition={{ duration: 0.8, delay: index * 0.1 }}
          whileHover={{ scale: 1.15 }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        <div
          className="absolute inset-0 flex flex-col justify-end p-6"
          style={{ transform: "translateZ(60px)" }}
        >
          <motion.span
            className="inline-block px-3 py-1 bg-amber-400/90 text-white text-xs font-bold uppercase tracking-wider rounded-full mb-3 w-fit"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 + 0.3 }}
            whileHover={{ scale: 1.05, backgroundColor: "#f59e0b" }}
          >
            {overline}
          </motion.span>

          <motion.h3
            className="text-xl lg:text-2xl font-bold text-white mb-3"
            style={{ fontFamily: "Georgia, serif" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 + 0.4 }}
          >
            {title}
          </motion.h3>

          <motion.p
            className="text-sm text-white/80 mb-4 line-clamp-2"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 + 0.5 }}
          >
            {desc}
          </motion.p>

          <motion.div
            className="flex items-center gap-2 text-amber-400 font-semibold"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 + 0.6 }}
          >
            <span className="text-sm">View Details</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight size={16} />
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            boxShadow: "inset 0 0 0 2px rgba(212, 175, 55, 0.6)",
            transform: "translateZ(70px)"
          }}
          animate={{
            boxShadow: [
              "inset 0 0 0 2px rgba(212, 175, 55, 0.3)",
              "inset 0 0 0 2px rgba(212, 175, 55, 0.6)",
              "inset 0 0 0 2px rgba(212, 175, 55, 0.3)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
    </motion.div>
  );
}

export default function Collections() {
  const { products, isLoading, error } = useProducts({ featured: true, limit: 8 });
  const [useApiData, setUseApiData] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setUseApiData(products.length > 0 && !error);
    }
  }, [isLoading, products, error]);

  const unifiedCollections = useApiData
    ? products.map((p) => toUnifiedCollection(p, true))
    : COLLECTIONS.map((c) => toUnifiedCollection(c, false));

  return (
    <section id="collections" className="py-24 lg:py-32 bg-white relative overflow-hidden">
      <div className="absolute top-20 left-10 w-64 h-64 bg-amber-400/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-amber-400/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
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
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400"
              initial={{ width: 0 }}
              whileInView={{ width: 64 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
            />
            <motion.span
              className="text-sm font-bold tracking-[0.2em] uppercase text-amber-500"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              Our Products
            </motion.span>
            <motion.div
              className="h-px w-16 bg-gradient-to-l from-transparent to-amber-400"
              initial={{ width: 0 }}
              whileInView={{ width: 64 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
            />
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900"
            style={{ fontFamily: "Georgia, serif" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            Shop by <span className="text-amber-500">Category</span>
          </motion.h2>

          <motion.p
            className="mt-6 text-lg text-gray-500 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            Discover our curated collection of premium fabrics and event essentials
          </motion.p>
        </motion.div>

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[4/5] rounded-3xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        )}

        {!isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {unifiedCollections.map((collection, i) => (
              <CollectionCard key={collection.id} collection={collection} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}