import React, { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowDown } from "lucide-react";

const FRAMES = [
  "/images/frames/frame_1.png",
  "/images/frames/frame_2.png",
  "/images/frames/frame_3.png",
  "/images/frames/frame_4.png",
  "/images/frames/frame_5.png",
  "/images/frames/frame_6.png",
  "/images/frames/frame_7.png",
  "/images/frames/frame_8.png",
  "/images/frames/frame_9.png",
];



interface HeroScrollProps {
  onOpenQuote?: () => void;
}

export default function HeroScroll({ onOpenQuote }: HeroScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress of the entire container (250vh scroll track)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth the scroll input to prevent jumpiness and enable buttery crossfading
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 45,
    damping: 26,
    restDelta: 0.001,
  });

  // Ken Burns Panning (Dynamic Zoom Focal Point)
  const bgScale = useTransform(smoothProgress, [0, 0.25, 0.5, 0.75, 1], [1.0, 1.02, 1.03, 1.02, 1.0]);
  const bgX = useTransform(smoothProgress, [0, 0.25, 0.5, 0.75, 1], ["0%", "-1.0%", "1.0%", "-0.5%", "0%"]);
  const bgY = useTransform(smoothProgress, [0, 0.25, 0.5, 0.75, 1], ["0%", "0.5%", "-0.8%", "0.8%", "0%"]);
  const bgOpacity = useTransform(smoothProgress, [0, 0.7, 1], [0.95, 0.9, 0.85]);

  // General helpers
  const arrowOpacity = useTransform(smoothProgress, [0, 0.12], [1, 0]);

  // Preload frame images to avoid flickering during scrolling
  useEffect(() => {
    FRAMES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  return (
    <div ref={containerRef} className="relative h-[400vh] bg-dark overflow-visible">
      {/* Sticky viewport wrapper */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        
        {/* Immersive background media with parallax zoom */}
        <motion.div
          className="absolute inset-0 overflow-hidden"
          style={{
            scale: bgScale,
            x: bgX,
            y: bgY,
            opacity: bgOpacity,
            willChange: "transform, opacity",
          }}
        >
          {/* Render all frames and step their opacity on scroll (no fade transitions) */}
          {FRAMES.map((src, i) => {
            const opacity = useTransform(smoothProgress, (p) => {
              const activeIdx = Math.min(8, Math.max(0, Math.round(p * 8)));
              return activeIdx === i ? 1 : 0;
            });

            return (
              <motion.img
                key={i}
                src={src}
                alt={`Wedding Venue Frame ${i + 1}`}
                style={{ opacity }}
                className="absolute inset-0 w-full h-full object-cover"
                loading="eager"
              />
            );
          })}


        </motion.div>

        {/* Ambient Dark Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/95 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.8) 100%) pointer-events-none" />

        {/* Custom CSS for offloading sparks animation to GPU compositor */}
        <style>{`
          @keyframes floatSpark {
            0% {
              transform: translateY(0) scale(0.2);
              opacity: 0;
            }
            50% {
              opacity: 0.7;
            }
            100% {
              transform: translateY(-90px) scale(1.25);
              opacity: 0;
            }
          }
          .gpu-spark {
            animation: floatSpark var(--duration) ease-in-out var(--delay) infinite;
            will-change: transform, opacity;
          }
        `}</style>

        {/* Floating Sparks (GPU Accelerated) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
          {[...Array(14)].map((_, i) => {
            const size = 1 + (i % 3) * 0.5;
            const duration = 4.5 + (i % 4) * 0.8;
            const delay = i * 0.3;
            return (
              <div
                key={i}
                className="absolute rounded-full gpu-spark"
                style={{
                  width: size,
                  height: size,
                  left: `${5 + ((i * 7.3) % 90)}%`,
                  top: `${10 + ((i * 8.7) % 80)}%`,
                  background: `rgba(212, 175, 55, ${0.25 + (i % 3) * 0.15})`,
                  "--duration": `${duration}s`,
                  "--delay": `${delay}s`,
                } as React.CSSProperties}
              />
            );
          })}
        </div>

        {/* Scroll Indicator (Visible initially, fades as you scroll) */}
        <motion.div
          style={{ opacity: arrowOpacity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-25 text-center flex flex-col items-center gap-2"
        >
          <p className="text-white/60 text-xs uppercase tracking-[0.2em] font-medium">
            Scroll to begin
          </p>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-sm"
          >
            <ArrowDown className="text-amber-400" size={14} />
          </motion.div>
        </motion.div>

      </div>
      
      {/* Background spacer for the remainder of the scroll track */}
      <div className="h-px bg-transparent pointer-events-none" />
    </div>
  );
}
