import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import {
  ArrowUpRight,
  ChevronDown,
  Instagram,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Sparkles,
  X,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BRAND, COLLECTIONS } from "../types";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Our Work", href: "#work" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
];

const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1];

const menuContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.055, delayChildren: 0.12 },
  },
};

const menuItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easeOut } },
};

function Monogram({ tone }: { tone: "paper" | "ink" }) {
  return (
    <span
      aria-hidden="true"
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-colors duration-500 md:h-10 md:w-10 ${
        tone === "ink"
          ? "border-gold/25 bg-white text-ink shadow-sm shadow-ink/5"
          : "border-paper/30 bg-white/10 text-paper backdrop-blur-sm"
      }`}
    >
      <span className="font-serif text-[17px] leading-none md:text-[19px]">D</span>
    </span>
  );
}

export default function Navbar({ onOpenQuote }: { onOpenQuote: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showMobileBar, setShowMobileBar] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const onCollections = location.pathname === "/collections";
  const solid = !isHome || scrolled || mobileOpen;

  useEffect(() => {
    const sectionIds = ["about", "work", "reviews", "contact"];
    const handleScroll = () => {
      setScrolled(window.scrollY > 64);
      setShowMobileBar(window.scrollY > 480);

      if (location.pathname !== "/") {
        setActiveSection("");
        return;
      }
      const current = sectionIds.find((id) => {
        const el = document.getElementById(id);
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top <= 150 && rect.bottom > 150;
      });
      setActiveSection(current ? `#${current}` : "");
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  useEffect(() => {
    setCollectionsOpen(false);
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const original = document.body.style.overflow;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 60);

    const handleTab = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !menuRef.current) return;
      const focusable = menuRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
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

    document.addEventListener("keydown", handleTab);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleTab);
      document.body.style.overflow = original;
      (previouslyFocused && previouslyFocused !== document.body
        ? previouslyFocused
        : openButtonRef.current
      )?.focus();
    };
  }, [mobileOpen]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setCollectionsOpen(false);
        setMobileOpen(false);
      }
    };
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCollectionsOpen(false);
      }
    };
    document.addEventListener("keydown", handleKey);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const goToSection = (href: string) => {
    const wasOpen = mobileOpen;
    setMobileOpen(false);
    const scrollToTarget = () => {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    if (!isHome) {
      navigate("/");
      window.setTimeout(scrollToTarget, 420);
      return;
    }
    if (wasOpen) {
      window.setTimeout(scrollToTarget, 160);
      return;
    }
    scrollToTarget();
  };

  const linkTone = solid ? "text-ink/70 hover:text-ink" : "text-paper/75 hover:text-paper";

  const rowClass =
    "group mb-2.5 flex min-h-[60px] items-center justify-between gap-4 rounded-2xl border border-line/70 bg-white px-4 py-3 shadow-sm shadow-ink/5 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-md";
  const rowNumberClass = "w-6 shrink-0 font-serif text-[11px] italic text-muted";
  const rowLabelClass =
    "font-serif text-[26px] leading-none text-ink transition-colors duration-300 group-hover:text-gold";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow] duration-500 ${
          solid
            ? "border-b border-line bg-paper/95 shadow-[0_1px_0_rgba(23,20,18,0.02)] backdrop-blur-md"
            : "border-b border-transparent bg-gradient-to-b from-ink/55 via-ink/20 to-transparent"
        }`}
      >
        <div className="container flex h-16 items-center justify-between md:h-[72px]">
          {/* Wordmark */}
          <Link to="/" className="group flex items-center gap-3" aria-label="D Sajawat home">
            <Monogram tone={solid ? "ink" : "paper"} />
            <span className="flex flex-col leading-none">
              <span
                className={`font-serif text-[19px] tracking-[0.18em] transition-colors duration-500 md:text-[21px] ${
                  solid ? "text-ink" : "text-paper"
                }`}
              >
                D SAJAWAT
              </span>
              <span
                className={`mt-1 text-[7px] font-medium uppercase tracking-[0.3em] transition-colors duration-500 md:text-[8px] ${
                  solid ? "text-gold" : "text-paper/60"
                }`}
              >
                Fabrics · Ludhiana
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={() => setCollectionsOpen(true)}
              onMouseLeave={() => setCollectionsOpen(false)}
            >
              <button
                type="button"
                onClick={() => setCollectionsOpen((value) => !value)}
                aria-expanded={collectionsOpen}
                aria-haspopup="true"
                className={`group relative flex min-h-[44px] items-center gap-1.5 py-2 text-[13px] font-medium tracking-[0.02em] transition-colors duration-300 ${
                  onCollections ? (solid ? "text-ink" : "text-paper") : linkTone
                }`}
              >
                Collections
                <ChevronDown
                  size={14}
                  aria-hidden="true"
                  className={`transition-transform duration-300 ${collectionsOpen ? "rotate-180" : ""}`}
                />
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 bottom-0 h-px origin-left bg-gold transition-transform duration-300 group-hover:scale-x-100 ${
                    onCollections ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </button>

              <AnimatePresence>
                {collectionsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.22, ease: easeOut }}
                    className="absolute left-1/2 top-full w-[620px] -translate-x-1/2 pt-4"
                  >
                    <div className="relative overflow-hidden rounded-3xl border border-line/70 bg-paper shadow-xl shadow-ink/10">
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent"
                      />
                      <div className="flex items-center justify-between border-b border-line/80 bg-gradient-to-r from-amber-50/70 via-paper to-paper px-6 py-3">
                        <span className="text-[9px] font-semibold uppercase tracking-[0.26em] text-muted">
                          The collections
                        </span>
                        <span className="text-[9px] font-semibold uppercase tracking-[0.26em] text-gold">
                          {String(COLLECTIONS.length).padStart(2, "0")} series
                        </span>
                      </div>

                      <div className="grid grid-cols-[1fr_190px]">
                        <div className="grid grid-cols-2 gap-x-6 gap-y-0.5 p-5">
                          {COLLECTIONS.map((item) => (
                            <Link
                              key={item.id}
                              to="/collections"
                              className="group flex items-center justify-between rounded-md px-3 py-2.5 text-[13px] text-ink/75 transition-colors hover:bg-gold-tint/60 hover:text-ink"
                            >
                              <span className="flex items-baseline gap-2.5">
                                <span className="text-[9px] tabular-nums text-muted">
                                  {item.overline.replace("Series ", "")}
                                </span>
                                {item.title}
                              </span>
                              <ArrowUpRight
                                size={13}
                                aria-hidden="true"
                                className="text-gold opacity-0 transition-opacity group-hover:opacity-100"
                              />
                            </Link>
                          ))}
                        </div>

                        <Link to="/collections" className="group relative block">
                          <img
                            src={COLLECTIONS[6].image}
                            alt=""
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
                          <div className="absolute inset-x-0 bottom-0 p-4">
                            <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-paper/70">
                              Featured
                            </p>
                            <p className="mt-1 flex items-center gap-1.5 font-serif text-[17px] leading-tight text-paper">
                              View all
                              <ArrowUpRight size={13} aria-hidden="true" />
                            </p>
                          </div>
                        </Link>
                      </div>

                      <div className="flex items-center justify-between border-t border-line/80 bg-gradient-to-r from-paper to-amber-50/50 px-6 py-2.5">
                        <span className="text-[9px] uppercase tracking-[0.22em] text-muted">
                          Supplied across India
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {navLinks.map((link) => {
              const isActive = isHome && activeSection === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "location" : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    goToSection(link.href);
                  }}
                  className={`group relative flex min-h-[44px] items-center py-2 text-[13px] font-medium tracking-[0.02em] transition-colors duration-300 ${
                    isActive ? (solid ? "text-ink" : "text-paper") : linkTone
                  }`}
                >
                  {link.label}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 bottom-0 h-px origin-left bg-gold transition-transform duration-300 group-hover:scale-x-100 ${
                      isActive ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          {/* Desktop actions */}
          <div className="hidden items-center gap-6 lg:flex">
            <a
              href={`tel:${BRAND.phones[0]}`}
              className={`hidden min-h-[44px] items-center gap-2 text-[13px] font-medium transition-colors duration-300 xl:flex ${
                solid ? "text-ink/70 hover:text-ink" : "text-paper/75 hover:text-paper"
              }`}
            >
              <Phone size={14} aria-hidden="true" />
              {BRAND.phones[0]}
            </a>
            <button
              type="button"
              onClick={onOpenQuote}
              className="group inline-flex items-center gap-2 rounded-full bg-gold-bright px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink shadow-lg shadow-gold/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-ink hover:text-paper"
            >
              Request a Quote
              <ArrowUpRight
                size={14}
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </button>
          </div>

          {/* Mobile trigger */}
          <button
            ref={openButtonRef}
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            className={`-mr-2 flex h-11 w-11 items-center justify-center transition-colors duration-500 lg:hidden ${
              solid ? "text-ink" : "text-paper"
            }`}
          >
            <Menu size={24} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              aria-hidden="true"
              onClick={() => setMobileOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[60] bg-transparent lg:hidden"
            />

            <motion.div
              key="drawer"
              ref={menuRef}
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.45, ease: easeOut }}
              className="fixed inset-y-0 right-0 z-[70] flex w-[88vw] max-w-[420px] flex-col rounded-l-[32px] border-l border-line/70 bg-paper shadow-2xl lg:hidden"
            >
              {/* Drawer header */}
              <div className="relative flex h-16 shrink-0 items-center justify-between border-b border-line/80 bg-gradient-to-r from-amber-50/80 via-paper to-paper px-5">
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent"
                />
                <div className="flex items-center gap-3">
                  <Monogram tone="ink" />
                  <div className="leading-none">
                    <p className="text-[8px] font-medium uppercase tracking-[0.3em] text-muted">
                      Menu
                    </p>
                    <p className="mt-1 font-serif text-[15px] tracking-[0.16em] text-ink">
                      D SAJAWAT
                    </p>
                  </div>
                </div>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="-mr-2 flex h-11 w-11 items-center justify-center text-ink"
                >
                  <X size={24} strokeWidth={1.5} aria-hidden="true" />
                </button>
              </div>

              {/* Drawer body */}
              <div className="no-scrollbar flex-1 overflow-y-auto">
                <motion.nav
                  variants={menuContainer}
                  initial="hidden"
                  animate="show"
                  aria-label="Mobile"
                  className="px-5 pt-6"
                >
                  <motion.div
                    variants={menuItem}
                    className="flex items-center justify-between pb-3"
                  >
                    <span className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.28em] text-muted">
                      <Sparkles size={11} className="text-gold" aria-hidden="true" />
                      Navigate
                    </span>
                    <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-gold">
                      05
                    </span>
                  </motion.div>

                  <motion.div variants={menuItem}>
                    <Link
                      to="/collections"
                      onClick={() => setMobileOpen(false)}
                      className={rowClass}
                    >
                      <span className="flex items-baseline gap-4">
                        <span className={rowNumberClass}>01</span>
                        <span className={rowLabelClass}>Collections</span>
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="text-[9px] uppercase tracking-[0.2em] text-muted">
                          {String(COLLECTIONS.length).padStart(2, "0")}
                        </span>
                        <ArrowUpRight
                          size={16}
                          aria-hidden="true"
                          className="text-gold transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                      </span>
                    </Link>
                  </motion.div>

                  {navLinks.map((link, index) => {
                    const isActive = isHome && activeSection === link.href;
                    return (
                      <motion.div key={link.href} variants={menuItem}>
                        <a
                          href={link.href}
                          aria-current={isActive ? "location" : undefined}
                          onClick={(event) => {
                            event.preventDefault();
                            goToSection(link.href);
                          }}
                          className={rowClass}
                        >
                          <span className="flex items-baseline gap-4">
                            <span className={rowNumberClass}>
                              {String(index + 2).padStart(2, "0")}
                            </span>
                            <span className={rowLabelClass}>{link.label}</span>
                            {isActive && (
                              <span
                                aria-hidden="true"
                                className="mb-1.5 h-1 w-1 rounded-full bg-gold"
                              />
                            )}
                          </span>
                          <ArrowUpRight
                            size={16}
                            aria-hidden="true"
                            className="text-gold transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          />
                        </a>
                      </motion.div>
                    );
                  })}
                </motion.nav>

                {/* Featured series */}
                <motion.div
                  variants={menuItem}
                  initial="hidden"
                  animate="show"
                  className="px-5 pt-6"
                >
                  <Link
                    to="/collections"
                    onClick={() => setMobileOpen(false)}
                    className="group relative block overflow-hidden rounded-3xl border border-line/70 shadow-lg shadow-ink/10"
                  >
                    <img
                      src={COLLECTIONS[6].image}
                      alt=""
                      className="h-36 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
                      <div>
                        <p className="text-[8px] uppercase tracking-[0.26em] text-paper/70">
                          Featured series
                        </p>
                        <p className="mt-1 font-serif text-[20px] leading-tight text-paper">
                          {COLLECTIONS[6].title}
                        </p>
                      </div>
                      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-paper/35 text-paper">
                        <ArrowUpRight size={15} aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                </motion.div>

                {/* Studio details */}
                <motion.div
                  variants={menuItem}
                  initial="hidden"
                  animate="show"
                  className="px-5 pb-8 pt-6"
                >
                  <div className="rounded-3xl border border-line/70 bg-white p-4 shadow-lg shadow-ink/5">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.24em] text-muted">
                        <Sparkles size={11} className="text-gold" aria-hidden="true" />
                        Visit the studio
                      </span>
                      <a
                        href={BRAND.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="D Sajawat on Instagram"
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 text-gold shadow-sm shadow-amber-200/60 transition-transform hover:scale-105"
                      >
                        <Instagram size={16} aria-hidden="true" />
                      </a>
                    </div>

                    <div className="mt-4 space-y-1.5">
                      <p className="flex items-start gap-3 text-[12px] leading-relaxed text-ink/80">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-gold">
                          <MapPin size={14} aria-hidden="true" />
                        </span>
                        <span className="pt-2">{BRAND.location}</span>
                      </p>

                      {BRAND.phones.map((phone) => (
                        <a
                          key={phone}
                          href={`tel:${phone}`}
                          className="flex min-h-[40px] items-center gap-3 text-[12px] font-medium text-ink"
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-gold">
                            <Phone size={14} aria-hidden="true" />
                          </span>
                          {phone}
                        </a>
                      ))}
                    </div>

                    <a
                      href={`https://wa.me/${BRAND.whatsapp[0]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full border border-gold/25 bg-amber-50 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-gold transition-colors hover:border-gold hover:bg-amber-100"
                    >
                      <MessageCircle size={14} aria-hidden="true" />
                      Chat on WhatsApp
                    </a>
                  </div>
                </motion.div>
              </div>

              {/* Drawer footer */}
              <div className="relative shrink-0 border-t border-line/80 bg-gradient-to-r from-paper via-amber-50/50 to-paper px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-4">
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent"
                />
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    onOpenQuote();
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-gold-bright px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink shadow-lg shadow-gold/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-ink hover:text-paper"
                >
                  Request a quote
                  <ArrowUpRight size={14} aria-hidden="true" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile sticky actions */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-line/80 bg-paper pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_30px_-18px_rgba(23,20,18,0.35)] transition-[transform,visibility] duration-300 lg:hidden ${
          showMobileBar && !mobileOpen
            ? "visible translate-y-0"
            : "invisible translate-y-full"
        }`}
      >
        <a
          href={`tel:${BRAND.phones[0]}`}
          className="flex items-center justify-center gap-2 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink"
        >
          <Phone size={14} className="text-gold" aria-hidden="true" />
          Call
        </a>
        <a
          href={`https://wa.me/${BRAND.whatsapp[0]}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-gold-bright py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink"
        >
          WhatsApp
          <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </div>
    </>
  );
}
