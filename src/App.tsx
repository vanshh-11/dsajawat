import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence, MotionConfig } from "framer-motion";
import Navbar from "./components/Navbar";
import QuoteModal from "./components/QuoteModal";
import LoadingScreen from "./components/LoadingScreen";
import HomePage from "./pages/HomePage";
import CollectionsPage from "./pages/CollectionsPage";

function App() {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for assets
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <BrowserRouter>
      <MotionConfig reducedMotion="user">
        <AnimatePresence>{isLoading && <LoadingScreen />}</AnimatePresence>

        {!isLoading && (
          <>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:left-5 focus:top-5 focus:z-[90] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-[11px] focus:font-semibold focus:uppercase focus:tracking-[0.14em] focus:text-paper"
            >
              Skip to content
            </a>
            <Navbar onOpenQuote={() => setIsQuoteOpen(true)} />
            <Routes>
              <Route path="/" element={<HomePage onOpenQuote={() => setIsQuoteOpen(true)} />} />
              <Route path="/collections" element={<CollectionsPage />} />
            </Routes>
            <QuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
          </>
        )}
      </MotionConfig>
    </BrowserRouter>
  );
}

export default App;
