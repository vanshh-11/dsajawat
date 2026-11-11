import React from "react";
import HeroScroll from "../components/HeroScroll";
import About from "../components/About";
import Features from "../components/Features";
import BeforeAfter from "../components/BeforeAfter";
import Testimonials from "../components/Testimonials";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

export default function HomePage({ onOpenQuote }: { onOpenQuote: () => void }) {
  return (
    <>
      <main id="main-content">
        <HeroScroll onOpenQuote={onOpenQuote} />
        <About />
        <Features />
        <BeforeAfter />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
