"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Kategorie dostępne w hero
const CATEGORIES = [
  { id: 'garaze', label: 'garaże', image: '/assets/images/hero_bg_garaze.jpg', callout: 'GARAŻE MODUŁOWE', icon: <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
  { id: 'altany', label: 'altany', image: '/assets/images/hero_bg_altany.jpg', callout: 'ALTANA ŚMIETNIKOWA', icon: <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> },
  { id: 'wiaty', label: 'wiaty', image: '/assets/images/hero_bg_wiaty.jpg', callout: 'WIATA ROWEROWA', icon: <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  { id: 'scianki', label: 'ścianki', image: '/assets/images/hero_bg_scianki.jpg', callout: 'ŚCIANKI DZIAŁOWE', icon: <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
  { id: 'zielony-dach', label: 'garaże z zielonym dachem', image: '/assets/images/hero_bg_zielony_dach.jpg', callout: 'GARAŻ Z ZIELONYM DACHEM', icon: <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> }
];

export default function HomeHero() {
  const [activeId, setActiveId] = useState<string>('zielony-dach');

  const shuffledCategories = useMemo(() => {
    const inactive = CATEGORIES.filter(c => c.id !== activeId);
    const active = CATEGORIES.find(c => c.id === activeId);
    return active ? [...inactive, active] : CATEGORIES;
  }, [activeId]);

  const activeCategory = CATEGORIES.find(c => c.id === activeId) || CATEGORIES[4];

  return (
    <div className="relative w-full h-[100vh] min-h-[800px] flex flex-col justify-between overflow-hidden font-sans bg-[#111]">
      
      {/* Background Image ze smooth transistion */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.img 
            key={activeCategory.id}
            src={activeCategory.image} 
            alt={activeCategory.label}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>
        {/* Lekki gradient tylko z lewej i dołu, żeby nie psuć ładnego zdjęcia */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      </div>

      {/* Main Content Area - Odsunięte od góry na header, padding zgodny z headerem */}
      <div className="relative z-10 w-full px-[calc(14px+clamp(20px,2.4vw,44px))] flex-1 flex flex-col lg:flex-row items-center justify-between gap-12 pt-32 lg:pt-40">
        
        {/* Left Column (Text & Buttons) */}
        <div className="flex-1 max-w-3xl text-white">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] md:text-xs font-semibold tracking-[0.15em] uppercase mb-8"
          >
            NOWA GENERACJA MODUŁÓW
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.1] mb-6 tracking-tight drop-shadow-xl font-medium">
            Zaprojektuj Trwałą Przestrzeń.
            <br />
            Produkujemy Nowoczesne:
            <br />
            <span className="inline-flex flex-wrap gap-x-2 mt-2 font-bold relative">
              <AnimatePresence mode="popLayout">
                {CATEGORIES.map((cat, index) => {
                  const isActive = activeId === cat.id;
                  const isLastItem = index === CATEGORIES.length - 1;
                  return (
                    <motion.span
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      key={cat.id}
                      onClick={() => setActiveId(cat.id)}
                      className={`relative inline-flex items-center cursor-pointer transition-colors drop-shadow-2xl ${
                        isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {cat.label}
                      {isActive && (
                        <>
                          {/* Hand-drawn underline */}
                          <svg className="absolute -bottom-2 md:-bottom-3 left-0 w-full h-3 md:h-4 text-[#ff6b00]" preserveAspectRatio="none" viewBox="0 0 100 10" fill="none">
                            <path d="M2 7 Q 50 10 98 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                          </svg>
                          
                          {/* Dot and branching lines to cards */}
                          <svg className="absolute -right-8 top-1/2 -translate-y-1/2 w-6 h-6 text-[#ff6b00] overflow-visible pointer-events-none hidden lg:block" viewBox="0 0 24 24" fill="none">
                            {/* Orange Dot */}
                            <circle cx="12" cy="12" r="4" fill="currentColor" />
                            {/* Animated Pulse around dot */}
                            <circle cx="12" cy="12" r="4" fill="currentColor" className="animate-ping opacity-50" />
                          </svg>
                        </>
                      )}
                      {!isLastItem && <span className="ml-0 text-gray-400">,</span>}
                    </motion.span>
                  );
                })}
              </AnimatePresence>
            </span>
          </h1>
          
          <p className="text-sm md:text-base lg:text-lg text-gray-200 mb-10 max-w-xl leading-relaxed drop-shadow-md font-light">
            Elastyczne rozwiązania dla domu, osiedla i firmy. Dopasuj wymiary, wybierz wykończenie i ciesz się jakością na lata.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5">
            <Link 
              href="/konfigurator"
              className="inline-flex justify-center items-center px-10 py-3.5 bg-[#ff6b00] hover:bg-[#e56000] text-white text-sm font-bold tracking-wide rounded-md transition-all text-center shadow-[0_0_20px_rgba(255,107,0,0.5)]"
            >
              SKONFIGURUJ W 3D
            </Link>
            <Link 
              href="/realizacje"
              className="inline-flex justify-center items-center px-10 py-3.5 bg-white/10 backdrop-blur-md border border-white/30 text-white hover:bg-white/20 text-sm font-bold tracking-wide rounded-md transition-all text-center"
            >
              ZOBACZ REALIZACJE
            </Link>
          </div>
        </div>

        {/* Right Column (Glass Cards & Navigation) */}
        <div className="relative w-full lg:w-[350px] flex flex-col items-end gap-6 justify-center mt-12 lg:mt-0">
          
          {/* Stack of Glass Cards */}
          <div className="flex flex-col gap-5 w-full items-end relative">
            {CATEGORIES.slice(1, 4).map((cat) => (
              <div 
                key={cat.id}
                onClick={() => setActiveId(cat.id)}
                className={`relative overflow-hidden flex flex-col items-center justify-between p-3 rounded-2xl cursor-pointer transition-all duration-300 w-[170px] h-[170px] border ${activeId === cat.id ? 'bg-white/20 backdrop-blur-lg border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.15)] scale-105 z-10' : 'bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10'}`}
              >
                <div className="w-full flex justify-start pl-1 mb-2">
                  {cat.icon}
                </div>
                <div className="w-full flex-1 rounded-lg overflow-hidden relative mb-2">
                  <img src={cat.image} alt={cat.label} className="absolute inset-0 w-full h-full object-cover" />
                </div>
                <p className="text-[10px] font-bold text-center text-white tracking-widest uppercase mt-1 drop-shadow-md">{cat.callout}</p>
              </div>
            ))}

            {/* Subtelna strzałka nawigacyjna obok kart */}
            <div className="absolute -right-12 top-1/2 -translate-y-1/2 cursor-pointer text-white/50 hover:text-white transition-colors p-2 hidden 2xl:block">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>
            </div>
          </div>

          {/* Model 3D Pill & Progress Bar */}
          <div className="w-full flex flex-col items-end gap-3 mt-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2.5 flex items-center gap-4 shadow-lg w-full max-w-[320px] justify-between">
              <span className="text-[10px] font-bold text-white tracking-widest uppercase truncate ml-2">MODEL 3D: {activeCategory.callout}</span>
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                 <svg className="w-3 h-3 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              </div>
            </div>
            {/* Progress bar line under the pill */}
            <div className="w-full max-w-[320px] h-[2px] bg-white/20 rounded-full overflow-hidden relative">
               <motion.div 
                 key={activeCategory.id}
                 initial={{ width: "0%" }}
                 animate={{ width: "100%" }}
                 transition={{ duration: 10, ease: "linear" }}
                 onAnimationComplete={() => {
                    const currentIndex = CATEGORIES.findIndex(c => c.id === activeId);
                    const nextIndex = currentIndex === CATEGORIES.length - 1 ? 0 : currentIndex + 1;
                    setActiveId(CATEGORIES[nextIndex].id);
                 }}
                 className="absolute left-0 top-0 h-full bg-white"
               />
            </div>
          </div>
          
        </div>
      </div>

      {/* Trust Bar (Glassmorphism) */}
      <div className="relative z-10 w-full px-[calc(14px+clamp(20px,2.4vw,44px))] pb-8 mt-8">
        <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-[1.5rem] px-8 py-5 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-6 overflow-x-auto whitespace-nowrap scrollbar-hide text-white">
            <div className="font-bold text-lg shrink-0 mr-4 tracking-wide">
              Trust Bar
            </div>
            
            <div className="flex items-center gap-3 text-xs md:text-sm font-semibold tracking-wide text-white/90">
              <svg className="w-5 h-5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              PROJEKT W 24H
            </div>
            
            <div className="flex items-center gap-3 text-xs md:text-sm font-semibold tracking-wide text-white/90">
              <svg className="w-5 h-5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              KONSTRUKCJE OCYNKOWANE
            </div>
            
            <div className="flex items-center gap-3 text-xs md:text-sm font-semibold tracking-wide text-white/90">
              <svg className="w-5 h-5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              MONTAŻ W CAŁEJ POLSCE
            </div>
            
            <div className="flex items-center gap-3 text-xs md:text-sm font-semibold tracking-wide text-white/90">
              <svg className="w-5 h-5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              MODUŁOWA BUDOWA
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
