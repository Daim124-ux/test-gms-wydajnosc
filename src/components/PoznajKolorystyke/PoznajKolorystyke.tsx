'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Box, X } from 'lucide-react';
import ResponsiveAsset from '@/components/common/ResponsiveAsset';
import { createPortal } from 'react-dom';
import dynamic from 'next/dynamic';

const CarportViewer = dynamic(() => import('./CarportViewer'), { ssr: false });

// Obejście dla TypeScript: traktujemy model-viewer jako komponent React
const ModelViewer = 'model-viewer' as any;

const CLOUDFRONT_URL = '/cdn-assets';
const FULL_CLOUDFRONT_URL = 'https://d1moyf5ccth9x8.cloudfront.net';
const MODEL_URL = `${CLOUDFRONT_URL}/assets/modele_ar/wiata_rowerowa/wiata_rowerowa_v03.glb`;
const AR_MODEL_URL = `${FULL_CLOUDFRONT_URL}/assets/modele_ar/wiata_rowerowa/wiata_rowerowa_v03.glb`;

// Pomocnicza funkcja do konwersji HEX na RGBA dla model-viewer
const hexToRgba = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return [r, g, b, 1];
};

export interface KolorWiaty {
  id: string;
  nazwa: string;
  hex: string;
  folder: string; // nazwa folderu ze zdjęciami
}

export interface ElementKolorystyki {
  id: string;
  tytul: string;
  pozycjaTekstu?: 'gora' | 'srodek' | 'dol' | 'prawa-srodek' | 'prawa-dol';
  pozycjaObrazu?: string;
  rozmiarObrazu?: 'cover' | 'contain';
  szerokosc?: 'pelna' | '45' | '55';
}

interface PoznajKolorystykeProps {
  kolory: KolorWiaty[];
  elementy: ElementKolorystyki[];
}

import { useTranslations } from 'next-intl';

export default function PoznajKolorystyke({ kolory, elementy }: PoznajKolorystykeProps) {
  const t = useTranslations('productLayout.colorSection');

  const [wybranyKolor, setWybranyKolor] = useState<KolorWiaty>(kolory[0]);
  const [poprzedniKolor, setPoprzedniKolor] = useState<KolorWiaty | null>(null);
  const [aktywnyId, setAktywnyId] = useState<string | null>(elementy[0]?.id || null);
  const [splashKey, setSplashKey] = useState(0);
  const [sekcjaWidoczna, setSekcjaWidoczna] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const kontenerScrollRef = useRef<HTMLDivElement>(null);
  const modelViewerRef = useRef<any>(null);

  // Intersection Observer do śledzenia aktywnego slajdu (dla ramki)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            setAktywnyId(entry.target.getAttribute('data-id'));
          }
        });
      },
      { threshold: 0.5, root: kontenerScrollRef.current }
    );

    const slides = kontenerScrollRef.current?.querySelectorAll('.karta-karuzeli');
    slides?.forEach((slide) => observer.observe(slide));

    return () => observer.disconnect();
  }, [elementy]);

  // Określa czy cała sekcja jest w oknie (do aktywacji globalnego tła)
  useEffect(() => {
    const sectionObserver = new IntersectionObserver(
      ([entry]) => {
        setSekcjaWidoczna(entry.isIntersecting);
      },
      { threshold: 0.4 } // Aktywuj przy 40% widoczności
    );

    const sectionEl = document.getElementById('sekcja-kolorystyka');
    if (sectionEl) sectionObserver.observe(sectionEl);

    return () => sectionObserver.disconnect();
  }, []);

  // Manipulacja tłem sekcji dla efektu głębi
  useEffect(() => {
    // Usunięto manipulację document.body, która mogła powodować dziwne kolory na mobile
  }, [sekcjaWidoczna, wybranyKolor]);

  const zmienKolor = (kolor: KolorWiaty) => {
    if (kolor.id === wybranyKolor.id) return;
    setPoprzedniKolor(wybranyKolor);
    setWybranyKolor(kolor);
    setSplashKey(prev => prev + 1);

    // Aktualizujemy model-viewer dla AR (na wypadek gdyby użytkownik od razu kliknął AR)
    if (modelViewerRef.current) {
      const rgba = hexToRgba(kolor.hex);
      modelViewerRef.current.model?.materials.forEach((material: any) => {
        if (material.name.toUpperCase().includes('KOLOR')) {
          material.pbrMetallicRoughness.setBaseColorFactor(rgba);
        }
      });
    }
  };

  const przewinWLewo = () => {
    if (kontenerScrollRef.current) {
      kontenerScrollRef.current.scrollBy({ left: -450, behavior: 'smooth' });
    }
  };

  const przewinWPrawo = () => {
    if (kontenerScrollRef.current) {
      kontenerScrollRef.current.scrollBy({ left: 450, behavior: 'smooth' });
    }
  };

  const handle3DClick = () => {
    try {
      const isAndroid = /Android/i.test(navigator.userAgent);
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isMobile = isAndroid || isIOS;
      
      if (isAndroid) {
        // Używamy bezpośredniego linku do CloudFront dla Androida (najbardziej stabilne dla Scene Viewer)
        // Musi być zakodowany (encodeURIComponent)
        const intentUrl = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(AR_MODEL_URL)}&mode=3d_preferred&title=Wiata%20Rowerowa#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url=https://developers.google.com/ar;end;`;
        window.location.href = intentUrl;
      } else if (isIOS) {
        // Na iOS próbujemy użyć model-viewer (wymaga pliku .usdz do działania w AR)
        const mv = modelViewerRef.current as any;
        if (mv && typeof mv.activateAR === 'function') {
          mv.activateAR();
        } else {
          alert('Tryb AR na iOS wymaga modelu w formacie .usdz.');
          setIsModalOpen(true);
        }
      } else {
        // Desktop
        setIsModalOpen(true);
      }
    } catch (err: any) {
      alert('Wystąpił błąd: ' + err.message);
    }
  };

  return (
    <section
      id="sekcja-kolorystyka"
      className="w-full bg-[#161617] py-24 sm:py-32 relative min-h-[100vh] flex flex-col justify-center snap-center transition-colors duration-1000"
    >
      {/* GLOBALNY EFEKT SPLASH DLA CAŁEJ STRONY */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden transition-opacity duration-1000"
        style={{
          opacity: sekcjaWidoczna ? 1 : 0,
          zIndex: 5 // Nad bazowym tłem, pod main contentem
        }}
      >
        {/* Bazowe tło globalne dla koloru - tylko jako overlay */}
        <div
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            backgroundColor: wybranyKolor.hex,
            opacity: 0.08
          }}
        />

        <AnimatePresence mode="popLayout">
          {/* Główna wielka plama Splash */}
          <motion.div
            key={`main-splash-${splashKey}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 2.5, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div
              className="w-[100vw] h-[100vw] rounded-full blur-[120px]"
              style={{ backgroundColor: wybranyKolor.hex + '1a' }}
            />
          </motion.div>

          {/* Szybszy impuls Splasha */}
          <motion.div
            key={`impuls-${splashKey}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 3, opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute inset-x-0 bottom-0 flex items-center justify-center"
          >
            <div
              className="w-[120vw] h-[80vh] rounded-t-full blur-[150px]"
              style={{ backgroundColor: wybranyKolor.hex + '15' }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative z-10">
        {/* PIONOWY TEKST RAL - Tło po lewej (Mockup style) */}
        <div
          className="absolute left-[8vw] 2xl:left-[11vw] top-[20%] bottom-[20%] hidden xl:flex items-center justify-center pointer-events-none z-0"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={wybranyKolor.id}
              initial={{ opacity: 0, x: -70, scale: 0.8 }}
              animate={{
                opacity: aktywnyId === elementy[0].id ? 0.12 : 0,
                scale: aktywnyId === elementy[0].id ? 1 : 0,
                x: wybranyKolor.nazwa.toLowerCase().includes('mat') ? -50 : 3
              }}
              exit={{ opacity: 0, x: 20, scale: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
              style={{ writingMode: 'vertical-rl', WebkitTextStroke: '3px white' }}
              className="select-none flex flex-col items-center"
            >
              <span className="text-[120px] 2xl:text-[150px] font-black text-transparent tracking-tighter leading-none">
                {wybranyKolor.nazwa.split(' - ')[0].replace(' Mat', '').replace(' ', '')}
              </span>
              {wybranyKolor.nazwa.toLowerCase().includes('mat') && (
                <span className="text-[32px] 2xl:text-[40px] font-bold text-white mt-4 tracking-[0.2em] uppercase opacity-60">
                  MAT
                </span>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* NAGŁÓWEK */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <h2 className="section-headline">
            {t('title')}
          </h2>
        </div>

        {/* KONTENER SLIDERA */}
        <div className="relative w-full">
          <div
            ref={kontenerScrollRef}
            className="flex gap-3 lg:gap-4 overflow-x-auto snap-x snap-mandatory hide-scrollbar w-full scroll-pl-4 sm:scroll-pl-6 lg:scroll-pl-8 xl:scroll-pl-[calc((100vw_-_1280px)_/_2_+_32px)] py-8"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="shrink-0 pointer-events-none w-0 sm:w-2 lg:w-4 xl:w-[calc((100vw_-_1280px)_/_2_+_8px)]" />

            {elementy.map((element) => (
              <div
                key={element.id}
                data-id={element.id}
                className={`snap-start snap-always shrink-0 ${element.szerokosc === '45' ? 'w-[80vw] md:w-[32vw] xl:w-[27vw]' :
                  element.szerokosc === '55' ? 'w-[85vw] md:w-[40vw] xl:w-[33vw]' :
                    'w-[85vw] md:w-[60vw]'
                  } h-[50vh] md:h-[70vh] relative rounded-[20px] karta-karuzeli animowana-ramka ${aktywnyId === element.id ? 'aktywna' : ''}`}
                style={{
                  ['--glow-color' as any]: wybranyKolor.hex,
                  ['--glow-accent' as any]: '#ffffff' // Biały akcent dla połysku
                }}
              >
                <div className={`w-full h-full relative rounded-[20px] overflow-hidden group bg-black transition-all duration-500 border ${aktywnyId === element.id ? 'border-white/5' : 'border-[#86868B]'}`}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={wybranyKolor.id + element.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6 }}
                      className={`absolute ${element.rozmiarObrazu === 'cover' ? 'inset-0' : 'inset-[30px]'} brightness-[1.15]`}
                    >
                      <ResponsiveAsset
                        src={`/assets/images/wiaty-stalowe-na-rowery/kolorystyka/${wybranyKolor.folder}/Wiata_rowerowa_${wybranyKolor.folder}_${element.id}-min.jpg`}
                        type="image"
                        alt={`${wybranyKolor.nazwa} - ${element.tytul}`}
                        className={`w-full h-full ${element.rozmiarObrazu === 'cover' ? 'object-cover' : 'object-contain'
                          } ${element.id === 'klapa' ? 'md:[object-position:-30px_center]' : ''}`}
                      />
                    </motion.div>
                  </AnimatePresence>

                  <div className="absolute inset-0 bg-black/20" />
                  
                  {/* PRZYCISK 3D / AR */}
                  <button
                    onClick={handle3DClick}
                    className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/60 transition-all active:scale-90 shadow-lg"
                    title="Zobacz w 3D / AR"
                  >
                    <Box size={20} />
                  </button>
                </div>
              </div>
            ))}

            <div className="shrink-0 pointer-events-none w-0 sm:w-2 lg:w-4 xl:w-[calc((100vw_-_1280px)_/_2_+_8px)]" />
          </div>

          {/* NAWIGACJA + PICKER - Wspólna linia na gridzie 1280px */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative flex flex-col items-center justify-center pb-8 gap-6">
            {/* Liquid Glass Label + Picker Container */}
            <div className="relative flex items-center justify-center w-full">
              {/* Liquid Glass Picker - Stable Center */}
              <div className="backdrop-blur-3xl bg-white/5 border border-white/10 rounded-[24px] md:rounded-full p-1.5 md:p-1 flex flex-wrap md:flex-nowrap justify-center gap-1 md:gap-1.5 shadow-2xl ring-1 ring-white/5 z-10 max-w-[calc(100vw-32px)] md:max-w-none">
                {kolory.map((kolor) => (
                  <button
                    key={kolor.id}
                    onClick={() => zmienKolor(kolor)}
                    className={`w-[30px] h-[30px] md:w-8 md:h-8 rounded-full flex-shrink-0 transition-all duration-500 relative flex items-center justify-center
                      ${wybranyKolor.id === kolor.id ? 'scale-100' : 'scale-75 hover:scale-95 opacity-60 hover:opacity-100'}`}
                    style={{ backgroundColor: kolor.hex }}
                  >
                    {wybranyKolor.id === kolor.id && (
                      <>
                        <motion.div
                          layoutId="activeColorRingRefined"
                          className="absolute inset-[-5px] border-[2px] border-white/60 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                          transition={{ type: 'spring', bounce: 0.3, duration: 0.7 }}
                        />
                        <div className="w-1 h-1 bg-white rounded-full" />
                      </>
                    )}
                  </button>
                ))}
              </div>

              {/* Pill - Integrated to the right, stabilized */}
              <div className="absolute left-[calc(50%+220px)] hidden lg:block">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={wybranyKolor.id}
                    initial={{ opacity: 0, x: -10, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, x: 10, filter: 'blur(10px)' }}
                    className="backdrop-blur-2xl bg-white/10 border border-white/20 px-5 py-2 rounded-full shadow-2xl ring-1 ring-white/10"
                  >
                    <span className="text-white text-[11px] font-bold tracking-[0.2em] uppercase whitespace-nowrap">
                      {wybranyKolor.nazwa.split(' - ')[0]}
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Mobile Pill - below on mobile */}
              <div className="absolute top-[calc(100%+12px)] lg:hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={wybranyKolor.id + '-mobile'}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="backdrop-blur-xl bg-white/10 border border-white/20 px-4 py-1.5 rounded-full"
                  >
                    <span className="text-white text-[10px] font-bold tracking-[0.1em] uppercase">
                      {wybranyKolor.nazwa.split(' - ')[0]}
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Strzałki - Prawa (+90px shift per user manual edit) */}
            <div className="hidden md:flex gap-2 absolute right-0 -translate-x-[90px]">
              <button
                onClick={przewinWLewo}
                className="w-10 h-10 rounded-full bg-zinc-800/80 border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all active:scale-95"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={przewinWPrawo}
                className="w-10 h-10 rounded-full bg-zinc-800/80 border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all active:scale-95"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* SILNIK AR (UKRYTY ALE AKTYWNY) */}
      <ModelViewer
        ref={modelViewerRef}
        src={MODEL_URL}
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        loading="eager"
        style={{ 
          opacity: 0, 
          width: '1px', 
          height: '1px', 
          position: 'absolute', 
          pointerEvents: 'none',
          zIndex: -1 
        }}
      />

      {/* MODAL 3D DLA DESKTOPA */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/90 backdrop-blur-xl">
          <button 
            onClick={() => setIsModalOpen(false)}
            className="absolute top-8 right-8 z-[3010] p-4 text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={32} />
          </button>
          
          <div className="w-full h-full max-w-6xl max-h-[85vh] flex flex-col items-center justify-center relative p-4">
            <CarportViewer 
              url={MODEL_URL} 
              color={wybranyKolor.hex} 
              colorId={wybranyKolor.id}
              isMat={wybranyKolor.nazwa.toLowerCase().includes('mat')}
            />
            
            <div className="mt-6 text-center">
              <p className="text-white/40 text-xs tracking-widest uppercase mb-1">Model 3D wiaty</p>
              <h3 className="text-white text-xl font-medium tracking-wide">{wybranyKolor.nazwa}</h3>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
