import React, { useState } from "react";
import { motion } from "framer-motion";
import { BRAND } from "../types";
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  Loader2,
  MapPin,
  Phone,
  Send,
  Sparkles,
} from "lucide-react";
import { useInquiry } from "../hooks/useInquiry";

const WhatsAppIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const labelClass =
  "mb-2 block text-[9px] font-semibold uppercase tracking-[0.2em] text-muted";
const fieldClass =
  "w-full rounded-xl border border-line/80 bg-[#FFFDF9] px-4 py-3 text-[14px] text-ink shadow-sm shadow-ink/[0.02] transition-colors duration-200 placeholder:text-muted/50 focus:border-gold/60 focus:outline-none focus:ring-2 focus:ring-gold/15";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", phone: "", eventType: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const { submit, isSubmitting } = useInquiry();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await submit(formData, {
      source: "contact",
      onSuccess: () => {
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
      },
    });
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative overflow-hidden border-b border-line bg-gradient-to-b from-paper via-paper to-amber-50/50 py-24 lg:py-32"
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
        className="pointer-events-none absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-gold/5 blur-3xl"
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
              Get in touch
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
            id="contact-title"
            className="mx-auto max-w-4xl font-serif text-[clamp(2.25rem,5vw,4rem)] font-semibold leading-[1.05] tracking-[-0.01em] text-ink"
          >
            Let&rsquo;s decorate your <span className="italic text-gold">event</span>.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-[15px] leading-[1.85] text-muted md:text-[16px]">
            Whether you need a single table cover or bulk supplies — we deliver across
            India with the same care every time.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start lg:gap-12">
          {/* Left — studio details */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, ease }}
            className="space-y-4"
          >
            {/* Location */}
            <div className="group relative overflow-hidden rounded-3xl border border-line/70 bg-white p-6 shadow-lg shadow-ink/5 transition-shadow duration-300 hover:shadow-xl md:p-7">
              <div className="flex items-center gap-5">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 text-gold shadow-md shadow-amber-200/50">
                  <MapPin size={22} strokeWidth={1.5} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-gold">
                    The studio
                  </p>
                  <p className="mt-1.5 font-serif text-[20px] leading-snug text-ink md:text-[22px]">
                    {BRAND.location}
                  </p>
                  <p className="mt-1 text-[11px] text-muted">By appointment · Mon–Sat</p>
                </div>
              </div>
              <span
                aria-hidden="true"
                className="absolute inset-x-6 bottom-0 h-1 rounded-full bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
            </div>

            {/* Phone */}
            <div className="group relative overflow-hidden rounded-3xl border border-line/70 bg-white p-6 shadow-lg shadow-ink/5 transition-shadow duration-300 hover:shadow-xl md:p-7">
              <div className="flex items-start gap-5">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 text-gold shadow-md shadow-amber-200/50">
                  <Phone size={22} strokeWidth={1.5} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-gold">
                    Call the studio
                  </p>
                  <div className="mt-1.5 flex flex-col gap-1">
                    {BRAND.phones.map((phone) => (
                      <a
                        key={phone}
                        href={`tel:${phone}`}
                        className="w-fit font-serif text-[19px] leading-snug text-ink transition-colors duration-300 hover:text-gold md:text-[20px]"
                      >
                        {phone}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <span
                aria-hidden="true"
                className="absolute inset-x-6 bottom-0 h-1 rounded-full bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
            </div>

            {/* WhatsApp strip */}
            <a
              href={`https://wa.me/${BRAND.whatsapp[0]}?text=Hi! I visited your website and would like to inquire about D SAJAWAT fabrics.`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-between gap-4 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 px-6 py-6 text-paper shadow-2xl transition-shadow duration-300 hover:shadow-[0_30px_70px_-30px_rgba(23,17,13,0.55)] md:px-7"
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-amber-400/70 to-transparent"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-amber-400/10 blur-2xl"
              />
              <span className="relative flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-400/10 text-amber-300">
                  <WhatsAppIcon size={22} />
                </span>
                <span>
                  <span className="block text-[9px] font-semibold uppercase tracking-[0.24em] text-amber-300/80">
                    Prefer to chat?
                  </span>
                  <span className="mt-1 block font-serif text-[20px] leading-tight text-paper">
                    WhatsApp the studio
                  </span>
                </span>
              </span>
              <span
                aria-hidden="true"
                className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-paper/20 text-paper transition-colors duration-300 group-hover:border-amber-300/60 group-hover:text-amber-300"
              >
                <ArrowUpRight size={15} />
              </span>
            </a>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, delay: 0.08, ease }}
            className="relative overflow-hidden rounded-3xl border border-line/70 bg-white p-7 shadow-xl shadow-ink/5 md:p-9"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-amber-300/20 blur-2xl"
            />

            <div className="relative z-10">
              <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
                <Sparkles size={12} aria-hidden="true" />
                Write to us
              </p>
              <h3 className="mt-2 font-serif text-[26px] font-semibold leading-tight text-ink md:text-[30px]">
                Send a <span className="italic text-gold">message</span>
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-muted">
                Tell us what you&rsquo;re planning — we reply within 24 hours.
              </p>

              <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" className={labelClass}>
                      Your name <span className="text-gold">*</span>
                    </label>
                    <input
                      id="contact-name"
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
                    <label htmlFor="contact-phone" className={labelClass}>
                      Phone <span className="text-gold">*</span>
                    </label>
                    <input
                      id="contact-phone"
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
                  <label htmlFor="contact-event" className={labelClass}>
                    Event type
                  </label>
                  <div className="relative">
                    <select
                      id="contact-event"
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
                  <label htmlFor="contact-message" className={labelClass}>
                    Your message
                  </label>
                  <textarea
                    id="contact-message"
                    className={`${fieldClass} resize-none`}
                    rows={4}
                    placeholder="Tell us about your requirements..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || submitted}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-gold-bright px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink shadow-lg shadow-gold/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:bg-gold-bright disabled:hover:text-ink"
                >
                  {submitted ? (
                    <Check size={16} aria-hidden="true" />
                  ) : isSubmitting ? (
                    <Loader2 size={16} aria-hidden="true" className="animate-spin" />
                  ) : (
                    <Send size={15} aria-hidden="true" />
                  )}
                  <span aria-live="polite">
                    {submitted
                      ? "Sent successfully"
                      : isSubmitting
                      ? "Sending…"
                      : "Send inquiry"}
                  </span>
                </button>
              </form>

              <p className="mt-4 border-t border-line pt-4 text-center text-[10px] font-medium uppercase tracking-[0.18em] text-muted">
                Pan-India delivery · MOQ from 10 m
              </p>
            </div>

            <span
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
