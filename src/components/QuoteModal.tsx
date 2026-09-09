import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle, Send } from "lucide-react";
import { BRAND } from "../types";
import { useInquiry } from "../hooks/useInquiry";

export default function QuoteModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({ name: "", phone: "", eventType: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { submit } = useInquiry();

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
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-lg z-50"
          >
            <div className="bg-gradient-to-b from-white to-amber-50 rounded-3xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-amber-400 to-amber-500 p-6 text-white relative overflow-hidden">
                <motion.div
                  className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <div className="relative flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold" style={{ fontFamily: "Georgia, serif" }}>Get a Quote</h2>
                    <p className="text-white/80 text-sm mt-1">We&apos;ll get back to you within 24 hours</p>
                  </div>
                  <motion.button
                    onClick={onClose}
                    className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={20} />
                  </motion.button>
                </div>
              </div>

              {/* Form */}
              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 block mb-2">Your Name *</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 transition-all"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 block mb-2">Phone *</label>
                      <input
                        type="tel"
                        required
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 transition-all"
                        placeholder="Your phone number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 block mb-2">Event Type</label>
                    <select
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 transition-all bg-white"
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
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 block mb-2">Your Requirements</label>
                    <textarea
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 transition-all resize-none"
                      rows={3}
                      placeholder="Tell us about your requirements..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <motion.button
                    type="submit"
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl shadow-lg disabled:opacity-70"
                    whileHover={{ scale: isSubmitting ? 1 : 1.02, boxShadow: isSubmitting ? undefined : "0 20px 60px rgba(34, 197, 94, 0.4)" }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Send size={20} />
                      </motion.div>
                    ) : (
                      <MessageCircle size={20} />
                    )}
                    <span>{isSubmitting ? "Sending..." : "Send Quote Request"}</span>
                  </motion.button>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
