'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import './Footer.css';

const PIKTOGRAMY = [
  '/assets/piktogramy/Piktogram_1.svg',
  '/assets/piktogramy/Piktogram_2.svg',
  '/assets/piktogramy/Piktogram_3.svg',
  '/assets/piktogramy/Piktogram_4.svg',
  '/assets/piktogramy/Piktogram_5.svg',
  '/assets/piktogramy/Piktogram_6.svg',
  '/assets/piktogramy/Piktogram_7.svg',
];

const COLORS = ['#e69b35', '#4062cc', '#ed3e44'];

interface FooterProps {
  variant?: 'light' | 'dark';
}

export default function Footer({ variant }: FooterProps) {
  const [icons, setIcons] = useState<{ id: number; src: string; delay: number; x: string; size: number; startY: number; color: string }[]>([]);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setExpandedSection(expandedSection === section ? null : section);
    }
  };

  useEffect(() => {
    const newIcons = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      src: PIKTOGRAMY[Math.floor(Math.random() * PIKTOGRAMY.length)],
      delay: Math.random() * 20,
      x: `${Math.random() * 90 + 5}%`,
      size: Math.random() * 25 + 15,
      startY: Math.random() * 100 + 50,
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
    <div className={variant === 'dark' ? 'dark-variant' : variant === 'light' ? 'light-variant' : ''}>
      <footer className={`footer-main ${variant === 'dark' ? 'dark-variant' : 'light-variant'}`}>

        {/* WARSTWA 1: PIKTOGRAMY */}
        <div className="footer-piktogramy-layer">
          {icons.map((icon) => (
            <motion.div
              key={icon.id}
              initial={{ y: 550 + icon.startY, opacity: 0 }}
              animate={{
                y: -200,
                opacity: [0, 1, 1, 0],
                rotate: [0, 30, -30, 0]
              }}
              transition={{
                duration: 14,
                repeat: Infinity,
                delay: icon.delay,
                ease: "linear"
              }}
              className="piktogram-item"
              style={{ width: icon.size, height: icon.size, left: icon.x }}
            >
              <div className="piktogram-glow" style={{ backgroundColor: icon.color }} />
              <div
                className="piktogram-mask"
                style={{
                  backgroundColor: icon.color,
                  WebkitMaskImage: `url(${icon.src})`,
                  maskImage: `url(${icon.src})`
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* WARSTWA 2: LOGO GMS */}
        <div className="footer-logo-layer">
          <div className="footer-logo-container">
            <div className="footer-logo-glow-large" />
            <div className="footer-logo-glow-small" />
            <div className="footer-logo-mask" />
          </div>
        </div>

        {/* WARSTWA 2.5: JEDNOROŻEC */}
        <div className="footer-unicorn-layer">
          <div className="unicorn-text-wrapper">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="unicorn-text-main"
            >
              Nie goń schematów.<br />
              Złap <span className="unicorn-text-gradient">Jednorożca.</span>
            </motion.div>
          </div>
          <video
            src="/assets/videos/main/jednorozec_gms.mkv"
            autoPlay
            loop
            muted
            playsInline
            className="unicorn-video"
          />
        </div>

        {/* WARSTWA 3: KARTA Z LINKAMI */}
        <div className="footer-content-card-wrapper">
          <div className="footer-content-card">
            <div className="footer-grid">

              {/* Kolumna 1: Dom system */}
              <div className="footer-column-accordion">
                <button onClick={() => toggleSection('dom')} className="footer-column-header">
                  <h4 className="footer-column-title">Dom system</h4>
                  <motion.span animate={{ rotate: expandedSection === 'dom' ? 180 : 0 }} className="lg:hidden text-[#86868b]">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </motion.span>
                </button>
                <AnimatePresence>
                  {(expandedSection === 'dom' || (typeof window !== 'undefined' && window.innerWidth >= 1024)) && (
                    <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="footer-link-list">
                      <li><Link href="/system-dom/wiata-stalowa-na-rowery/" className="footer-link">Wiata na rowery</Link></li>
                      <li><Link href="/system-dom/garaze-blaszane/" className="footer-link">Garaże SuperStrong</Link></li>
                      <li><Link href="/system-dom/bramy-garazowe/" className="footer-link">Bramy garażowe</Link></li>
                      <li><Link href="/system-dom/bramy-rozwierne/" className="footer-link">Bramy rozwierne</Link></li>
                      <li><Link href="/system-dom/bramy-uchylne/" className="footer-link">Bramy uchylne</Link></li>
                      <li><Link href="/system-dom/bramy-rozwierne-panelowe/" className="footer-link">Bramy rozwierne panelowe</Link></li>
                      <li><Link href="/system-dom/wiaty-stalowe/" className="footer-link">Wiaty stalowe</Link></li>
                      <li><Link href="/system-dom/garaze-stalowe/" className="footer-link">Garaże stalowe</Link></li>
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>

              {/* Kolumna 2: Osiedle system */}
              <div className="footer-column-accordion">
                <button onClick={() => toggleSection('osiedle')} className="footer-column-header">
                  <h4 className="footer-column-title">Osiedle system</h4>
                  <motion.span animate={{ rotate: expandedSection === 'osiedle' ? 180 : 0 }} className="lg:hidden text-[#86868b]">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </motion.span>
                </button>
                <AnimatePresence>
                  {(expandedSection === 'osiedle' || (typeof window !== 'undefined' && window.innerWidth >= 1024)) && (
                    <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="footer-link-list">
                      <li><Link href="/system-osiedle/altany-smietnikowe/" className="footer-link">Altany i wiaty śmietnikowe</Link></li>
                      <li><Link href="/system-osiedle/altany-z-zielonym-dachem/" className="footer-link">Altany z zielonym dachem</Link></li>
                      <li><Link href="/system-osiedle/boksy-garazowe/" className="footer-link">Boksy garażowe</Link></li>
                      <li><Link href="/system-osiedle/drzwi-do-piwnic/" className="footer-link">Drzwi do piwnic</Link></li>
                      <li><Link href="/system-osiedle/garaze-zbiorcze-i-wiaty-garażowe/" className="footer-link">Garaże zbiorcze</Link></li>
                      <li><Link href="/system-osiedle/komorki-lokatorskie-i-boks-rowerowy/" className="footer-link">Komórki lokatorskie</Link></li>
                      <li><Link href="/system-osiedle/wygrodzenia-systemowe/" className="footer-link">Wygrodzenia systemowe</Link></li>
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>

              {/* Kolumna 3: Lokalizacja */}
              <div className="pb-4 lg:pb-0">
                <h4 className="footer-column-title">Godziny pracy & Lokalizacja</h4>
                <div className="flex flex-col gap-6 mt-8 lg:mt-0">
                  <p className="footer-text-info">
                    Biuro I, II, Nawojowa 33-335<br />
                    Krynicka 55, Nawojowa<br />
                    Polska
                  </p>
                  <p className="footer-text-info">
                    Poniedziałek - Piątek<br />
                    07:00 - 15:00
                  </p>
                </div>
              </div>

              {/* Kolumna 4: Szybki dostęp */}
              <div className="pb-4 lg:pb-0">
                <h4 className="footer-column-title">Szybki dostęp</h4>
                <ul className="footer-link-list">
                  <li><Link href="/sklep/" className="footer-link">Sklep</Link></li>
                  <li><Link href="/o-nas/" className="footer-link">O nas</Link></li>
                  <li><Link href="/blog/" className="footer-link">Blog | GMS Press</Link></li>
                  <li><Link href="/dystrybutorzy/" className="footer-link">Dystrybutorzy</Link></li>
                  <li><Link href="/kariera/" className="footer-link">Kariera</Link></li>
                  <li><Link href="/kontakt/" className="footer-link">Kontakt</Link></li>
                  <li><Link href="/realizacje/" className="footer-link">Realizacje</Link></li>
                  <li><Link href="/do-pobrania/" className="footer-link">Do pobrania</Link></li>
                </ul>
              </div>

              {/* Kolumna 5: Kariera */}
              <div className="pb-4 lg:pb-0">
                <h4 className="footer-column-title">GMS Kariera</h4>
                <div className="flex flex-col gap-6 mt-8 lg:mt-0">
                  <p className="footer-text-info">
                    Zacznij pracę w GMS<br />
                    Corporation
                  </p>
                  <Link href="/kariera/" className="footer-career-link">
                    Dołącz do naszej społeczności
                  </Link>
                </div>
              </div>

            </div>

            {/* BOTTOM BAR */}
            <div className="footer-bottom-bar">
              <div className="footer-copyright">
                © 2026 GMS System® Corporation sp. z.o.o. | All Rights Reserved | by Mateusz Sromek | <a href="mailto:biuro@gms-system.com" className="hover:text-[#0066cc] transition-colors">biuro@gms-system.com</a>
              </div>
              <div className="footer-legal-links">
                <Link href="/polityka-prywatnosci/" className="footer-legal-link">Polityka prywatności</Link>
                <Link href="/rodo/" className="footer-legal-link">RODO</Link>
                <Link href="/cookies/" className="footer-legal-link">Pliki cookies</Link>
              </div>
            </div>

          </div>
        </div>
      </footer>
    </div>
  );
}
