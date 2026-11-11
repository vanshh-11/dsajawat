import React from "react";
import { motion, type Variants } from "framer-motion";
import {
  ArrowUpRight,
  Award,
  Heart,
  Package,
  Palette,
  Ruler,
  ShieldCheck,
  Sparkles,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { FEATURES } from "../types";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const ICONS: Record<string, LucideIcon> = {
  Palette,
  Ruler,
  Package,
  Truck,
  Award,
  Heart,
};

const grid: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const card: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
};

export default function Features() {
  return (
    <section className="relative overflow-hidden border-b border-line bg-gradient-to-b from-amber-50/60 via-paper to-paper py-24 lg:py-32">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-10 h-80 w-80 rounded-full bg-amber-300/10 blur-3xl"
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
        {/* Centered header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          className="text-center"
        >
          <div className="mb-7 flex items-center justify-center gap-4">
            <motion.span
              aria-hidden="true"
              initial={{ width: 0 }}
              whileInView={{ width: 80 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25, duration: 0.8 }}
              className="hidden h-px bg-gradient-to-r from-transparent to-gold/70 sm:block"
            />
            <span className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.2em] text-gold md:text-[13px]">
              <Sparkles size={14} aria-hidden="true" />
              Why choose us
            </span>
            <motion.span
              aria-hidden="true"
              initial={{ width: 0 }}
              whileInView={{ width: 80 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25, duration: 0.8 }}
              className="hidden h-px bg-gradient-to-l from-transparent to-gold/70 sm:block"
            />
          </div>

          <h2 className="mx-auto max-w-4xl font-serif text-[clamp(2.25rem,5vw,4rem)] font-semibold leading-[1.05] tracking-[-0.01em] text-ink">
            Six reasons the trade{" "}
            <span className="italic text-gold">keeps returning</span>.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-[15px] leading-[1.85] text-muted md:text-[16px]">
            Not a list of claims — the practical things that make a fabric house
            easy to work with, order after order.
          </p>
        </motion.div>

        {/* Quality pledge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, delay: 0.1, ease }}
          className="relative mt-12 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 px-6 py-8 text-white shadow-2xl md:mt-14 md:px-10 md:py-9"
        >
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-amber-400/70 to-transparent"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-amber-400/10 blur-3xl"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-3 -top-6 select-none font-serif text-[7rem] leading-none text-white/[0.05] md:text-[9rem]"
          >
            06
          </span>

          <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4 md:items-center">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-400/10 text-amber-300">
                <ShieldCheck size={24} strokeWidth={1.5} aria-hidden="true" />
              </span>
              <p className="max-w-[48ch] font-serif text-[20px] leading-snug md:text-[23px]">
                Every roll is inspected by hand before it leaves the house —
                sheen, weight and finish.
              </p>
            </div>
            <span className="shrink-0 text-[9px] font-semibold uppercase tracking-[0.26em] text-amber-300/80">
              The quality pledge
            </span>
          </div>
        </motion.div>

        {/* Index grid */}
        <motion.div
          variants={grid}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3"
        >
          {FEATURES.map((feature, i) => {
            const Icon = ICONS[feature.icon] ?? Award;
            return (
              <motion.div
                key={feature.title}
                variants={card}
                className="group relative overflow-hidden rounded-3xl border border-line/70 bg-white p-6 shadow-lg shadow-ink/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl md:p-7"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 text-gold shadow-md shadow-amber-200/50 transition-transform duration-300 group-hover:scale-105">
                    <Icon size={23} strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <span
                    aria-hidden="true"
                    className="font-serif text-[12px] italic text-muted"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="mt-5 font-serif text-[24px] font-semibold leading-snug text-ink md:text-[26px]">
                  {feature.title}
                </h3>
                <p className="mt-2 max-w-[34ch] text-[14px] leading-relaxed text-muted">
                  {feature.desc}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-line/80 pt-4">
                  <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-muted">
                    The D Sajawat standard
                  </span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-gold transition-colors duration-300 group-hover:border-gold group-hover:bg-amber-50">
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </span>
                </div>

                <span
                  aria-hidden="true"
                  className="absolute inset-x-6 bottom-0 h-1 rounded-full bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Closing CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease }}
          className="relative mt-10 overflow-hidden rounded-3xl border border-line/70 bg-gradient-to-br from-amber-50 to-white p-7 shadow-lg shadow-ink/5 md:mt-12 md:p-9"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-amber-300/20 blur-2xl"
          />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
                <Sparkles size={13} aria-hidden="true" />
                Start a conversation
              </p>
              <p className="mt-3 font-serif text-[24px] font-semibold leading-snug text-ink md:text-[28px]">
                Have a specification in mind?
              </p>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">
                Share your measurements, colours and quantity — we&rsquo;ll reply
                within 48 hours.
              </p>
            </div>
            <Link
              to="/collections"
              className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-gold-bright px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink shadow-lg shadow-gold/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-ink hover:text-paper"
            >
              Explore the collections
              <ArrowUpRight
                size={15}
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
