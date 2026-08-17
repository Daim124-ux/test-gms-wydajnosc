'use client';

import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import MegaMenu from './MegaMenu';
import SearchPanel from './SearchPanel';
import './Header.css';

type HeaderPanel = 'products' | 'more' | null;

const languages = [
  { code: 'pl', country: 'Polska', language: 'Polski', flag: 'PL' },
  { code: 'en', country: 'UK', language: 'English', flag: 'GB' },
  { code: 'de', country: 'Deutschland', language: 'Deutsch', flag: 'DE' },
  { code: 'fr', country: 'France', language: 'Français', flag: 'FR' },
  { code: 'ua', country: 'Україна', language: 'Українська', flag: 'UA' },
  { code: 'sk', country: 'Slovensko', language: 'Slovenčina', flag: 'SK' },
  { code: 'cs', country: 'Česko', language: 'Čeština', flag: 'CZ' },
  { code: 'hu', country: 'Magyarország', language: 'Magyar', flag: 'HU' },
  { code: 'da', country: 'Danmark', language: 'Dansk', flag: 'DK' },
  { code: 'it', country: 'Italia', language: 'Italiano', flag: 'IT' },
  { code: 'nl', country: 'Nederland', language: 'Nederlands', flag: 'NL' },
  { code: 'no', country: 'Norge', language: 'Norsk', flag: 'NO' },
  { code: 'sv', country: 'Sverige', language: 'Svenska', flag: 'SE' },
] as const;

const productButtonLabels: Record<string, string> = {
  pl: 'Produkty', en: 'Products', de: 'Produkte', fr: 'Produits', ua: 'Продукти',
  sk: 'Produkty', cs: 'Produkty', hu: 'Termékek', da: 'Produkter', it: 'Prodotti', nl: 'Producten', no: 'Produkter', sv: 'Produkter',
};

export default function Header() {
  const headerT = useTranslations('navigation.header');
  const megaT = useTranslations('navigation.megaMenu');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const languageRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activePanel, setActivePanel] = useState<HeaderPanel>(null);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const currentLanguage = languages.find((language) => language.code === locale) ?? languages[0];
  const isPolish = locale === 'pl';

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 16);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setActivePanel(null);
      setIsLanguageOpen(false);
      setIsMobileOpen(false);
      setIsSearchOpen(false);
    };
    const onOutsideClick = (event: PointerEvent) => {
      if (!languageRef.current?.contains(event.target as Node)) setIsLanguageOpen(false);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onOutsideClick);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onOutsideClick);
    };
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setActivePanel(null);
      setIsLanguageOpen(false);
      setIsMobileOpen(false);
      setIsSearchOpen(false);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    const shouldLock = isMobileOpen || isSearchOpen;
    document.body.classList.toggle('nav-lock', shouldLock);
    return () => document.body.classList.remove('nav-lock');
  }, [isMobileOpen, isSearchOpen]);

  const openPanel = (panel: Exclude<HeaderPanel, null>) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setActivePanel(panel);
    setIsLanguageOpen(false);
  };

  const closePanelSoon = () => {
    closeTimerRef.current = setTimeout(() => setActivePanel(null), 150);
  };

  const closeEverything = () => {
    setActivePanel(null);
    setIsMobileOpen(false);
  };

  const changeLanguage = (languageCode: string) => {
    setIsLanguageOpen(false);
    router.replace(pathname, { locale: languageCode });
  };

  const togglePanel = (panel: Exclude<HeaderPanel, null>) => {
    setActivePanel((current) => current === panel ? null : panel);
  };

  // Hide header on admin pages
  if (pathname.includes('/admin')) {
    return null;
  }

  return (
    <>
      <header className={`site-header ${isScrolled ? 'is-scrolled' : ''} ${isMobileOpen ? 'is-mobile-open' : ''}`}>
        <div className="site-header__bar">
          <div className="site-brand">
            <Link href="/" className="site-brand__logo" aria-label="GMS System — strona główna">
              <Image src="/assets/logo/gms_logo_achromat_r.svg" alt="GMS System" width={154} height={30} priority />
            </Link>
            <div className="language-switcher" ref={languageRef}>
              <button type="button" className="language-switcher__current" onClick={() => setIsLanguageOpen((open) => !open)} aria-expanded={isLanguageOpen} aria-haspopup="listbox">
                {currentLanguage.country}<svg viewBox="0 0 12 12" aria-hidden="true"><path d="m3 4.5 3 3 3-3" /></svg>
              </button>
              <AnimatePresence>
                {isLanguageOpen && (
                  <motion.div className="language-switcher__menu" role="listbox" aria-label="Wybierz język" initial={{ opacity: 0, y: -8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.98 }} transition={{ duration: 0.18 }}>
                    {languages.map((language) => (
                      <button type="button" role="option" aria-selected={language.code === locale} className={language.code === locale ? 'is-active' : ''} onClick={() => changeLanguage(language.code)} key={language.code}>
                        <span>{language.flag}</span><strong>{language.language}</strong>{language.code === locale && <span aria-hidden="true">✓</span>}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <nav className="desktop-nav" aria-label="Główna nawigacja">
            <button type="button" className={activePanel === 'products' ? 'is-active' : ''} onMouseEnter={() => openPanel('products')} onFocus={() => openPanel('products')} onMouseLeave={closePanelSoon} onClick={() => togglePanel('products')} aria-expanded={activePanel === 'products'}>
              <span className="desktop-nav__grid-icon" aria-hidden="true"><i /><i /><i /><i /></span>{productButtonLabels[locale] ?? productButtonLabels.en}<span className="desktop-nav__chevron" aria-hidden="true" />
            </button>
            <Link href="/sklep">{headerT('shop')}</Link>
            <Link href="/strefa-partnera">{headerT('partnerZone')}</Link>
            <Link href="/kontakt">{headerT('contact')}</Link>
            <button type="button" className={activePanel === 'more' ? 'is-active' : ''} onMouseEnter={() => openPanel('more')} onFocus={() => openPanel('more')} onMouseLeave={closePanelSoon} onClick={() => togglePanel('more')} aria-expanded={activePanel === 'more'}>
              {headerT('more')}<span className="desktop-nav__chevron" aria-hidden="true" />
            </button>
          </nav>

          <div className="site-header__actions">
            <Link href="/moje-konto" className="header-icon-button" aria-label={isPolish ? 'Zaloguj się' : 'Sign in'} title={isPolish ? 'Logowanie' : 'Sign in'}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.4" /><path d="M5.5 20c.5-4 2.8-6 6.5-6s6 2 6.5 6" /></svg>
            </Link>
            <button type="button" className="header-icon-button" aria-label={isPolish ? 'Otwórz wyszukiwarkę' : 'Open search'} title={isPolish ? 'Szukaj' : 'Search'} onClick={() => { setIsSearchOpen(true); setActivePanel(null); }}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.3" /><path d="m15.5 15.5 4.3 4.3" /></svg>
            </button>
            <Link href="/koszyk" className="header-icon-button" aria-label={isPolish ? 'Koszyk' : 'Cart'} title={isPolish ? 'Koszyk' : 'Cart'}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 5h2l1.6 9.2a2 2 0 0 0 2 1.7h7.8a2 2 0 0 0 2-1.6L20.3 8H6" /><circle cx="9.2" cy="19.2" r="1" /><circle cx="17.2" cy="19.2" r="1" /></svg>
            </Link>
            <Link href="/do-pobrania" className="header-icon-button" aria-label={isPolish ? 'Pliki do pobrania' : 'Downloads'} title={isPolish ? 'Do pobrania' : 'Downloads'}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5v11M7.8 10.8 12 15l4.2-4.2M4.5 19.5h15" /></svg>
            </Link>
            <button type="button" className="mobile-toggle" onClick={() => setIsMobileOpen((open) => !open)} aria-expanded={isMobileOpen} aria-controls="mobile-product-menu" aria-label={isMobileOpen ? 'Zamknij menu' : 'Otwórz menu'}><span /><span /></button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activePanel === 'products' && <MegaMenu key="products" onClose={closePanelSoon} onEnter={() => openPanel('products')} />}
          {activePanel === 'more' && (
            <motion.section key="more" className="more-menu" aria-label={headerT('more')} initial={{ opacity: 0, y: -10, scale: 0.99 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.99 }} transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }} onMouseEnter={() => openPanel('more')} onMouseLeave={closePanelSoon}>
              <div className="more-menu__primary">
                {[
                  ['/o-nas', megaT('moreLinks.about')], ['/kariera', megaT('moreLinks.career')], ['/blog', isPolish ? 'Blog | GMS Press' : megaT('moreLinks.blog')], ['/dystrybutorzy', megaT('moreLinks.distributors')], ['/realizacje', megaT('moreLinks.projects')],
                ].map(([href, label], index) => <Link href={href} onClick={() => setActivePanel(null)} key={href}><span>0{index + 1}</span><strong>{label}</strong><svg viewBox="0 0 18 18" aria-hidden="true"><path d="M4 9h10M10 5l4 4-4 4" /></svg></Link>)}
              </div>
              <footer><Link href="/polityka-prywatnosci" onClick={() => setActivePanel(null)}>{megaT('moreLinks.privacy')}</Link><Link href="/do-pobrania" onClick={() => setActivePanel(null)}>{megaT('moreLinks.downloads')}</Link></footer>
            </motion.section>
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {activePanel && <motion.button type="button" className="menu-backdrop" aria-label="Zamknij menu" onClick={() => setActivePanel(null)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />}
      </AnimatePresence>

      <AnimatePresence>{isSearchOpen && <SearchPanel onClose={() => setIsSearchOpen(false)} />}</AnimatePresence>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.nav id="mobile-product-menu" className="mobile-nav" aria-label="Nawigacja mobilna" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
            <div className="mobile-nav__head"><span>{isPolish ? 'Wybierz produkt' : 'Choose a product'}</span><strong>{isPolish ? 'Pełna oferta GMS' : 'Full GMS range'}</strong></div>
            <MegaMenu onClose={closeEverything} onEnter={() => undefined} />
            <div className="mobile-nav__utilities">
              <Link href="/sklep">{headerT('shop')}</Link><Link href="/strefa-partnera">{headerT('partnerZone')}</Link><Link href="/kontakt">{headerT('contact')}</Link><Link href="/realizacje">{megaT('moreLinks.projects')}</Link><Link href="/o-nas">{megaT('moreLinks.about')}</Link><Link href="/kariera">{megaT('moreLinks.career')}</Link><Link href="/blog">{megaT('moreLinks.blog')}</Link><Link href="/dystrybutorzy">{megaT('moreLinks.distributors')}</Link><Link href="/polityka-prywatnosci">{megaT('moreLinks.privacy')}</Link><Link href="/do-pobrania">{megaT('moreLinks.downloads')}</Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
