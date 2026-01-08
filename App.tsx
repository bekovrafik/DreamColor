import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Onboarding, Register, ForgotPassword, Billing } from './pages/OnboardingAuth';
import { Home, Settings } from './pages/Dashboard';
import { Gallery, Presets } from './pages/GalleryPresets';
import { About, Help, Subscription, Legal } from './pages/Support';
import { NewAdventure, Chat, GenerationProgress, PreviewBook } from './pages/CreationFlow';
import { BookSaved, PdfExported } from './pages/SuccessStates';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <ScrollToTop />
        <Routes>
          {/* Onboarding & Auth */}
          <Route path="/" element={<Onboarding />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/billing" element={<Billing />} />
          
          {/* Main Dashboard */}
          <Route path="/home" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/presets" element={<Presets />} />
          <Route path="/settings" element={<Settings />} />
          
          {/* Creation Flow */}
          <Route path="/new" element={<NewAdventure />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/generating" element={<GenerationProgress />} />
          <Route path="/preview" element={<PreviewBook />} />
          
          {/* Success States */}
          <Route path="/saved" element={<BookSaved />} />
          <Route path="/pdf-ready" element={<PdfExported />} />
          
          {/* Support & Info */}
          <Route path="/about" element={<About />} />
          <Route path="/help" element={<Help />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/legal" element={<Legal />} />
        </Routes>
      </HashRouter>
    </AppProvider>
  );
}
