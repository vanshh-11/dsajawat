import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, Sparkles, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { BRAND } from "../types";

const navLinks = [
  { label: "Home", href: "#top" },
  { label: "About", href: "#about" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
];

const collections = [
  { label: "Premium Fabrics", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop" },
  { label: "Printed Fabrics", image: "https://images.unsplash.com/photo-1529694157872-4e0c0f6b7d3?w=100&h=100&fit=crop" },
  { label: "Chair Covers", image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=100&h=100&fit=crop" },
  { label: "Table Covers", image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=100&h=100&fit=crop" },
  { label: "Pillow & Cushion Covers", image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=100&h=100&fit=crop" },
  { label: "Curtains", image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=100&h=100&fit=crop" },
  { label: "Ceilings", image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=100&h=100&fit=crop" },
  { label: "Decor Accessories", image: "https://images.unsplash.com/photo-1529636798458-92182e662485?w=100&h=100&fit=crop" },
  { label: "Props", image: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=100&h=100&fit=crop" },
  { label: "Console Tables", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&h=100&fit=crop" },
  { label: "Chandeliers", image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=100&h=100&fit=crop" },
  { label: "Home Decor", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=100&h=100&fit=crop" },
  { label: "Artificial Flowers", image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=100&h=100&fit=crop" },
];

export default function Navbar({ onOpenQuote }: { onOpenQuote: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // "pastHero" = user has scrolled past the hero section (navbar appears)
  // "scrolled" = user has scrolled further (navbar style changes)
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight * 2.9;
      setPastHero(scrollY > heroHeight);
      setScrolled(scrollY > heroHeight);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCollectionsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const scrollToSection = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Glassy Navbar - Centered, appears after scrolling past hero */}
      <AnimatePresence>
        {pastHero && (
          <motion.header
            className="fixed inset-x-4 top-6 z-50 flex justify-center"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
        <motion.div
          className={`w-full max-w-5xl rounded-full px-8 py-4 transition-all duration-500 ${
            scrolled
              ? "bg-white/40 backdrop-blur-3xl shadow-2xl shadow-black/5 border border-white/50"
              : "bg-black/25 backdrop-blur-3xl border border-white/15"
          }`}
          layout
          whileHover={{ boxShadow: scrolled ? "0 20px 60px rgba(0,0,0,0.1)" : "0 20px 60px rgba(212,175,55,0.1)" }}
        >
          <div className="flex items-center justify-between">
            {/* Logo with Magnetic Effect */}
            <motion.a
              href="#top"
              className="flex items-center relative"
              onClick={(e) => { e.preventDefault(); scrollToSection("#top"); }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.span
                className="text-2xl font-bold tracking-wider"
                style={{
                  background: "linear-gradient(135deg, #d4af37 0%, #f4d47c 25%, #d4af37 50%, #c9a032 75%, #d4af37 100%)",
                  backgroundSize: "200% 200%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                D SAJAWAT
              </motion.span>
            </motion.a>

            {/* Desktop Navigation with Animated Underlines */}
            <nav className="hidden lg:flex items-center gap-10">
              {navLinks.map((link, i) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  scrolled={scrolled}
                  delay={i * 0.1}
                  onClick={() => scrollToSection(link.href)}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Collections Dropdown */}
            <div ref={dropdownRef} className="hidden lg:block relative">
              <motion.button
                className={`text-sm font-medium transition-colors flex items-center gap-1 group ${
                  scrolled ? "text-gray-700 hover:text-amber-500" : "text-white/90 hover:text-white"
                }`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onClick={() => setCollectionsOpen(!collectionsOpen)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Collections
                <motion.div
                  animate={{ rotate: collectionsOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={16} className={`transition-colors ${scrolled ? "text-gray-700 group-hover:text-amber-500" : "text-white/90 group-hover:text-white"}`} />
                </motion.div>
                <motion.span
                  className="absolute -bottom-1 left-0 h-0.5 bg-amber-400"
                  initial={{ width: 0 }}
                  animate={{ width: collectionsOpen ? "100%" : 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>

              {/* Glassy Dropdown with Enhanced Animation */}
              <AnimatePresence>
                {collectionsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-80 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border border-white/50"
                  >
                    {/* Decorative Top Gradient */}
                    <div className="h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400" />

                    {/* Scrollable List */}
                    <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-amber-200 scrollbar-track-transparent py-3">
                      {collections.map((item, i) => (
                        <motion.a
                          key={item.label}
                          href="/collections"
                          className="group flex items-center gap-4 px-5 py-3 mx-2 rounded-2xl hover:bg-amber-50 transition-all"
                          initial={{ opacity: 0, x: -15 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.03 }}
                          onClick={(e) => {
                            e.preventDefault();
                            navigate("/collections");
                            setCollectionsOpen(false);
                          }}
                          whileHover={{ x: 5 }}
                        >
                          <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 shadow-md group-hover:shadow-lg transition-shadow">
                            <img
                              src={item.image}
                              alt={item.label}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              loading="lazy"
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-700 group-hover:text-amber-600 transition-colors">
                            {item.label}
                          </span>
                        </motion.a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Desktop CTA with Glow */}
            <div className="hidden lg:flex items-center gap-5">
              <motion.a
                href={`tel:${BRAND.phones[0]}`}
                className={`flex items-center gap-2 text-sm font-medium ${scrolled ? "text-amber-500" : "text-white"}`}
                whileHover={{ scale: 1.05, color: "#f59e0b" }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Phone size={16} />
                </motion.div>
                <span>Call Now</span>
              </motion.a>
              <motion.button
                onClick={onOpenQuote}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-white font-semibold text-sm rounded-full flex items-center gap-2 shadow-lg shadow-amber-500/30 relative overflow-hidden group"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 15px 40px rgba(212, 175, 55, 0.4)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Shine Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "200%" }}
                  transition={{ duration: 0.5 }}
                />
                <Sparkles size={16} className="relative z-10" />
                <span className="relative z-10">Get Quote</span>
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className={`lg:hidden p-2.5 rounded-full transition-all ${
                scrolled ? "bg-gray-100 text-gray-800" : "bg-white/20 text-white"
              }`}
              onClick={() => setOpen(!open)}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </motion.button>
          </div>
        </motion.div>
      </motion.header>
        )}
      </AnimatePresence>

      {/* Mobile Menu - Enhanced Animation */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-md z-40 lg:hidden"
              onClick={() => setOpen(false)}
            />

            {/* Slide-in Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[360px] max-w-[90vw] z-50 bg-white/98 backdrop-blur-2xl shadow-2xl overflow-y-auto"
              style={{ borderRadius: "28px 0 0 28px" }}
            >
              {/* Decorative Header */}
              <div className="bg-gradient-to-r from-amber-400 to-amber-500 h-2" />

              <div className="flex flex-col h-full p-8">
                {/* Logo & Close */}
                <div className="flex justify-between items-center mb-10">
                  <motion.span
                    className="text-2xl font-bold tracking-wider bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    D SAJAWAT
                  </motion.span>
                  <motion.button
                    onClick={() => setOpen(false)}
                    className="p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <X size={20} />
                  </motion.button>
                </div>

                {/* Navigation Links */}
                <nav className="flex flex-col gap-2 flex-1">
                  {navLinks.map((link, i) => (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      className="text-lg font-semibold text-gray-800 hover:text-amber-500 transition-colors py-3 px-5 rounded-2xl hover:bg-amber-50 flex items-center gap-4"
                      style={{ fontFamily: "Georgia, serif" }}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection(link.href);
                        setOpen(false);
                      }}
                      whileHover={{ x: 8 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.div
                        className="w-2 h-2 rounded-full bg-amber-400"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 + i * 0.08 }}
                      />
                      {link.label}
                    </motion.a>
                  ))}

                  {/* Mobile Collections Link */}
                  <div className="mt-4">
                    <motion.a
                      href="/collections"
                      className="flex items-center gap-4 text-lg font-semibold text-gray-800 py-3 px-5 rounded-2xl hover:bg-amber-50 transition-colors"
                      style={{ fontFamily: "Georgia, serif" }}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate("/collections");
                        setOpen(false);
                      }}
                    >
                      <motion.div className="w-2 h-2 rounded-full bg-amber-400" />
                      Collections
                    </motion.a>
                  </div>
                </nav>

                {/* CTA Buttons */}
                <div className="flex flex-col gap-4 pt-6 border-t border-gray-100">
                  <motion.a
                    href={`tel:${BRAND.phones[0]}`}
                    className="flex items-center justify-center gap-3 px-6 py-3.5 border-2 border-gray-200 rounded-full text-gray-700 font-medium hover:border-amber-400 hover:text-amber-500 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setOpen(false)}
                  >
                    <Phone size={18} />
                    <span>Call Now</span>
                  </motion.a>
                  <motion.button
                    onClick={() => { setOpen(false); onOpenQuote(); }}
                    className="flex items-center justify-center gap-3 px-6 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full text-white font-semibold shadow-lg shadow-amber-500/30"
                    whileHover={{ scale: 1.02, boxShadow: "0 15px 40px rgba(212, 175, 55, 0.4)" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Sparkles size={18} />
                    <span>Get Quote</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// NavLink Component with Animated Underline
function NavLink({
  href,
  children,
  scrolled,
  delay,
  onClick
}: {
  href: string;
  children: React.ReactNode;
  scrolled: boolean;
  delay: number;
  onClick: () => void;
}) {
  return (
    <motion.a
      href={href}
      className={`relative text-sm font-medium transition-colors py-1 ${
        scrolled ? "text-gray-700" : "text-white/90"
      }`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onClick={(e) => { e.preventDefault(); onClick(); }}
      whileHover={{ y: -1 }}
    >
      <motion.span
        className="relative inline-block"
        whileHover={{ color: "#f59e0b" }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.span>
      {/* Animated Underline */}
      <motion.span
        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-amber-400 rounded-full origin-left"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{ transformOrigin: "left" }}
      />
    </motion.a>
  );
}
