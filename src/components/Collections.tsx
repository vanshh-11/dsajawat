import React, { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { COLLECTIONS, Collection } from "../types";
import { useProducts, Product } from "../hooks/useProducts";
import { ArrowUpRight, Sparkles } from "lucide-react";

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

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const grid: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const card: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
};

interface CollectionCardProps {
  collection: UnifiedCollection;
}

function CollectionCard({ collection }: CollectionCardProps) {
  const { image, title, overline, desc } = collection;

  return (
    <motion.article
      variants={card}
      className="group relative overflow-hidden rounded-3xl border border-line/70 bg-white p-2.5 shadow-lg shadow-ink/5 transition-shadow duration-300 hover:shadow-xl"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-line">
        <img
          src={image}
          alt={title}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/25 to-transparent"
        />

        <span className="absolute left-3 top-3 rounded-full border border-paper/30 bg-ink/30 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.2em] text-paper backdrop-blur-sm">
          {overline}
        </span>

        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="flex items-center gap-1.5 text-[8px] font-semibold uppercase tracking-[0.24em] text-gold-bright">
            <Sparkles size={9} aria-hidden="true" />
            The collection
          </p>
          <h3 className="mt-2 font-serif text-[22px] font-semibold leading-tight text-paper">
            {title}
          </h3>
          <p className="mt-2 line-clamp-2 text-[12px] leading-relaxed text-paper/70">
            {desc}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 px-2 pb-1 pt-3">
        <span className="text-[8px] font-semibold uppercase tracking-[0.22em] text-muted">
          Hand-finished · Ludhiana
        </span>
        <span
          aria-hidden="true"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-amber-200 text-gold shadow-sm shadow-amber-200/60 transition-transform duration-300 group-hover:scale-105"
        >
          <ArrowUpRight size={13} />
        </span>
      </div>

      <span
        aria-hidden="true"
        className="mx-2 mb-1 mt-2 block h-1 rounded-full bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
    </motion.article>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-3xl border border-line/70 bg-white p-2.5 shadow-sm shadow-ink/5">
      <div className="aspect-[4/5] animate-pulse rounded-2xl bg-line/70" />
      <div className="flex items-center justify-between px-2 pb-1 pt-3">
        <div className="h-2.5 w-24 animate-pulse rounded-full bg-line/70" />
        <div className="h-8 w-8 animate-pulse rounded-full bg-line/60" />
      </div>
      <div className="mx-2 mb-1 mt-2 h-1 rounded-full bg-line/50" />
    </div>
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
    <section
      id="collections"
      className="relative overflow-hidden border-b border-line bg-paper py-20 lg:py-24"
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-16 h-80 w-80 rounded-full bg-amber-300/10 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-gold/5 blur-3xl"
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      <div className="container relative z-10">
        {/* Archive toolbar */}
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
          <div>
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
              <Sparkles size={12} aria-hidden="true" />
              The archive
            </p>
            <h2 className="mt-2 font-serif text-[22px] italic leading-snug text-ink">
              Eight series, one standard.
            </h2>
          </div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-muted">
            {isLoading
              ? "Loading the archive"
              : `${String(unifiedCollections.length).padStart(2, "0")} series`}
          </p>
        </div>

        {isLoading && (
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {!isLoading && (
          <motion.div
            variants={grid}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4"
          >
            {unifiedCollections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
