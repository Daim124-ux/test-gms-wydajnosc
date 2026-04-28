'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MegaMenu from './MegaMenu';
import Link from 'next/link';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import './Header.css';

interface Translation {
  uri: string;
  locale: string;
}

interface HeaderProps {
  translations?: Translation[];
}

export default function Header({ translations = [] }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  
  const languages = [
    { code: 'pl', name: 'Polska', flag: '🇵🇱' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'de', name: 'Deutschland', flag: '🇩🇪' },
    { code: 'fr', name: 'France', flag: '🇫🇷' },
    { code: 'ua', name: 'Ukraine', flag: '🇺🇦' },
    { code: 'sk', name: 'Slovensko', flag: '🇸🇰' },
    { code: 'cs', name: 'Česko', flag: '🇨🇿' },
    { code: 'hu', name: 'Magyarország', flag: '🇭🇺' },
    { code: 'da', name: 'Danmark', flag: '🇩🇰' },
    { code: 'it', name: 'Italia', flag: '🇮🇹' },
    { code: 'nl', name: 'Nederland', flag: '🇳🇱' },
    { code: 'no', name: 'Norge', flag: '🇳🇴' },
    { code: 'sv', name: 'Sverige', flag: '🇸🇪' }
  ];

  const currentLangObj = languages.find(l => l.code === locale);
  const currentLangDisplay = currentLangObj ? currentLangObj.name : 'Polska';
  
  const [activeMenu, setActiveMenu] = useState<'dom' | 'osiedle' | 'wiecej' | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const handleLangChange = (langCode: string) => {
    setIsLangOpen(false);
    router.replace(pathname, { locale: langCode });
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseEnter = (menu: 'dom' | 'osiedle' | 'wiecej') => {
    setActiveMenu(menu);
  };

  const handleMouseLeave = () => {
    setActiveMenu(null);
  };

  return (
    <>
      <header className={`header-main ${isMobileOpen ? 'mobile-open' : ''} ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-container">
          <div className="header-left-group">
            <Link href="/" className="header-logo-link">
              <img src="/assets/logo/gms_logo_achromat_r.svg" alt="GMS System" className="header-logo-img" />
            </Link>

            {/* LANGUAGE SELECTOR */}
            <div className="lang-selector-container">
              <button 
                className={`lang-current-minimal ${isLangOpen ? 'active' : ''}`}
                onClick={() => setIsLangOpen(!isLangOpen)}
              >
                {currentLangDisplay}
              </button>

              <AnimatePresence>
                {isLangOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="lang-dropdown"
                  >
                    {languages.map((lang) => (
                      <div 
                        key={lang.code}
                        className={`lang-option ${locale === lang.code ? 'selected' : ''}`}
                        onClick={() => handleLangChange(lang.code)}
                      >
                        <span className="lang-flag">{lang.flag}</span>
                        <span className="lang-name">{lang.name}</span>
                        {locale === lang.code && <span className="lang-check">✓</span>}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* DESKTOP NAV */}
          <nav className="header-nav-desktop">
            <div 
              className="nav-item" 
              onMouseEnter={() => handleMouseEnter('dom')}
            >
              Dom system
            </div>
            <div 
              className="nav-item" 
              onMouseEnter={() => handleMouseEnter('osiedle')}
            >
              Osiedle system
            </div>
            <Link href="/sklep/" className="nav-item">Sklep</Link>
            <Link href="/strefa-partnera/" className="nav-item">Strefa Partnera</Link>
            <Link href="/kontakt/" className="nav-item">Kontakt</Link>
            <div 
              className="nav-item" 
              onMouseEnter={() => handleMouseEnter('wiecej')}
            >
              Więcej
            </div>
          </nav>

          {/* MOBILE TOGGLE */}
          <div className="mobile-menu-toggle" onClick={() => setIsMobileOpen(!isMobileOpen)}>
            <div className="burger-line"></div>
            <div className="burger-line"></div>
            <div className="burger-line"></div>
          </div>
        </div>

        {/* MEGA MENU COMPONENT */}
        <AnimatePresence>
          {activeMenu && (
            <MegaMenu 
              type={activeMenu} 
              onClose={handleMouseLeave} 
            />
          )}
        </AnimatePresence>
      </header>

      {/* MOBILE NAV OVERLAY */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="mobile-nav-overlay"
          >
            <Link href="/" className="mobile-nav-link" onClick={() => setIsMobileOpen(false)}>Główna</Link>
            <Link href="/system-dom/wiata-stalowa-na-rowery/" className="mobile-nav-link" onClick={() => setIsMobileOpen(false)}>Dom system</Link>
            <Link href="/system-osiedle/altany-smietnikowe/" className="mobile-nav-link" onClick={() => setIsMobileOpen(false)}>Osiedle system</Link>
            <Link href="/sklep/" className="mobile-nav-link" onClick={() => setIsMobileOpen(false)}>Sklep</Link>
            <Link href="/strefa-partnera/" className="mobile-nav-link" onClick={() => setIsMobileOpen(false)}>Strefa Partnera</Link>
            <Link href="/kontakt/" className="mobile-nav-link" onClick={() => setIsMobileOpen(false)}>Kontakt</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
