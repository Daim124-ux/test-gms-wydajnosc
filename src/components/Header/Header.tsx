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
            <Link href="/" className="mobile-nav-link" onClick={() => setIsMobileOpen(false)}>{t('more')}</Link>
            <Link href="/system-dom/wiata-stalowa-na-rowery/" className="mobile-nav-link" onClick={() => setIsMobileOpen(false)}>{t('domSystem')}</Link>
            <Link href="/system-osiedle/altany-smietnikowe/" className="mobile-nav-link" onClick={() => setIsMobileOpen(false)}>{t('osiedleSystem')}</Link>
            <Link href="/sklep/" className="mobile-nav-link" onClick={() => setIsMobileOpen(false)}>{t('shop')}</Link>
            <Link href="/strefa-partnera/" className="mobile-nav-link" onClick={() => setIsMobileOpen(false)}>{t('partnerZone')}</Link>
            <Link href="/kontakt/" className="mobile-nav-link" onClick={() => setIsMobileOpen(false)}>{t('contact')}</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
