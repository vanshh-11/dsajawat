import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TESTIMONIALS } from "../types";
import { ChevronLeft, ChevronRight, MapPin, Quote, Sparkles, Star } from "lucide-react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = usePrefersReducedMotion();

  // Auto-play functionality — pauses on hover/focus and respects reduced motion
  useEffect(() => {
    if (paused || reduceMotion) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [paused, reduceMotion]);

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 48 : -48,
      opacity: 0,
      scale: 0.99,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 48 : -48,
      opacity: 0,
      scale: 0.99,
    }),
  };

  const active = TESTIMONIALS[currentIndex];

  return (
    <section
      id="reviews"
      aria-labelledby="reviews-title"
      className="relative overflow-hidden border-b border-line bg-gradient-to-b from-amber-50/60 via-paper to-paper py-24 lg:py-32"
    >
      {/* Soft glows */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-amber-300/10 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 9, repeat: Infinity }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-gold/5 blur-3xl"
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 11, repeat: Infinity }}
      />

      <div className="container relative z-10">
        {/* Header */}
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
              Client notes
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

          <h2
            id="reviews-title"
            className="mx-auto max-w-4xl font-serif text-[clamp(2.25rem,5vw,4rem)] font-semibold leading-[1.05] tracking-[-0.01em] text-ink"
          >
            What the trade <span className="italic text-gold">says</span>.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-[15px] leading-[1.85] text-muted md:text-[16px]">
            Decorators, banquet halls and planners — in their own words.
          </p>
        </motion.div>

        {/* Carousel */}
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Client testimonials"
          className="mx-auto mt-12 max-w-4xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node)) {
              setPaused(false);
            }
          }}
        >
          <div className="relative min-h-[440px] sm:min-h-[400px] md:min-h-[380px]">
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.42, ease }}
                role="group"
                aria-roledescription="slide"
                aria-label={`${currentIndex + 1} of ${TESTIMONIALS.length}`}
                className="absolute inset-0 flex items-center justify-center"
              >
                <article className="relative w-full overflow-hidden rounded-3xl border border-line/70 bg-white p-7 shadow-xl shadow-ink/5 md:p-10">
                  <Quote
                    aria-hidden="true"
                    size={140}
                    strokeWidth={1}
                    className="pointer-events-none absolute -bottom-8 right-2 text-gold/[0.07]"
                  />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-4">
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 text-gold shadow-md shadow-amber-200/50">
                        <Quote size={22} strokeWidth={1.5} aria-hidden="true" />
                      </span>
                      <span aria-hidden="true" className="font-serif text-[12px] italic text-muted">
                        {String(currentIndex + 1).padStart(2, "0")} /{" "}
                        {String(TESTIMONIALS.length).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="mt-5 flex items-center gap-1" aria-label="Rated 5 out of 5">
                      {[...Array(5)].map((_, j) => (
                        <Star
                          key={j}
                          size={15}
                          aria-hidden="true"
                          className="fill-gold-bright text-gold-bright"
                        />
                      ))}
                    </div>

                    <blockquote className="mt-4">
                      <p className="font-serif text-[21px] leading-[1.5] text-ink md:text-[25px]">
                        &ldquo;{active.quote}&rdquo;
                      </p>
                    </blockquote>

                    <div className="mt-6 flex flex-col gap-4 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-serif text-[19px] font-semibold leading-tight text-ink md:text-[20px]">
                          {active.name}
                        </p>
                        <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
                          {active.role}
                        </p>
                      </div>
                      <span className="inline-flex w-fit items-center gap-2 rounded-full border border-gold/20 bg-amber-50 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-gold">
                        <MapPin size={12} aria-hidden="true" />
                        {active.city}
                      </span>
                    </div>
                  </div>

                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300"
                  />
                </article>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="mt-8 flex items-center justify-center gap-5">
            <button
              type="button"
              onClick={handlePrevious}
              aria-label="Previous testimonial"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-ink shadow-sm shadow-ink/5 transition-colors duration-300 hover:border-gold/40 hover:text-gold"
            >
              <ChevronLeft size={19} aria-hidden="true" />
            </button>

            <div className="flex items-center gap-1">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setDirection(i > currentIndex ? 1 : -1);
                    setCurrentIndex(i);
                  }}
                  aria-label={`Go to testimonial ${i + 1}`}
                  aria-pressed={i === currentIndex}
                  className="group flex h-6 min-w-[24px] items-center justify-center px-1"
                >
                  <span
                    className={`block h-2 rounded-full transition-all duration-300 ${
                      i === currentIndex
                        ? "w-8 bg-gold"
                        : "w-2 bg-line group-hover:bg-gold/50"
                    }`}
                  />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next testimonial"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-ink shadow-sm shadow-ink/5 transition-colors duration-300 hover:border-gold/40 hover:text-gold"
            >
              <ChevronRight size={19} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
