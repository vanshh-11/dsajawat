import React from "react";
import { motion, type Variants } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { STATS } from "../types";
import CountUp from "./ui/CountUp";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const MAIN_IMAGE =
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&h=1500&fit=crop&q=75&auto=format";

const CHIPS = ["Drapes", "Table linen", "Sashes", "Florals"];

const statsContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const statItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
};

export default function About() {
  return (
    <section
      id="about"
      className="relative overflow-hidden border-b border-line bg-gradient-to-b from-amber-50/60 via-paper to-paper py-24 lg:py-32"
    >
      {/* Soft glows, matching the closing sections */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-4 h-80 w-80 rounded-full bg-amber-300/10 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 9, repeat: Infinity }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 bottom-10 h-72 w-72 rounded-full bg-gold/5 blur-3xl"
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 11, repeat: Infinity }}
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
              About the house
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
            A fabric house from Ludhiana, adorning India&rsquo;s grandest{" "}
            <span className="italic text-gold">celebrations</span>.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-[15px] leading-[1.85] text-muted md:text-[16px]">
            For over a decade, D SAJAWAT has been the quiet hand behind some of the
            country&rsquo;s most considered wedding venues.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-14 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-16">
          {/* Narrative */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease }}
          >
            <div className="rounded-3xl border border-line/70 bg-white p-7 shadow-lg shadow-ink/5 md:p-9">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
                  <Sparkles size={13} aria-hidden="true" />
                  Our craft
                </span>
                <span aria-hidden="true" className="font-serif text-[13px] italic text-muted">
                  01 / 03
                </span>
              </div>

              <div className="mt-5 space-y-4 text-[15px] leading-[1.85] text-muted md:text-[16px]">
                <p>
                  We source, finish and supply premium fabrics — drapes, covers,
                  sashes and florals — chosen for sheen, weight and how they fall.
                </p>
                <p>
                  From a single roll to a banquet&rsquo;s worth, we deliver across
                  India — on time, and in finish.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {CHIPS.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-gold/20 bg-amber-50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold"
                  >
                    {chip}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-3">
                <Link
                  to="/collections"
                  className="group inline-flex min-h-[44px] items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink"
                >
                  <span className="border-b border-gold pb-1 transition-colors group-hover:border-ink">
                    Explore the collections
                  </span>
                  <ArrowUpRight
                    size={14}
                    aria-hidden="true"
                    className="text-gold transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Image composition */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.75, delay: 0.1, ease }}
            className="relative mx-auto w-full max-w-[560px] lg:mx-0 lg:max-w-none"
          >
            <div className="relative rounded-[28px] border border-line/70 bg-white p-2.5 shadow-xl shadow-ink/10">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] bg-line md:aspect-[5/6]">
                <img
                  src={MAIN_IMAGE}
                  alt="A banqueting hall dressed in D Sajawat fabric"
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/5 to-ink/10"
                />
              </div>

              <div
                aria-hidden="true"
                className="mt-2.5 h-1 rounded-full bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300"
              />
            </div>
          </motion.div>
        </div>

        {/* Stats band */}
        <motion.div
          variants={statsContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-20 grid grid-cols-2 gap-4 md:mt-24 md:grid-cols-4 md:gap-5"
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={statItem}
              className="group relative overflow-hidden rounded-3xl border border-line/70 bg-white p-5 shadow-lg shadow-ink/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:p-6"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 text-gold shadow-sm shadow-amber-200/60">
                  <Sparkles size={15} aria-hidden="true" />
                </span>
                <span
                  aria-hidden="true"
                  className="font-serif text-[11px] italic text-muted"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <span
                aria-hidden="true"
                className="mt-5 block font-serif text-[38px] font-light leading-none text-ink md:text-[50px]"
              >
                <CountUp
                  to={stat.value}
                  from={0}
                  duration={1.8}
                  easing="easeOut"
                  separator=","
                  trigger="view"
                />
                <span className="text-gold">{stat.suffix}</span>
              </span>
              <span className="sr-only">
                {stat.value.toLocaleString("en-IN")}
                {stat.suffix} {stat.label}
              </span>
              <span
                aria-hidden="true"
                className="mt-3 block text-[9px] font-semibold uppercase leading-relaxed tracking-[0.18em] text-muted md:text-[10px]"
              >
                {stat.label}
              </span>

              <span
                aria-hidden="true"
                className="absolute inset-x-5 bottom-0 h-1 rounded-full bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
            </motion.div>
          ))}
        </motion.div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-[12px] leading-relaxed text-muted">
          Supplied to decorators, banquet halls and planners across India — with a
          minimum order from 10 metres and 48-hour dispatch on stocked lines.
        </p>
      </div>
    </section>
  );
}
