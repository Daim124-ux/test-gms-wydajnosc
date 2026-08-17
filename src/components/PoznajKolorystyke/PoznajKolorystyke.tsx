'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Box, X, Smartphone } from 'lucide-react';
import ResponsiveAsset from '@/components/common/ResponsiveAsset';
import { createPortal } from 'react-dom';
import dynamic from 'next/dynamic';

const CarportViewer = dynamic(() => import('./CarportViewer'), { ssr: false });

// Obejście dla TypeScript: traktujemy model-viewer jako komponent React
const ModelViewer = 'model-viewer' as any;

const CLOUDFRONT_URL = '/cdn-assets';
const FULL_CLOUDFRONT_URL = 'https://d1moyf5ccth9x8.cloudfront.net';
const MODEL_URL = `${CLOUDFRONT_URL}/assets/modele_ar/wiata_rowerowa/wiata_rowerowa_ar_v27.glb`;
const AR_MODEL_URL = `${FULL_CLOUDFRONT_URL}/assets/modele_ar/wiata_rowerowa/wiata_rowerowa_ar_v27.glb`;

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
  isTynk?: boolean; // Tynk strukturalny z szumem
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
  modelUrl?: string;
  arModelUrl?: string;
  imagePathPattern?: (colorFolder: string, elementId: string) => string;
  modelLabel?: string;
  show3D?: boolean;
  darkTheme?: boolean;
}

import { useTranslations } from 'next-intl';

export default function PoznajKolorystyke({
  kolory,
  elementy,
  modelUrl = MODEL_URL,
  arModelUrl = AR_MODEL_URL,
  imagePathPattern = (colorFolder, elementId) => `/assets/images/wiaty-stalowe-na-rowery/kolorystyka/${colorFolder}/Wiata_rowerowa_${colorFolder}_${elementId}-min.jpg`,
  modelLabel = 'Model 3D Wiaty',
  show3D = true,
  darkTheme = true
}: PoznajKolorystykeProps) {
  const t = useTranslations('productLayout.colorSection');

  const [wybranyKolor, setWybranyKolor] = useState<KolorWiaty>(kolory[0]);
  const [poprzedniKolor, setPoprzedniKolor] = useState<KolorWiaty | null>(null);
  const [aktywnyId, setAktywnyId] = useState<string | null>(elementy[0]?.id || null);

  const ralColors = kolory.filter((k) => !k.isTynk);
  const tynkColors = kolory.filter((k) => k.isTynk);
  const [splashKey, setSplashKey] = useState(0);
  const [sekcjaWidoczna, setSekcjaWidoczna] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);

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

  // Zabezpieczenie przed "wiecznym ładowaniem" - natywny event listener i fallback
  useEffect(() => {
    if (isViewerOpen && modelViewerRef.current) {
      const mv = modelViewerRef.current;

      const handleLoad = () => setModelLoaded(true);
      mv.addEventListener('load', handleLoad);

      // Jeżeli model jest zakeszowany, load mógł wystrzelić zanim React go podpiął
      if (mv.model) {
        setModelLoaded(true);
      }

      return () => {
        mv.removeEventListener('load', handleLoad);
      };
    } else if (!isViewerOpen) {
      setModelLoaded(false);
    }
  }, [isViewerOpen]);

  // Synchronizacja pełnego materiału w ukrytym model-viewer dla AR
  useEffect(() => {
    if (isViewerOpen && modelLoaded && modelViewerRef.current?.model) {
      const mv = modelViewerRef.current;
      const normalize = (name: string) => name.toLowerCase().replace(/_/g, ' ').trim();
      let targetMatName = wybranyKolor.id === 'ocynk' ? "Ocynk" : `RAL${wybranyKolor.id.toString().replace('m', '')}`;
      const isMat = wybranyKolor.nazwa.toLowerCase().includes('mat');
      if (isMat) targetMatName += " mat";

      const materials = mv.model.materials;
      const targetNormalized = normalize(targetMatName);
      const targetMaterial = materials.find((m: any) => normalize(m.name) === targetNormalized);

      materials.forEach((material: any) => {
        const name = material.name.toUpperCase();
        if (name.includes('RAL') || name.includes('OCYNK') || name.includes('KOLOR')) {
          if (targetMaterial) {
            const pbr = material.pbrMetallicRoughness;
            const targetPbr = targetMaterial.pbrMetallicRoughness;

            // Kopiujemy parametry bazowe
            pbr.setBaseColorFactor(targetPbr.baseColorFactor);
            pbr.setRoughnessFactor(targetPbr.roughnessFactor);
            pbr.setMetallicFactor(targetPbr.metallicFactor);
            material.setEmissiveFactor(targetMaterial.emissiveFactor);

            // Kopiujemy wszystkie tekstury (base, normal, roughness, occlusion, emissive) aby materiał był identyczny
            if (pbr.baseColorTexture) pbr.baseColorTexture.setTexture(targetPbr.baseColorTexture?.texture || null);
            if (pbr.metallicRoughnessTexture) pbr.metallicRoughnessTexture.setTexture(targetPbr.metallicRoughnessTexture?.texture || null);
            if (material.normalTexture) material.normalTexture.setTexture(targetMaterial.normalTexture?.texture || null);
            if (material.occlusionTexture) material.occlusionTexture.setTexture(targetMaterial.occlusionTexture?.texture || null);
            if (material.emissiveTexture) material.emissiveTexture.setTexture(targetMaterial.emissiveTexture?.texture || null);

          } else {
            // Fallback
            const rgba = hexToRgba(wybranyKolor.hex);
            material.pbrMetallicRoughness.setBaseColorFactor(rgba);
            material.pbrMetallicRoughness.setRoughnessFactor(isMat ? 0.8 : 0.2);
          }
        }
      });
    }
  }, [wybranyKolor, modelLoaded, isViewerOpen]);

  const zmienKolor = (kolor: KolorWiaty) => {
    if (kolor.id === wybranyKolor.id) return;
    setPoprzedniKolor(wybranyKolor);
    setWybranyKolor(kolor);
    setSplashKey(prev => prev + 1);
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
    setIsViewerOpen(true);
  };

  return (
    <section
      id="sekcja-kolorystyka"
      className="w-full py-36 sm:py-48 relative min-h-[100vh] flex flex-col justify-center snap-center transition-colors duration-1000 overflow-hidden"
      style={{
        backgroundColor: darkTheme ? '#161617' : '#ffffff'
      }}
    >
      {/* EFEKT SPLASH DLA TEJ SEKCJI - INTENSYWNE PRZEJŚCIA KOLORÓW */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden transition-opacity duration-1000"
        style={{
          opacity: sekcjaWidoczna ? 1 : 0,
          zIndex: 0
        }}
      >
        {/* Bazowe intensywne tło dla koloru */}
        <div
          className="absolute inset-0 transition-all duration-700 ease-out"
          style={{
            backgroundColor: wybranyKolor.hex,
            opacity: sekcjaWidoczna ? (darkTheme ? 0.45 : 0.28) : 0
          }}
        />

        <AnimatePresence mode="popLayout">
          {/* Główna wielka plama Splash - Intensywna */}
          <motion.div
            key={`main-splash-${splashKey}`}
            initial={{ scale: 0.1, opacity: 0 }}
            animate={{ scale: 2.8, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div
              className="w-[90vw] h-[90vw] rounded-full blur-[80px]"
              style={{ backgroundColor: wybranyKolor.hex + (sekcjaWidoczna ? 'B0' : '00') }}
            />
          </motion.div>

          {/* Szybszy mocny impuls / fala koloru przy kliknięciu */}
          <motion.div
            key={`impuls-${splashKey}`}
            initial={{ scale: 0.2, opacity: 0.9 }}
            animate={{ scale: 3.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div
              className="w-[100vw] h-[100vw] rounded-full blur-[60px]"
              style={{ backgroundColor: wybranyKolor.hex }}
            />
          </motion.div>

          {/* Dolny poświata gradientowa */}
          <motion.div
            key={`bottom-glow-${splashKey}`}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 0.85, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-x-0 bottom-0 flex items-center justify-center pointer-events-none"
          >
            <div
              className="w-[140vw] h-[60vh] rounded-t-full blur-[100px]"
              style={{ backgroundColor: wybranyKolor.hex + (sekcjaWidoczna ? '77' : '00') }}
            />
          </motion.div>
        </AnimatePresence>

        {/* STRUKTURALNY TYNK - DROBNOZIARNISTY SUBTELNY TYNK BARANEK */}
        {wybranyKolor.isTynk && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 pointer-events-none z-[1] mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='plasterBgFilterFine'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncR type='linear' slope='1.6' intercept='-0.3'/%3E%3CfeFuncG type='linear' slope='1.6' intercept='-0.3'/%3E%3CfeFuncB type='linear' slope='1.6' intercept='-0.3'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23plasterBgFilterFine)'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
            }}
          />
        )}
      </div>

      {/* GÓRNA DELIKATNA NAKŁADKA / ROZMYCIE KRAWĘDZI SEKCJI W KOLORZE TŁA STRONY */}
      <div
        className={`absolute top-0 inset-x-0 h-28 md:h-40 pointer-events-none z-[5] bg-gradient-to-b ${darkTheme
            ? 'from-[#161617] via-[#161617]/75 to-transparent'
            : 'from-white via-white/75 to-transparent'
          }`}
      />

      {/* DOLNA DELIKATNA NAKŁADKA / ROZMYCIE KRAWĘDZI SEKCJI W KOLORZE TŁA STRONY */}
      <div
        className={`absolute bottom-0 inset-x-0 h-28 md:h-40 pointer-events-none z-[5] bg-gradient-to-t ${darkTheme
            ? 'from-[#161617] via-[#161617]/75 to-transparent'
            : 'from-white via-white/75 to-transparent'
          }`}
      />

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
              style={{ writingMode: 'vertical-rl', WebkitTextStroke: darkTheme ? '3px white' : '3px black' }}
              className="select-none flex flex-col items-center"
            >
              <span className="text-[120px] 2xl:text-[150px] font-black text-transparent tracking-tighter leading-none whitespace-nowrap">
                {(() => {
                  const czysty = wybranyKolor.nazwa.split(' - ')[0].replace(' Mat', '');
                  if (czysty.toLowerCase() === 'ciemny szary') return 'C. Szary';
                  if (czysty.toLowerCase() === 'jasny szary') return 'J. Szary';
                  return czysty.replace(' ', '');
                })()}
              </span>
              {wybranyKolor.nazwa.toLowerCase().includes('mat') && (
                <span className={`text-[32px] 2xl:text-[40px] font-bold mt-4 tracking-[0.2em] uppercase opacity-60 ${darkTheme ? 'text-white' : 'text-slate-950'
                  }`}>
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
                        src={imagePathPattern(wybranyKolor.folder, element.id)}
                        type="image"
                        alt={`${wybranyKolor.nazwa} - ${element.tytul}`}
                        className={`w-full h-full ${element.rozmiarObrazu === 'cover' ? 'object-cover' : 'object-contain'
                          } ${element.id === 'klapa' ? 'md:[object-position:-30px_center]' : ''}`}
                      />
                    </motion.div>
                  </AnimatePresence>

                  <div className="absolute inset-0 bg-black/20 pointer-events-none" />

                  {/* EFEKT DROBNEGO TYNKU STRUKTURALNEGO NA KAFELKU (DROBNE ZIARNO) */}
                  <div
                    className={`absolute inset-0 pointer-events-none z-10 mix-blend-overlay transition-opacity duration-700 ease-out ${wybranyKolor.isTynk ? 'opacity-40' : 'opacity-0'
                      }`}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='plasterCardFine'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncR type='linear' slope='1.8' intercept='-0.4'/%3E%3CfeFuncG type='linear' slope='1.8' intercept='-0.4'/%3E%3CfeFuncB type='linear' slope='1.8' intercept='-0.4'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23plasterCardFine)'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'repeat',
                      filter: 'contrast(125%)',
                    }}
                  />

                  {/* PIGUŁKA Z NAZWĄ KOLORU - W prawym dolnym rogu kafelka, 10px od rogu */}
                  <div className="absolute right-[10px] bottom-[10px] z-20 pointer-events-none">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={wybranyKolor.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className={`h-9 px-4 flex items-center justify-center rounded-full shadow-xl backdrop-blur-xl border whitespace-nowrap ${darkTheme
                          ? 'bg-white/10 border-white/20 text-white'
                          : 'bg-black/60 border-white/20 text-white shadow-2xl'
                          }`}
                      >
                        <span className="text-[11px] font-bold tracking-[0.16em] uppercase whitespace-nowrap">
                          {wybranyKolor.nazwa.split(' - ')[0]}
                        </span>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* GŁÓWNY PRZYCISK 3D/AR */}
                  {show3D && (
                    <div className="absolute top-4 right-4 z-20 flex gap-2">
                      <button
                        onClick={handle3DClick}
                        className="w-10 h-10 rounded-full bg-blue-600/60 backdrop-blur-md border border-blue-400/40 flex items-center justify-center text-white/90 hover:text-white hover:bg-blue-600 transition-all active:scale-90 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                        title="Zobacz w 3D / AR"
                      >
                        <Box size={20} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div className="shrink-0 pointer-events-none w-0 sm:w-2 lg:w-4 xl:w-[calc((100vw_-_1280px)_/_2_+_8px)]" />
          </div>

          {/* NAWIGACJA + PICKER - Pigułki kolorów w jednej linii z wysokością h-10 */}
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative flex flex-col items-center justify-center pb-8 gap-4">
            {/* Single Horizontal Row containing color pills: RAL & TYNK */}
            <div className="relative flex flex-row flex-wrap items-center justify-center gap-3 md:gap-4 z-10 w-full">
              {/* PIGUŁKA 1: POWŁOKI RAL (DOKŁADNIE TEJ SAMEJ WYSOKOŚCI H-10 / 40px) */}
              {ralColors.length > 0 && (
                <div className="h-10 backdrop-blur-3xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full px-3 flex items-center gap-1.5 shadow-xl ring-1 ring-black/5 dark:ring-white/5">
                  <span className={`text-[9px] md:text-[10px] font-bold tracking-[0.15em] uppercase px-1 select-none ${darkTheme ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    RAL
                  </span>
                  {ralColors.map((kolor) => (
                    <button
                      key={kolor.id}
                      onClick={() => zmienKolor(kolor)}
                      title={kolor.nazwa.split(' - ')[0]}
                      className={`w-[26px] h-[26px] md:w-[28px] md:h-[28px] rounded-full flex-shrink-0 transition-all duration-300 relative flex items-center justify-center overflow-hidden border border-black/20 dark:border-white/30 shadow-sm
                        ${wybranyKolor.id === kolor.id ? 'scale-100 ring-2 ring-offset-1 ring-zinc-700 dark:ring-white border-transparent' : 'scale-90 hover:scale-100 opacity-80 hover:opacity-100'}`}
                      style={{ backgroundColor: kolor.hex }}
                    >
                      {wybranyKolor.id === kolor.id && (
                        <>
                          <motion.div
                            layoutId="activeColorRingRefined"
                            className="absolute inset-[-4px] border-[2px] border-white/60 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                            transition={{ type: 'spring', bounce: 0.3, duration: 0.7 }}
                          />
                          <div className="w-1.5 h-1.5 bg-white rounded-full z-10 relative shadow-sm" />
                        </>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* PIGUŁKA 2: TYNK STRUKTURALNY (DOKŁADNIE TEJ SAMEJ WYSOKOŚCI H-10 / 40px) */}
              {tynkColors.length > 0 && (
                <div className="h-10 backdrop-blur-3xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full px-3 flex items-center gap-1.5 shadow-xl ring-1 ring-black/5 dark:ring-white/5">
                  <span className={`text-[9px] md:text-[10px] font-bold tracking-[0.15em] uppercase px-1 select-none ${darkTheme ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    TYNK
                  </span>
                  {tynkColors.map((kolor) => (
                    <button
                      key={kolor.id}
                      onClick={() => zmienKolor(kolor)}
                      title={kolor.nazwa}
                      className={`w-[26px] h-[26px] md:w-[28px] md:h-[28px] rounded-full flex-shrink-0 transition-all duration-300 relative flex items-center justify-center overflow-hidden border border-black/20 dark:border-white/30 shadow-sm
                        ${wybranyKolor.id === kolor.id ? 'scale-100 ring-2 ring-offset-1 ring-zinc-700 dark:ring-white border-transparent' : 'scale-90 hover:scale-100 opacity-80 hover:opacity-100'}`}
                      style={{ backgroundColor: kolor.hex }}
                    >
                      <div
                        className="absolute inset-0 rounded-full opacity-50 mix-blend-overlay pointer-events-none"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilterSwatchFine'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilterSwatchFine)'/%3E%3C/svg%3E")`,
                          backgroundRepeat: 'repeat',
                        }}
                      />
                      {wybranyKolor.id === kolor.id && (
                        <>
                          <motion.div
                            layoutId="activeColorRingRefined"
                            className="absolute inset-[-4px] border-[2px] border-white/60 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                            transition={{ type: 'spring', bounce: 0.3, duration: 0.7 }}
                          />
                          <div className="w-1.5 h-1.5 bg-white rounded-full z-10 relative shadow-sm" />
                        </>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Strzałki - Prawa (+90px shift per user manual edit) */}
            <div className="hidden md:flex gap-2 absolute right-0 -translate-x-[90px] z-40">
              <button
                onClick={przewinWLewo}
                className="w-10 h-10 rounded-full bg-black/8 dark:bg-zinc-800/80 border border-black/10 dark:border-white/10 flex items-center justify-center text-[#1d1d1f] dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all active:scale-95 shadow-md"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={przewinWPrawo}
                className="w-10 h-10 rounded-full bg-black/8 dark:bg-zinc-800/80 border border-black/10 dark:border-white/10 flex items-center justify-center text-[#1d1d1f] dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all active:scale-95 shadow-md"
              >
                <ChevronRight size={18} />
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

      {/* WSPÓLNY MODAL (NASZ VIEWER 3D + AR) */}
      {isViewerOpen && createPortal(
        <div className="fixed inset-0 z-[4000] bg-black flex flex-col items-center justify-center">
          <button
            onClick={() => setIsViewerOpen(false)}
            className="absolute top-8 right-8 z-[4010] p-4 text-white bg-black/50 hover:bg-white/20 rounded-full transition-colors backdrop-blur-md"
          >
            <X size={32} />
          </button>

          <div className="w-full h-full relative flex flex-col">
            <div className="flex-1 w-full relative">
              {/* Pełnowymiarowy model-viewer do obsługi AR, renderowany tylko w modalu (widoczny dla przeglądarki) */}
              <div className="absolute inset-0 z-0 pointer-events-none bg-black">
                <ModelViewer
                  ref={modelViewerRef}
                  src={modelUrl}
                  ar
                  ar-modes="webxr quick-look"
                  ar-scale="fixed"
                  camera-controls
                  loading="eager"
                  style={{ width: '100%', height: '100%' }}
                />
              </div>

              {/* Tło przykrywające surowy model-viewer, by nie prześwitywał pod CarportViewerem */}
              <div className="absolute inset-0 z-5 bg-gradient-to-b from-[#111] to-black pointer-events-none" />

              {/* Główny widok wizualny na wierzchu */}
              <div className="absolute inset-0 z-10 pointer-events-auto">
                <CarportViewer
                  url={modelUrl}
                  color={wybranyKolor.hex}
                  colorId={wybranyKolor.id}
                  isMat={wybranyKolor.nazwa.toLowerCase().includes('mat')}
                />
              </div>
            </div>

            <div className="absolute top-8 left-8 z-[4010] pointer-events-none text-left hidden md:block">
              <p className="text-white/50 text-xs tracking-[0.2em] uppercase font-semibold mb-1">{modelLabel}</p>
              <h3 className="text-white text-2xl font-bold tracking-wide">{wybranyKolor.nazwa}</h3>
            </div>

            {/* Przycisk uruchamiający AR (korzysta z ukrytego głównego model-viewer) */}
            {typeof navigator !== 'undefined' && (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) && (
              <button
                onClick={() => {
                  if (modelViewerRef.current && typeof modelViewerRef.current.activateAR === 'function') {
                    modelViewerRef.current.activateAR();
                  }
                }}
                className={`absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 px-10 py-5 rounded-full font-bold text-lg transition-all duration-300 active:scale-95 z-50 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] 
                  ${modelLoaded
                    ? 'bg-white text-black hover:bg-zinc-100 hover:-translate-y-1 hover:shadow-white/10'
                    : 'bg-zinc-900 text-zinc-600 cursor-not-allowed'}`}
                disabled={!modelLoaded}
              >
                <Smartphone size={24} className={modelLoaded ? 'text-blue-600' : ''} />
                <span className="tracking-tight uppercase">
                  {modelLoaded ? 'ZOBACZ U SIEBIE' : 'PRZYGOTOWYWANIE...'}
                </span>
              </button>
            )}
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
