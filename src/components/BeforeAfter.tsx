import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, GripVertical } from "lucide-react";

const transformations = [
  {
    before: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1600&h=1000&fit=crop&q=75&auto=format",
    after: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1600&h=1000&fit=crop&q=75&auto=format",
    title: "Wedding venue transformation",
    short: "The venue",
    desc: "An ordinary ballroom, dressed into a full celebration space.",
  },
  {
    before: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1600&h=1000&fit=crop&q=75&auto=format",
    after: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1600&h=1000&fit=crop&q=75&auto=format",
    title: "Table setting elegance",
    short: "The table",
    desc: "Simple tables finished into a considered dining setting.",
  },
  {
    before: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1600&h=1000&fit=crop&q=75&auto=format",
    after: "https://images.unsplash.com/photo-1529636798458-92182e662485?w=1600&h=1000&fit=crop&q=75&auto=format",
    title: "Stage decoration",
    short: "The stage",
    desc: "A bare stage turned into the room's focal point.",
  },
];

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function BeforeAfter() {
  const [active, setActive] = useState(0);
  const [position, setPosition] = useState(50);
  const frameRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const item = transformations[active];

  useEffect(() => {
    setPosition(50);
  }, [active]);

  useEffect(() => {
    transformations.forEach((entry) => {
      [entry.before, entry.after].forEach((src) => {
        const img = new Image();
        img.src = src;
      });
    });
  }, []);

  const updateFromClientX = (clientX: number) => {
    const el = frameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, next)));
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragging.current = true;
    updateFromClientX(event.clientX);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragging.current) return;
    updateFromClientX(event.clientX);
  };

  const handlePointerEnd = (event: React.PointerEvent<HTMLButtonElement>) => {
    dragging.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <section
      id="work"
      className="relative overflow-hidden border-b border-line bg-paper py-20 md:py-28 lg:py-32"
    >
      <div className="mx-auto max-w-content px-5 md:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
          className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end"
        >
          <div>
            <div className="flex items-center gap-4">
              <span aria-hidden="true" className="h-px w-8 bg-gold md:w-10" />
              <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-gold md:text-[11px]">
                Our work
              </span>
              <span aria-hidden="true" className="text-[10px] font-medium tracking-[0.2em] text-muted">
                03
              </span>
            </div>

            <h2 className="mt-7 font-serif text-[clamp(2.1rem,4.4vw,4rem)] font-light leading-[1.04] tracking-[-0.015em] text-ink">
              See the <span className="italic text-gold">transformation</span>.
            </h2>
          </div>

          <p className="max-w-[42ch] text-[15px] leading-[1.85] text-muted lg:pb-2 lg:justify-self-end">
            Real installations, photographed on site. Drag the handle to move between
            the room as found and the room as finished.
          </p>
        </motion.div>

        {/* Project selector */}
        <div className="mt-10 grid grid-cols-1 border-t border-line sm:grid-cols-3 md:mt-12">
          {transformations.map((entry, index) => {
            const isActive = index === active;
            return (
              <button
                key={entry.title}
                type="button"
                onClick={() => setActive(index)}
                aria-pressed={isActive}
                className={`relative flex items-baseline gap-3 border-b border-line px-1 py-4 text-left transition-colors duration-300 sm:border-b-0 sm:border-r sm:px-5 sm:last:border-r-0 ${
                  isActive ? "text-ink" : "text-muted hover:text-ink"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`font-serif text-[12px] italic transition-colors duration-300 ${
                    isActive ? "text-gold" : "text-muted"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-[10px] font-medium uppercase tracking-[0.18em]">
                  {entry.short}
                </span>
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 bottom-0 h-[2px] origin-left bg-gold transition-transform duration-300 ${
                    isActive ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Comparison frame */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.1, ease }}
          className="mt-8"
        >
          <div
            ref={frameRef}
            onClick={(event) => {
              if ((event.target as HTMLElement).closest("button")) return;
              updateFromClientX(event.clientX);
            }}
            className="relative aspect-[4/3] w-full select-none overflow-hidden rounded-sm border border-line bg-ink/5 md:aspect-[16/9]"
            style={{ touchAction: "pan-y" }}
          >
            <img
              src={item.before}
              alt={`${item.title} — before`}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              decoding="async"
              draggable={false}
            />

            <div
              className="absolute inset-0"
              style={{ clipPath: `inset(0 0 0 ${position}%)` }}
            >
              <img
                src={item.after}
                alt={`${item.title} — after`}
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            </div>

            <span className="pointer-events-none absolute bottom-4 left-4 rounded-full border border-paper/25 bg-ink/35 px-3.5 py-1.5 text-[9px] font-medium uppercase tracking-[0.22em] text-paper backdrop-blur-sm">
              Before
            </span>
            <span className="pointer-events-none absolute bottom-4 right-4 rounded-full border border-paper/25 bg-ink/35 px-3.5 py-1.5 text-[9px] font-medium uppercase tracking-[0.22em] text-paper backdrop-blur-sm">
              After
            </span>

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 z-10 w-px bg-paper/80"
              style={{ left: `${position}%` }}
            />

            <button
              type="button"
              role="slider"
              aria-label="Compare before and after"
              aria-orientation="horizontal"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(position)}
              aria-valuetext={`${Math.round(position)}% before`}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerEnd}
              onPointerCancel={handlePointerEnd}
              onKeyDown={(event) => {
                if (event.key === "ArrowLeft") {
                  event.preventDefault();
                  setPosition((value) => Math.max(0, value - 2));
                } else if (event.key === "ArrowRight") {
                  event.preventDefault();
                  setPosition((value) => Math.min(100, value + 2));
                } else if (event.key === "Home") {
                  event.preventDefault();
                  setPosition(0);
                } else if (event.key === "End") {
                  event.preventDefault();
                  setPosition(100);
                }
              }}
              className="absolute top-1/2 z-20 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border border-line bg-paper text-ink shadow-[0_4px_18px_rgba(23,20,18,0.18)]"
              style={{ left: `${position}%`, touchAction: "none" }}
            >
              <GripVertical size={17} strokeWidth={1.5} />
            </button>
          </div>

          {/* Caption */}
          <div
            aria-live="polite"
            className="mt-6 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
          >
            <div>
              <h3 className="font-serif text-[26px] font-light leading-tight text-ink md:text-[30px]">
                {item.title}
              </h3>
              <p className="mt-1.5 max-w-[52ch] text-[14px] leading-relaxed text-muted">
                {item.desc}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <span className="flex items-center gap-2 text-[9px] font-medium uppercase tracking-[0.18em] text-muted">
                <GripVertical size={12} className="text-gold" aria-hidden="true" />
                Drag to compare
              </span>
              <a
                href="#contact"
                onClick={(event) => {
                  event.preventDefault();
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-gold-bright px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink transition-colors duration-300 hover:bg-ink hover:text-paper"
              >
                Start your project
                <ArrowUpRight
                  size={14}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
