'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import ResponsiveAsset from '../common/ResponsiveAsset';

const PIKTOGRAMY = [
  '/assets/piktogramy/Piktogram_1.svg',
  '/assets/piktogramy/Piktogram_2.svg',
  '/assets/piktogramy/Piktogram_3.svg',
  '/assets/piktogramy/Piktogram_4.svg',
  '/assets/piktogramy/Piktogram_5.svg',
  '/assets/piktogramy/Piktogram_6.svg',
  '/assets/piktogramy/Piktogram_7.svg',
];

const FloatingIcon = ({ src, delay, x, size }: { src: string; delay: number; x: string; size: number }) => (
  <motion.div
    initial={{ y: '100%', opacity: 0, x: x }}
    animate={{
      y: '-200%',
      opacity: [0, 1, 1, 0],
      rotate: [0, 10, -10, 0]
    }}
    transition={{
      duration: 15,
      repeat: Infinity,
      delay: delay,
      ease: "linear"
    }}
    className="absolute pointer-events-none z-0 grayscale opacity-20"
    style={{ width: size, height: size }}
  >
    <Image src={src} alt="Piktogram" width={size} height={size} className="w-full h-full" />
  </motion.div>
);

const COLORS = ['#e69b35', '#4062cc', '#ed3e44'];

interface FooterProps {
  variant?: 'light' | 'dark';
}

export default function Footer({ variant }: FooterProps) {
  const [icons, setIcons] = useState<{ id: number; src: string; delay: number; x: string; size: number; startY: number; color: string }[]>([]);
  const [manifest, setManifest] = useState<any>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  useEffect(() => {
    fetch('/_optimized/manifest.json')
      .then(res => res.json())
      .then(data => setManifest(data))
      .catch(() => console.warn('Footer manifest not found.'));
  }, []);

  const resolveAsset = (src: string) => {
    if (!manifest) return src;
    const cleanSrc = src.startsWith('/') ? src.slice(1) : src;
    return manifest.images?.[cleanSrc]?.original || manifest.videos?.[cleanSrc]?.original || src;
  };

  useEffect(() => {
    // Generujemy losowe piktogramy
    const newIcons = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      src: PIKTOGRAMY[Math.floor(Math.random() * PIKTOGRAMY.length)],
      delay: Math.random() * 20,
      x: `${Math.random() * 90 + 5}%`,
      size: Math.random() * 25 + 15,
      startY: Math.random() * 100 + 50, // Początkowe przesunięcie w dół, by schować się za kartą
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));
    setIcons(newIcons);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.3;
    }
  }, []);

  return (
    <div className={variant === 'dark' ? 'dark' : variant === 'light' ? 'light' : ''}>
      <footer className="relative w-full bg-white dark:bg-black pt-[500px] md:pt-[650px] pb-0">

      {/* WARSTWA 1: PIKTOGRAMY (Najniżej - Z-0) */}
      {/* Kontener zajmuje całą przestrzeń powyżej białej karty. Piktogramy wylatują zza dolnej krawędzi tego kontenera. */}
      <div className="absolute top-0 left-0 right-0 h-[550px] z-0 overflow-visible pointer-events-none">
        {icons.map((icon) => (
          <motion.div
            key={icon.id}
            initial={{ y: 550 + icon.startY, opacity: 0 }}
            animate={{
              y: -200,
              opacity: [0, 1, 1, 0], // Zwiększyłem widoczność w trakcie animacji
              rotate: [0, 30, -30, 0]
            }}
            transition={{
              duration: 14,
              repeat: Infinity,
              delay: icon.delay,
              ease: "linear"
            }}
            className="absolute"
            style={{ width: icon.size, height: icon.size, left: icon.x }}
          >
            {/* Mały Glow za piktogramem (w kolorze piktogramu) */}
            <div
              className="absolute inset-[-100%] blur-xl rounded-full pointer-events-none opacity-20"
              style={{ backgroundColor: icon.color }}
            />
            {/* Piktogram jako maska kolorystyczna */}
            <div
              className="w-full h-full relative z-10 opacity-70"
              style={{
                backgroundColor: icon.color,
                WebkitMaskImage: `url(${resolveAsset(icon.src)})`,
                WebkitMaskSize: 'contain',
                WebkitMaskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
                maskImage: `url(${resolveAsset(icon.src)})`,
                maskSize: 'contain',
                maskRepeat: 'no-repeat',
                maskPosition: 'center'
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* WARSTWA 2: LOGO GMS (Pośrodku - Z-10) */}
      {/* Logo nieco obniżone, żeby karta z linkami mocniej je przykrywała z dołu */}
      <div className="absolute left-0 right-0 top-[250px] md:top-[280px] z-10 flex justify-center pointer-events-none select-none">
        <div className="relative w-full max-w-[1400px] px-10 flex justify-center items-center">

          {/* Wielokolorowy Glow za logiem - Silniejszy i skoncentrowany na środku */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[250px] bg-gradient-to-r from-[#e69b35]/30 via-[#4062cc]/40 to-[#ed3e44]/30 blur-[120px] rounded-full pointer-events-none z-0" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[120px] bg-white/30 blur-[60px] rounded-full pointer-events-none z-0" />

          {/* Logo jako Gradientowa Maska */}
          <div
            className="w-full max-w-[1200px] h-[350px] md:h-[450px] bg-gradient-to-r from-gray-400 via-white to-gray-400 opacity-20 dark:opacity-30 relative z-10"
            style={{
              WebkitMaskImage: `url(${resolveAsset('/assets/logo/gms_logo_achromat_r.svg')})`,
              WebkitMaskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
              maskImage: `url(${resolveAsset('/assets/logo/gms_logo_achromat_r.svg')})`,
              maskSize: 'contain',
              maskRepeat: 'no-repeat',
              maskPosition: 'center'
            }}
          />
        </div>
      </div>

      {/* WARSTWA 2.5: JEDNOROŻEC (Z-15) */}
      {/* Znajduje się nad logiem GMS, ale pod kartą z linkami. */}
      <div className="absolute left-0 right-0 top-[180px] md:top-[150px] z-[15] flex flex-col items-center pointer-events-none select-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="mb-[-60px] md:mb-[-100px] text-center relative z-10"
        >
          <span className="text-[28px] md:text-[56px] font-bold font-['Poppins'] tracking-tight leading-[1.1] text-[#1d1d1f] dark:text-[#f5f5f7] opacity-95">
            Nie goń schematów.<br />Złap <span className="bg-gradient-to-r from-[#e69b35] via-[#4062cc] to-[#ed3e44] bg-clip-text text-transparent">Jednorożca.</span>
          </span>
        </motion.div>
        <ResponsiveAsset
          ref={videoRef}
          src="/assets/videos/main/jednorozec_gms.mkv"
          type="video"
          autoPlay
          loop
          muted
          playsInline
          className="w-[400px] md:w-[600px] object-contain mix-blend-screen relative z-20"
        />
      </div>

      {/* WARSTWA 3: BIAŁE POLE Z LINKAMI (Najwyżej - Z-20) */}
      <div className="relative z-20 max-w-[1600px] mx-auto px-4 md:px-6">
        <div className="bg-white dark:bg-[#1d1d1f] rounded-t-[40px] md:rounded-t-[80px] pt-20 pb-12 px-10 md:px-20 shadow-[0_-30px_100px_rgba(0,0,0,0.04)] dark:shadow-none border-t border-gray-100 dark:border-gray-800/50">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 md:gap-8">

            {/* Kolumna 1: Dom system */}
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#86868b] dark:text-[#a1a1a6] mb-8">Dom system</h4>
              <ul className="space-y-4">
                <li><Link href="/system-dom/wiata-stalowa-na-rowery/" className="text-[14px] text-[#1d1d1f] dark:text-[#f5f5f7] hover:text-[#0066cc] transition-colors font-medium">Wiata na rowery</Link></li>
                <li><Link href="/system-dom/garaze-blaszane/" className="text-[14px] text-[#1d1d1f] dark:text-[#f5f5f7] hover:text-[#0066cc] transition-colors font-medium">Garaże SuperStrong</Link></li>
                <li><Link href="/system-dom/bramy-garazowe/" className="text-[14px] text-[#1d1d1f] dark:text-[#f5f5f7] hover:text-[#0066cc] transition-colors font-medium">Bramy garażowe</Link></li>
                <li><Link href="/system-dom/bramy-rozwierne/" className="text-[14px] text-[#1d1d1f] dark:text-[#f5f5f7] hover:text-[#0066cc] transition-colors font-medium">Bramy rozwierne</Link></li>
                <li><Link href="/system-dom/bramy-uchylne/" className="text-[14px] text-[#1d1d1f] dark:text-[#f5f5f7] hover:text-[#0066cc] transition-colors font-medium">Bramy uchylne</Link></li>
                <li><Link href="/system-dom/bramy-rozwierne-panelowe/" className="text-[14px] text-[#1d1d1f] dark:text-[#f5f5f7] hover:text-[#0066cc] transition-colors font-medium">Bramy rozwierne panelowe</Link></li>
                <li><Link href="/system-dom/wiaty-stalowe/" className="text-[14px] text-[#1d1d1f] dark:text-[#f5f5f7] hover:text-[#0066cc] transition-colors font-medium">Wiaty stalowe</Link></li>
                <li><Link href="/system-dom/garaze-stalowe/" className="text-[14px] text-[#1d1d1f] dark:text-[#f5f5f7] hover:text-[#0066cc] transition-colors font-medium">Garaże stalowe</Link></li>
              </ul>
            </div>

            {/* Kolumna 2: Osiedle system */}
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#86868b] dark:text-[#a1a1a6] mb-8">Osiedle system</h4>
              <ul className="space-y-4">
                <li><Link href="/system-osiedle/altany-smietnikowe/" className="text-[14px] text-[#1d1d1f] dark:text-[#f5f5f7] hover:text-[#0066cc] transition-colors font-medium">Altany i wiaty śmietnikowe</Link></li>
                <li><Link href="/system-osiedle/altany-z-zielonym-dachem/" className="text-[14px] text-[#1d1d1f] dark:text-[#f5f5f7] hover:text-[#0066cc] transition-colors font-medium">Altany z zielonym dachem</Link></li>
                <li><Link href="/system-osiedle/boksy-garazowe/" className="text-[14px] text-[#1d1d1f] dark:text-[#f5f5f7] hover:text-[#0066cc] transition-colors font-medium">Boksy garażowe</Link></li>
                <li><Link href="/system-osiedle/drzwi-do-piwnic/" className="text-[14px] text-[#1d1d1f] dark:text-[#f5f5f7] hover:text-[#0066cc] transition-colors font-medium">Drzwi do piwnic</Link></li>
                <li><Link href="/system-osiedle/garaze-zbiorcze-i-wiaty-garażowe/" className="text-[14px] text-[#1d1d1f] dark:text-[#f5f5f7] hover:text-[#0066cc] transition-colors font-medium">Garaże zbiorcze</Link></li>
                <li><Link href="/system-osiedle/komorki-lokatorskie-i-boks-rowerowy/" className="text-[14px] text-[#1d1d1f] dark:text-[#f5f5f7] hover:text-[#0066cc] transition-colors font-medium">Komórki lokatorskie</Link></li>
                <li><Link href="/system-osiedle/wygrodzenia-systemowe/" className="text-[14px] text-[#1d1d1f] dark:text-[#f5f5f7] hover:text-[#0066cc] transition-colors font-medium">Wygrodzenia systemowe</Link></li>
              </ul>
            </div>

            {/* Kolumna 3: Godziny pracy & Lokalizacja */}
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#86868b] dark:text-[#a1a1a6] mb-8">Godziny pracy & Lokalizacja</h4>
              <div className="space-y-6">
                <p className="text-[14px] text-[#1d1d1f] dark:text-[#f5f5f7] font-medium leading-relaxed">
                  Biuro I, II, Nawojowa 33-335<br />
                  Krynicka 55, Nawojowa<br />
                  Polska
                </p>
                <p className="text-[14px] text-[#1d1d1f] dark:text-[#f5f5f7] font-medium leading-relaxed">
                  Poniedziałek - Piątek<br />
                  07:00 - 15:00
                </p>
              </div>
            </div>

            {/* Kolumna 4: Szybki dostęp */}
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#86868b] dark:text-[#a1a1a6] mb-8">Szybki dostęp</h4>
              <ul className="space-y-4">
                <li><Link href="/sklep/" className="text-[14px] text-[#1d1d1f] dark:text-[#f5f5f7] hover:text-[#0066cc] transition-colors font-medium">Sklep</Link></li>
                <li><Link href="/o-nas/" className="text-[14px] text-[#1d1d1f] dark:text-[#f5f5f7] hover:text-[#0066cc] transition-colors font-medium">O nas</Link></li>
                <li><Link href="/blog/" className="text-[14px] text-[#1d1d1f] dark:text-[#f5f5f7] hover:text-[#0066cc] transition-colors font-medium">Blog | GMS Press</Link></li>
                <li><Link href="/dystrybutorzy/" className="text-[14px] text-[#1d1d1f] dark:text-[#f5f5f7] hover:text-[#0066cc] transition-colors font-medium">Dystrybutorzy</Link></li>
                <li><Link href="/kariera/" className="text-[14px] text-[#1d1d1f] dark:text-[#f5f5f7] hover:text-[#0066cc] transition-colors font-medium">Kariera</Link></li>
                <li><Link href="/kontakt/" className="text-[14px] text-[#1d1d1f] dark:text-[#f5f5f7] hover:text-[#0066cc] transition-colors font-medium">Kontakt</Link></li>
                <li><Link href="/realizacje/" className="text-[14px] text-[#1d1d1f] dark:text-[#f5f5f7] hover:text-[#0066cc] transition-colors font-medium">Realizacje</Link></li>
                <li><Link href="/do-pobrania/" className="text-[14px] text-[#1d1d1f] dark:text-[#f5f5f7] hover:text-[#0066cc] transition-colors font-medium">Do pobrania</Link></li>
              </ul>
            </div>

            {/* Kolumna 5: GMS Kariera */}
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#86868b] dark:text-[#a1a1a6] mb-8">GMS Kariera</h4>
              <div className="space-y-6">
                <p className="text-[14px] text-[#1d1d1f] dark:text-[#f5f5f7] font-medium leading-relaxed">
                  Zacznij pracę w GMS<br />
                  Corporation
                </p>
                <Link href="/kariera/" className="inline-block text-[14px] text-[#0066cc] font-medium hover:underline">
                  Dołącz do naszej społeczności
                </Link>
              </div>
            </div>

          </div>

          {/* BOTTOM BAR */}
          <div className="mt-32 pt-10 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
              <span className="text-[11px] font-medium text-[#86868b] dark:text-[#86868b]">
                © 2026 GMS System® Corporation sp. z.o.o. | All Rights Reserved | by Mateusz Sromek | <a href="mailto:biuro@gms-system.com" className="hover:text-[#0066cc] transition-colors">biuro@gms-system.com</a>
              </span>
            </div>
            <div className="flex gap-8 text-[11px] font-medium text-[#86868b] dark:text-[#86868b]">
              <Link href="/polityka-prywatnosci/" className="hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] transition-colors">Polityka prywatności</Link>
              <Link href="/rodo/" className="hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] transition-colors">RODO</Link>
              <Link href="/cookies/" className="hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] transition-colors">Pliki cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
    </div>
  );
}


