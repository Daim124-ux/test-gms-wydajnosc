'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, ChevronUp, ChevronDown } from 'lucide-react';
import Image from 'next/image';

export interface CloserLookItem {
  id: string;
  label: string;
  title: string;
  description: string;
  image: string;
  swatches?: { name: string; hex: string; image: string }[];
}

const defaultItems: CloserLookItem[] = [
  {
    id: 'sizes',
    label: 'Wymiary',
    title: 'Wymiary',
    description: 'Dostępne wersje jednostanowiskowe (od 3.0 m szerokości) oraz dwustanowiskowe (do 9.0 m szerokości). Możliwość regulacji wysokości wjazdu dla aut SUV i dostawczych.',
    image: '/assets/images/apple-widget/sizes.jpg'
  },
  {
    id: 'colors',
    label: 'Kolory',
    title: 'Kolory',
    description: 'Ponad 15 trwałych powłok akrylowych w mat i błysku (RAL 7016, RAL 8017, RAL 9006, Ocynk) oraz ozdobny tynk akrylowy strukturalny.',
    image: '/assets/images/apple-widget/colors.jpg',
    swatches: [
      { name: '7016 Mat', hex: '#3b4348', image: '/assets/images/apple-widget/colors.jpg' },
      { name: '8017 Mat', hex: '#583c2e', image: '/assets/images/apple-widget/structure.jpg' },
      { name: '9006 Srebrny', hex: '#9da0a5', image: '/assets/images/apple-widget/gates.jpg' },
      { name: 'Ocynk', hex: '#c5c8cc', image: '/assets/images/apple-widget/sizes.jpg' }
    ]
  },
  {
    id: 'facade',
    label: 'Elewacja i Tynk',
    title: 'Elewacja i Tynk',
    description: 'System wykończenia elewacyjnego spójny z architekturą budynku domowego. Attyka obwodowa ukrywająca spadek dachu oraz struktura tynku baranek.',
    image: '/assets/images/apple-widget/facade.jpg'
  },
  {
    id: 'gates',
    label: 'Bramy i Wejścia',
    title: 'Bramy i Wejścia',
    description: 'Bramy uchylne oraz ocieplane bramy segmentowe z napędami automatycznymi Somfy na pilota oraz bocznymi drzwiami przejściowymi.',
    image: '/assets/images/apple-widget/gates.jpg'
  },
  {
    id: 'finish',
    label: 'Wykończenie i Obróbki',
    title: 'Wykończenie i Obróbki',
    description: 'Precyzyjnie docięte narożne obróbki blacharskie, maskownice oraz okna PCV zapewniające doświetlenie wnętrza naturalnym światłem.',
    image: '/assets/images/apple-widget/roof.jpg'
  },
  {
    id: 'structure',
    label: 'Konstrukcja',
    title: 'Konstrukcja',
    description: 'Szkielet oparty na profilach zamkniętych ocynkowanych ogniowo. Gwarancja sztywności i wytrzymałości na obciążenia śniegowe i wiatr.',
    image: '/assets/images/apple-widget/structure.jpg'
  },
  {
    id: 'durability',
    label: 'Trwałość i Gwarancja',
    title: 'Trwałość i Gwarancja',
    description: 'Wszystkie komponenty wytwarzane są w Polsce zgodnie z normami EN 1090. Certyfikowana ochrona przed korozją i promieniowaniem UV.',
    image: '/assets/images/apple-widget/durability.jpg'
  }
];

interface AppleCloserLookProps {
  title?: string;
  items?: CloserLookItem[];
}

export default function AppleCloserLook({
  title = 'Przyjrzyj się bliżej.',
  items = defaultItems
}: AppleCloserLookProps) {
  // activeId = id wybranego elementu lub null gdy zwinęte do widoku domyślnego
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedSwatchIndex, setSelectedSwatchIndex] = useState<number>(0);

  const activeIndex = items.findIndex((item) => item.id === activeId);
  const activeItem = activeIndex !== -1 ? items[activeIndex] : null;

  const handlePrev = () => {
    if (activeIndex === -1) {
      setActiveId(items[0].id);
    } else {
      const prevIdx = (activeIndex - 1 + items.length) % items.length;
      setActiveId(items[prevIdx].id);
    }
    setSelectedSwatchIndex(0);
  };

  const handleNext = () => {
    if (activeIndex === -1) {
      setActiveId(items[0].id);
    } else {
      const nextIdx = (activeIndex + 1) % items.length;
      setActiveId(items[nextIdx].id);
    }
    setSelectedSwatchIndex(0);
  };

  // Aktywne zdjęcie tła
  const currentImage = activeItem
    ? (activeItem.swatches && activeItem.swatches[selectedSwatchIndex]
        ? activeItem.swatches[selectedSwatchIndex].image
        : activeItem.image)
    : items[0].image;

  return (
    <section className="w-full bg-white text-[#1d1d1f] py-16 md:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto">
        {/* NAGŁÓWEK APPLE STYLE W TRYBIE JASNYM */}
        <h2 className="text-[34px] sm:text-[46px] md:text-[56px] font-semibold text-[#1d1d1f] tracking-tight mb-8 md:mb-12 leading-[1.08]">
          {title}
        </h2>

        {/* GŁÓWNY KONTENER KARTY APPLE - PEŁNE WYPEŁNIENIE BEZ ZBĘDNYCH MARGINESÓW */}
        <div className="relative w-full rounded-[28px] sm:rounded-[36px] md:rounded-[40px] overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.14)] border border-black/5 aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] min-h-[540px] md:min-h-[640px] flex items-center bg-black">
          
          {/* ZDJĘCIE GŁÓWNE PEŁNEGO WYPEŁNIENIA (FULL BLEED) */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImage}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full h-full"
              >
                <Image
                  src={currentImage}
                  alt="Prezentacja GMS System"
                  fill
                  priority
                  className="object-cover object-center"
                />
                {/* Delikatny gradient po lewej dla maksymalnej czytelności dymków */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent pointer-events-none" />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* PRZYCISK ZAMKNIĘCIA (X) W PRAWYM GÓRNYM ROGU - PRZEŹROCZYSTY GLASS */}
          {activeId !== null && (
            <button
              type="button"
              onClick={() => setActiveId(null)}
              className="absolute top-6 right-6 z-40 grid h-9 w-9 place-items-center rounded-full bg-black/45 hover:bg-black/70 backdrop-blur-xl text-white/90 hover:text-white border border-white/20 transition-all cursor-pointer shadow-lg active:scale-95"
              title="Zamknij podgląd"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {/* PIONOWE STRZAŁKI NAWIGACJI (▲) I (▼) PO LEWEJ STRONIE - PRZEŹROCZYSTY GLASS */}
          {activeId !== null && (
            <div className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-30">
              <button
                type="button"
                onClick={handlePrev}
                className="grid h-9 w-9 place-items-center rounded-full bg-black/45 hover:bg-black/70 backdrop-blur-xl text-white/90 hover:text-white border border-white/20 transition-all shadow-lg cursor-pointer active:scale-95"
                title="Poprzednia cecha"
              >
                <ChevronUp className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="grid h-9 w-9 place-items-center rounded-full bg-black/45 hover:bg-black/70 backdrop-blur-xl text-white/90 hover:text-white border border-white/20 transition-all shadow-lg cursor-pointer active:scale-95"
                title="Następna cecha"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* LEWE MENU PŁYWAJĄCYCH PIGUŁEK I DYMKÓW Z EFEKTEM PRZEŹROCZYSTOŚCI (GLASSMORPHISM) */}
          <div className="absolute left-10 md:left-20 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3 max-w-[360px] md:max-w-[390px] w-full px-2">
            {items.map((item) => {
              const isActive = activeId === item.id;

              if (isActive) {
                // ROZWINIĘTY DYMEK INFORMACYJNY APPLE Z EFEKTEM PRZEŹROCZYSTOŚCI (FROSTED GLASS)
                return (
                  <motion.div
                    key={item.id}
                    layoutId="activeBubbleCard"
                    initial={{ opacity: 0, scale: 0.94, y: 4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.94, y: 4 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="relative bg-black/60 hover:bg-black/65 backdrop-blur-2xl border border-white/25 rounded-[24px] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.7)] text-white w-full space-y-4"
                  >
                    <p className="text-[15px] sm:text-[16px] leading-[1.45] text-white/95 font-normal">
                      <strong className="font-semibold text-white tracking-tight mr-1.5">{item.title}.</strong>
                      {item.description}
                    </p>

                    {/* Próbki kolorów wewnątrz dymku (jeśli zakładka Kolory) */}
                    {item.swatches && (
                      <div className="pt-2 border-t border-white/15 space-y-2">
                        <span className="text-[11px] font-semibold text-white/70 uppercase tracking-wider block">
                          Odcień: <strong className="text-white">{item.swatches[selectedSwatchIndex].name}</strong>
                        </span>
                        <div className="flex flex-wrap gap-2.5">
                          {item.swatches.map((swatch, idx) => (
                            <button
                              key={swatch.name}
                              type="button"
                              onClick={() => setSelectedSwatchIndex(idx)}
                              className={`w-7 h-7 rounded-full border-2 transition-all duration-200 ${
                                selectedSwatchIndex === idx
                                  ? 'scale-110 border-white ring-2 ring-white/50 shadow-lg'
                                  : 'border-white/30 opacity-75 hover:opacity-100'
                              }`}
                              style={{ backgroundColor: swatch.hex }}
                              title={swatch.name}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              }

              // PIGUŁKA MENU - PRZEŹROCZYSTA PIGUŁKA APPLE GLASS
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveId(item.id);
                    setSelectedSwatchIndex(0);
                  }}
                  className="flex h-11 w-fit items-center gap-3 rounded-full px-5 text-left text-[15px] font-semibold bg-black/45 hover:bg-black/65 backdrop-blur-xl text-white border border-white/20 transition-all duration-300 shadow-md hover:scale-105 active:scale-95 cursor-pointer"
                  aria-pressed={false}
                >
                  <span className="grid h-5 w-5 place-items-center rounded-full border border-white/40 text-white/90">
                    <Plus className="h-3 w-3" />
                  </span>
                  <span className="whitespace-nowrap tracking-tight">{item.label}</span>
                </button>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
