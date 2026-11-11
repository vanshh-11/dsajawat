import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import Collections from "../components/Collections";
import Footer from "../components/Footer";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const META = ["08 series", "MOQ from 10 m", "48-hr dispatch"];

export default function CollectionsPage() {
  return (
    <>
      <main id="main-content">
        {/* Page header */}
        <section className="relative overflow-hidden border-b border-line bg-gradient-to-b from-amber-50/60 via-paper to-paper pb-16 pt-24 md:pb-20 md:pt-28">
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -left-24 top-8 h-80 w-80 rounded-full bg-amber-300/10 blur-3xl"
            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 9, repeat: Infinity }}
          />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-gold/5 blur-3xl"
            animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 11, repeat: Infinity }}
          />

          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
              className="flex items-center justify-between gap-4"
            >
              <Link
                to="/"
                className="group inline-flex min-h-[44px] items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted transition-colors duration-300 hover:text-ink"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-white text-ink shadow-sm shadow-ink/5 transition-colors duration-300 group-hover:border-gold/40 group-hover:text-gold">
                  <ArrowLeft size={14} aria-hidden="true" />
                </span>
                Back to home
              </Link>
            </motion.div>

            <div className="mt-12 text-center md:mt-16">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease }}
              >
                <div className="mb-7 flex items-center justify-center gap-4">
                  <motion.span
                    aria-hidden="true"
                    initial={{ width: 0 }}
                    animate={{ width: 80 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="hidden h-px bg-gradient-to-r from-transparent to-gold/70 sm:block"
                  />
                  <span className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.2em] text-gold md:text-[13px]">
                    <Sparkles size={14} aria-hidden="true" />
                    The collections
                  </span>
                  <motion.span
                    aria-hidden="true"
                    initial={{ width: 0 }}
                    animate={{ width: 80 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="hidden h-px bg-gradient-to-l from-transparent to-gold/70 sm:block"
                  />
                </div>

                <h1 className="mx-auto max-w-4xl font-serif text-[clamp(2.25rem,5.4vw,4.25rem)] font-semibold leading-[1.05] tracking-[-0.01em] text-ink">
                  Our collections, finished for every{" "}
                  <span className="gold-shimmer italic">celebration</span>.
                </h1>

                <p className="mx-auto mt-6 max-w-2xl text-[15px] leading-[1.85] text-muted md:text-[16px]">
                  Premium drapes, table linen and event finishes — a curated range for
                  decorators, banquet halls and planners across India.
                </p>
              </motion.div>

              {/* Meta rail */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease }}
                className="mx-auto mt-9 flex max-w-xl flex-wrap items-center justify-center gap-x-5 gap-y-3 border-y border-line py-4 text-[9px] font-semibold uppercase tracking-[0.22em] text-muted"
              >
                {META.map((item, index) => (
                  <React.Fragment key={item}>
                    {index > 0 && (
                      <span aria-hidden="true" className="hidden h-4 w-px bg-line sm:block" />
                    )}
                    <span className="flex items-center gap-2">
                      {index === 0 && (
                        <span
                          aria-hidden="true"
                          className="h-1.5 w-1.5 rounded-full bg-gold-bright"
                        />
                      )}
                      {item}
                    </span>
                  </React.Fragment>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Collections grid */}
        <Collections />
      </main>

      <Footer />
    </>
  );
}
