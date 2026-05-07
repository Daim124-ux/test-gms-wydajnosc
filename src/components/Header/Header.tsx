'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MegaMenu from './MegaMenu';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import './Header.css';

interface Translation {
  uri: string;
  locale: string;
}

interface HeaderProps {
  translations?: Translation[];
}

export default function Header({ translations = [] }: HeaderProps) {
  const t = useTranslations('navigation.header');
  const tm = useTranslations('navigation.megaMenu.moreLinks');
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  
  const languages = [
    { code: 'pl', countryName: 'Polska', languageName: 'Polski', flag: 'PL' },
    { code: 'en', countryName: 'UK', languageName: 'English', flag: 'GB' },
    { code: 'de', countryName: 'Deutschland', languageName: 'Deutsch', flag: 'DE' },
    { code: 'fr', countryName: 'France', languageName: 'Français', flag: 'FR' },
    { code: 'ua', countryName: 'Україна', languageName: 'Українська', flag: 'UA' },
    { code: 'sk', countryName: 'Slovensko', languageName: 'Slovenčina', flag: 'SK' },
    { code: 'cs', countryName: 'Česko', languageName: 'Čeština', flag: 'CZ' },
    { code: 'hu', countryName: 'Magyarország', languageName: 'Magyar', flag: 'HU' },
    { code: 'da', countryName: 'Danmark', languageName: 'Dansk', flag: 'DK' },
    { code: 'it', countryName: 'Italia', languageName: 'Italiano', flag: 'IT' },
    { code: 'nl', countryName: 'Nederland', languageName: 'Nederlands', flag: 'NL' },
    { code: 'no', countryName: 'Norge', languageName: 'Norsk', flag: 'NO' },
    { code: 'sv', countryName: 'Sverige', languageName: 'Svenska', flag: 'SE' }
  ];

  const currentLangObj = languages.find(l => l.code === locale);
  const currentLangDisplay = currentLangObj ? currentLangObj.countryName : 'Polska';
  
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
                        <span className="lang-name">{lang.languageName}</span>
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
              {t('domSystem')}
            </div>
            <div 
              className="nav-item" 
              onMouseEnter={() => handleMouseEnter('osiedle')}
            >
              {t('osiedleSystem')}
            </div>
            <Link href="/sklep/" className="nav-item">{t('shop')}</Link>
            <Link href="/strefa-partnera/" className="nav-item">{t('partnerZone')}</Link>
            <Link href="/kontakt/" className="nav-item">{t('contact')}</Link>
            <div 
              className="nav-item" 
              onMouseEnter={() => handleMouseEnter('wiecej')}
            >
              {t('more')}
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

      {/* SVG Filter for Liquid Glass effect */}
      <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
        <filter id="frosted" primitiveUnits="objectBoundingBox">
          <feImage 
            href="data:image/png;base64,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 onmouseover="document.getElementById('disp').animate([{scale: 1}, {scale: 1.4}], {duration: 300, fill: 'freeze'})"
            onmouseout="document.getElementById('disp').animate([{scale: 1.4}, {scale: 1}], {duration: 300, fill: 'freeze'})"
          />
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.02" result="blur" />
          <feDisplacementMap id="disp" in="blur" in2="map" scale="1" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
    </>
  );
}
