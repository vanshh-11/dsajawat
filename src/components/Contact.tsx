import React, { useState } from "react";
import { motion } from "framer-motion";
import { BRAND } from "../types";
import { MapPin, Phone, Send, Sparkles, Check } from "lucide-react";
import { useInquiry } from "../hooks/useInquiry";

const WhatsAppIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", phone: "", eventType: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const { submit, isSubmitting } = useInquiry();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await submit(formData, {
      source: "contact",
      onSuccess: () => {
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
      },
    });
  };

  return (
    <section id="contact" className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-50/50 via-white to-white" />

      {/* Decorative Elements */}
      <motion.div
        className="absolute top-10 left-10 w-40 h-40 bg-amber-400/10 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-60 h-60 bg-amber-300/10 rounded-full blur-3xl"
        animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-1/2 left-1/4 w-4 h-4 bg-amber-400/50 rounded-full"
        animate={{ y: [0, -20, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-1/3 right-1/4 w-3 h-3 bg-amber-300/60 rounded-full"
        animate={{ y: [0, 15, 0], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="flex items-center justify-center gap-4 mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <motion.div
              className="h-px w-20 bg-gradient-to-r from-transparent to-amber-400"
              initial={{ width: 0 }}
              whileInView={{ width: 80 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
            />
            <motion.span
              className="text-sm font-bold tracking-[0.2em] uppercase text-amber-500 flex items-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles size={14} />
              Get In Touch
            </motion.span>
            <motion.div
              className="h-px w-20 bg-gradient-to-l from-transparent to-amber-400"
              initial={{ width: 0 }}
              whileInView={{ width: 80 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
            />
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900"
            style={{ fontFamily: "Georgia, serif" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Let&apos;s decorate your <span className="text-amber-500">event</span>
          </motion.h2>

          <motion.p
            className="mt-6 text-lg text-gray-500 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            Whether you need a single table cover or bulk supplies - we deliver Pan India with the same care every time.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start max-w-6xl mx-auto">
          {/* Left - Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {/* Location Card */}
            <motion.div
              className="group bg-white rounded-3xl p-7 shadow-lg shadow-gray-100 overflow-hidden relative cursor-pointer"
              whileHover={{
                y: -8,
                boxShadow: "0 25px 50px rgba(0,0,0,0.12)",
                scale: 1.02
              }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-amber-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
              <div className="relative z-10 flex items-center gap-6">
                <motion.div
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <MapPin size={28} className="text-amber-600" />
                </motion.div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-500 block mb-2">Location</span>
                  <span className="font-semibold text-xl text-gray-900">{BRAND.location}</span>
                </div>
              </div>
            </motion.div>

            {/* Phone Card */}
            <motion.div
              className="group bg-white rounded-3xl p-7 shadow-lg shadow-gray-100 overflow-hidden relative cursor-pointer"
              whileHover={{
                y: -8,
                boxShadow: "0 25px 50px rgba(0,0,0,0.12)",
                scale: 1.02
              }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
              <div className="relative z-10 flex items-center gap-6">
                <motion.div
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <Phone size={28} className="text-green-600" />
                </motion.div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-green-500 block mb-2">Phone</span>
                  <div className="flex flex-col sm:flex-row sm:gap-4">
                    <a href={`tel:${BRAND.phones[0]}`} className="font-semibold text-lg text-gray-900 hover:text-green-500 transition-colors">
                      {BRAND.phones[0]}
                    </a>
                    <a href={`tel:${BRAND.phones[1]}`} className="font-semibold text-lg text-gray-900 hover:text-green-500 transition-colors">
                      {BRAND.phones[1]}
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* WhatsApp CTA */}
            <motion.a
              href={`https://wa.me/${BRAND.whatsapp[0]}?text=Hi! I visited your website and would like to inquire about D SAJAWAT fabrics.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-5 px-8 py-6 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-3xl shadow-xl shadow-green-500/30 relative overflow-hidden group"
              whileHover={{
                scale: 1.03,
                boxShadow: "0 25px 80px rgba(34, 197, 94, 0.5)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Shine Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "200%" }}
                transition={{ duration: 0.6 }}
              />
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative z-10"
              >
                <WhatsAppIcon size={30} />
              </motion.div>
              <span className="text-xl relative z-10">Chat on WhatsApp</span>
            </motion.a>
          </motion.div>

          {/* Right - Enhanced Form */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-3xl p-8 lg:p-10 shadow-xl shadow-gray-200/50 relative overflow-hidden"
          >
            {/* Decorative Corner */}
            <motion.div
              className="absolute -top-10 -right-10 w-40 h-40 bg-amber-400/10 rounded-full blur-2xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 5, repeat: Infinity }}
            />

            <div className="relative z-10">
              <motion.h3
                className="text-2xl lg:text-3xl font-bold text-gray-900 mb-8"
                style={{ fontFamily: "Georgia, serif" }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Send us a message
              </motion.h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name & Phone Row */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                  >
                    <label className="text-xs font-bold uppercase tracking-[0.15em] text-gray-500 block mb-3">Your Name *</label>
                    <motion.input
                      type="text"
                      required
                      className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 transition-all text-gray-800 bg-gray-50/50"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      whileFocus={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 }}
                  >
                    <label className="text-xs font-bold uppercase tracking-[0.15em] text-gray-500 block mb-3">Phone *</label>
                    <motion.input
                      type="tel"
                      required
                      className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 transition-all text-gray-800 bg-gray-50/50"
                      placeholder="Your phone number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      whileFocus={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    />
                  </motion.div>
                </div>

                {/* Event Type */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="text-xs font-bold uppercase tracking-[0.15em] text-gray-500 block mb-3">Event Type</label>
                  <motion.select
                    className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 transition-all text-gray-800 bg-gray-50/50"
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    whileFocus={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <option value="">Select event type</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Corporate Event">Corporate Event</option>
                    <option value="Birthday Party">Birthday Party</option>
                    <option value="Festival">Festival</option>
                    <option value="Other">Other</option>
                  </motion.select>
                </motion.div>

                {/* Message */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.25 }}
                >
                  <label className="text-xs font-bold uppercase tracking-[0.15em] text-gray-500 block mb-3">Your Message</label>
                  <motion.textarea
                    className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 transition-all text-gray-800 resize-none bg-gray-50/50"
                    rows={4}
                    placeholder="Tell us about your requirements..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    whileFocus={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  />
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  className="w-full flex items-center justify-center gap-4 px-8 py-5 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 relative overflow-hidden disabled:opacity-70"
                  whileHover={{
                    scale: submitted ? 1 : 1.02,
                    boxShadow: submitted ? undefined : "0 25px 80px rgba(34, 197, 94, 0.5)"
                  }}
                  whileTap={{ scale: submitted ? 1 : 0.98 }}
                  disabled={isSubmitting || submitted}
                >
                  {/* Shine Effect */}
                  {!submitted && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "200%" }}
                      transition={{ duration: 0.6 }}
                    />
                  )}

                  <motion.div
                    initial={{ scale: 1 }}
                    animate={{ scale: submitted ? [1, 1.2, 1] : 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    {submitted ? <Check size={22} /> : isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Send size={22} />
                      </motion.div>
                    ) : (
                      <Send size={22} />
                    )}
                  </motion.div>
                  <span className="relative z-10 text-lg">
                    {submitted ? "Sent Successfully!" : isSubmitting ? "Sending..." : "Send Inquiry"}
                  </span>
                </motion.button>
              </form>
            </div>

            {/* Bottom Gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
