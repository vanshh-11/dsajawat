import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BRAND } from "../types";
import BlurText from "./ui/BlurText";
import Magnet from "./ui/Magnet";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const HERO_IMAGE = "/images/frames/webp/frame_1.webp";

const HEADLINE = [
  <>Fabrics for the</>,
  <><span className="gold-shimmer italic">celebrations</span> India</>,
  <>remembers.</>,
];

const SUPPORTING =
  "Premium drapes, table linen and event finishes — supplied to decorators, banquet halls and planners across India.";

const PARAGRAPH_CLASS =
  "mt-6 max-w-[500px] text-[14px] leading-relaxed text-paper/75 md:text-[15px] lg:text-[16px]";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const CORNERS = [
  "left-4 top-4 border-l border-t md:left-6 md:top-6",
  "right-4 top-4 border-r border-t md:right-6 md:top-6",
  "bottom-4 left-4 border-b border-l md:bottom-6 md:left-6",
  "bottom-4 right-4 border-b border-r md:bottom-6 md:right-6",
];

interface HeroScrollProps {
  onOpenQuote?: () => void;
}

function HeroCopy({ onOpenQuote }: HeroScrollProps) {
  const navigate = useNavigate();
  const reduce = usePrefersReducedMotion();

  return (
    <div className="w-full max-w-[760px]">
      <h1 className="font-serif font-light leading-[0.98] tracking-[-0.02em] text-paper text-[clamp(2.5rem,11vw,3.6rem)] md:text-[clamp(3rem,5.6vw,5.4rem)]">
        {HEADLINE.map((line, index) => (
          <span key={index} className="block overflow-hidden pb-[0.06em]">
            <motion.span
              className="block will-change-transform"
              initial={reduce ? false : { y: "112%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.95, delay: 0.08 + index * 0.11, ease }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </h1>

      {reduce ? (
        <p className={PARAGRAPH_CLASS}>{SUPPORTING}</p>
      ) : (
        <BlurText
          text={SUPPORTING}
          className={PARAGRAPH_CLASS}
          animateBy="words"
          direction="top"
          effect="blur"
          blur={6}
          distance={10}
          delay={26}
          stepDuration={0.32}
          trigger="load"
        />
      )}

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.62, ease }}
        className="mt-8 flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center"
      >
        <Magnet
          wrapperClassName="w-full md:w-auto"
          magnetStrength={14}
          maxOffset={8}
          padding={70}
          scale={1}
          axis="both"
        >
          <button
            type="button"
            onClick={() => navigate("/collections")}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold-bright px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink shadow-lg shadow-gold/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-paper md:w-auto"
          >
            Explore Collections
            <ArrowRight
              size={15}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>
        </Magnet>
        <button
          type="button"
          onClick={onOpenQuote}
          className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-paper/30 bg-white/5 px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-paper backdrop-blur-sm transition-colors duration-300 hover:border-paper hover:bg-paper hover:text-ink md:w-auto"
        >
          Request a Quote
          <ArrowUpRight
            size={15}
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </button>
      </motion.div>

      <div className="mt-8 flex items-center gap-3 border-t border-paper/15 pt-5 md:hidden">
        <Phone size={13} className="text-gold-bright" aria-hidden="true" />
        <a
          href={`tel:${BRAND.phones[0]}`}
          className="inline-flex min-h-[44px] items-center text-[11px] font-medium uppercase tracking-[0.16em] text-paper/70"
        >
          Call the studio
        </a>
        <span aria-hidden="true" className="h-3 w-px bg-paper/20" />
        <span className="text-[10px] uppercase tracking-[0.16em] text-paper/50">
          Reply within 48 hrs
        </span>
      </div>
    </div>
  );
}

export default function HeroScroll({ onOpenQuote }: HeroScrollProps) {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-end overflow-hidden bg-deep md:min-h-screen md:items-center"
    >
      <img
        src={HERO_IMAGE}
        alt="D Sajawat draped fabric setting"
        className="absolute inset-0 h-full w-full object-cover object-[62%_center] md:object-center"
        loading="eager"
        decoding="async"
        draggable={false}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/75 via-ink/35 to-ink/90 md:bg-gradient-to-r md:from-ink/90 md:via-ink/45 md:to-ink/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-transparent md:hidden"
      />

      {/* Editorial frame */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-3 z-10 border border-paper/15 md:inset-5"
      />
      {CORNERS.map((corner) => (
        <span
          key={corner}
          aria-hidden="true"
          className={`pointer-events-none absolute z-10 h-5 w-5 border-gold-bright/60 md:h-6 md:w-6 ${corner}`}
        />
      ))}

      <div className="container relative z-10 pb-24 pt-28 md:pb-28 md:pt-24">
        <HeroCopy onOpenQuote={onOpenQuote} />
      </div>

      {/* Bottom rail */}
      <div className="absolute inset-x-0 bottom-0 z-10 hidden border-t border-paper/15 md:block">
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-bright/50 to-transparent"
        />
        <div className="container flex h-16 items-center justify-end">
          <div className="flex items-center gap-4">
            <span className="text-[9px] font-medium uppercase tracking-[0.24em] text-paper/55">
              Scroll to explore
            </span>
            <span aria-hidden="true" className="relative h-8 w-px bg-paper/20">
              <span className="absolute inset-x-0 top-0 h-3 bg-gold-bright" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
