import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
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
      <AnimatePresence>
        {isLoading && <LoadingScreen />}
      </AnimatePresence>

      {!isLoading && (
        <>
          <Navbar onOpenQuote={() => setIsQuoteOpen(true)} />
          <Routes>
            <Route path="/" element={<HomePage onOpenQuote={() => setIsQuoteOpen(true)} />} />
            <Route path="/collections" element={<CollectionsPage />} />
          </Routes>
          <QuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
        </>
      )}
    </BrowserRouter>
  );
}

export default App;
