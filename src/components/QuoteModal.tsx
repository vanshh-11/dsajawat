import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Loader2, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { BRAND } from "../types";
import { useInquiry } from "../hooks/useInquiry";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const labelClass =
  "mb-2 block text-[9px] font-semibold uppercase tracking-[0.2em] text-muted";
const fieldClass =
  "w-full rounded-xl border border-line/80 bg-[#FFFDF9] px-4 py-3 text-[14px] text-ink shadow-sm shadow-ink/[0.02] transition-colors duration-200 placeholder:text-muted/50 focus:border-gold/60 focus:outline-none focus:ring-2 focus:ring-gold/15";

export default function QuoteModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({ name: "", phone: "", eventType: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { submit } = useInquiry();
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => firstFieldRef.current?.focus(), 90);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
      if (previouslyFocused && previouslyFocused !== document.body) {
        previouslyFocused.focus();
      }
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await submit(formData, {
      source: "quote",
      onSuccess: () => {
        onClose();
      },
      onError: () => {
        // Error handled in hook (WhatsApp fallback)
        onClose();
      },
    });

    setIsSubmitting(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="quote-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          {/* Backdrop */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-ink/55 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="quote-title"
            initial={{ opacity: 0, y: 24, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.985 }}
            transition={{ duration: 0.35, ease }}
            className="relative z-10 max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto overscroll-contain rounded-3xl border border-line/70 bg-paper shadow-2xl"
          >
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 z-10 h-1 bg-gradient-to-r from-transparent via-amber-400/70 to-transparent"
            />

            {/* Header */}
            <div className="relative overflow-hidden border-b border-line/80 bg-gradient-to-r from-amber-50/80 via-paper to-paper px-6 py-6 md:px-8">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-amber-300/20 blur-2xl"
              />
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <p className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.24em] text-gold">
                    <Sparkles size={12} aria-hidden="true" />
                    Start a conversation
                  </p>
                  <h2
                    id="quote-title"
                    className="mt-2 font-serif text-[26px] font-semibold leading-tight text-ink md:text-[30px]"
                  >
                    Request a <span className="italic text-gold">quote</span>
                  </h2>
                  <p className="mt-2 max-w-[36ch] text-[12px] leading-relaxed text-muted">
                    Share the brief — quantities, colours, dates. We reply within 24 hours.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close quote form"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-white text-ink shadow-sm shadow-ink/5 transition-colors duration-300 hover:border-gold/40 hover:text-gold"
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Form */}
            <div className="px-6 py-6 md:px-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="quote-name" className={labelClass}>
                      Your name <span className="text-gold">*</span>
                    </label>
                    <input
                      id="quote-name"
                      ref={firstFieldRef}
                      type="text"
                      required
                      autoComplete="name"
                      className={fieldClass}
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="quote-phone" className={labelClass}>
                      Phone <span className="text-gold">*</span>
                    </label>
                    <input
                      id="quote-phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      className={fieldClass}
                      placeholder="Your phone number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="quote-event" className={labelClass}>
                    Event type
                  </label>
                  <div className="relative">
                    <select
                      id="quote-event"
                      className={`${fieldClass} appearance-none pr-10`}
                      value={formData.eventType}
                      onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    >
                      <option value="">Select event type</option>
                      <option value="Wedding">Wedding</option>
                      <option value="Corporate Event">Corporate Event</option>
                      <option value="Birthday Party">Birthday Party</option>
                      <option value="Festival">Festival</option>
                      <option value="Other">Other</option>
                    </select>
                    <ChevronDown
                      size={15}
                      aria-hidden="true"
                      className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="quote-message" className={labelClass}>
                    Your requirements
                  </label>
                  <textarea
                    id="quote-message"
                    className={`${fieldClass} resize-none`}
                    rows={3}
                    placeholder="Tell us about your requirements..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-gold-bright px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink shadow-lg shadow-gold/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:bg-gold-bright disabled:hover:text-ink"
                >
                  {isSubmitting ? (
                    <Loader2 size={16} aria-hidden="true" className="animate-spin" />
                  ) : (
                    <Send size={15} aria-hidden="true" />
                  )}
                  {isSubmitting ? "Sending…" : "Send quote request"}
                </button>
              </form>

              <div className="mt-4 flex flex-col gap-2 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[10px] leading-relaxed text-muted">Mon–Sat · 10am–7pm IST</p>
                <a
                  href={`https://wa.me/${BRAND.whatsapp[0]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[36px] items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink transition-colors duration-300 hover:text-gold"
                >
                  <MessageCircle size={13} aria-hidden="true" className="text-gold" />
                  Prefer WhatsApp?
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
