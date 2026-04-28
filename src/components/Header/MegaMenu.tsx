'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface MegaMenuProps {
  type: 'dom' | 'osiedle' | 'wiecej' | null;
  onClose: () => void;
}

export default function MegaMenu({ type, onClose }: MegaMenuProps) {
  const t = useTranslations('navigation.megaMenu');
  const tCommon = useTranslations('common');
  const [activeTab, setActiveTab] = useState(type === 'osiedle' ? 'altany-zielone' : 'garaze-stalowe');

  if (!type) return null;

  const domTabs = [
    { id: 'garaze-stalowe', label: t('tabs.garages') },
    { id: 'garaze-superstrong', label: t('tabs.superstrong') },
    { id: 'wiata', label: t('tabs.bikeShelter') },
    { id: 'wiaty-stalowe', label: t('tabs.steelShelters') },
    { id: 'bramy', label: t('tabs.gates') }
  ];

  const osiedleTabs = [
    { id: 'altany-zielone', label: t('tabs.greenShelters') },
    { id: 'altany-smietnikowe', label: t('tabs.trashShelters') },
    { id: 'kompaktowe', label: t('tabs.compactShelters') },
    { id: 'drzwi', label: t('tabs.basementDoors') },
    { id: 'garaze-zbiorcze', label: t('tabs.collectiveGarages') },
    { id: 'scianki', label: t('tabs.partitionWalls') },
    { id: 'wygrodzenia', label: t('tabs.bikeCages') }
  ];

  const tabs = type === 'osiedle' ? osiedleTabs : domTabs;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={`mega-menu-overlay ${type}-theme`}
      onMouseLeave={onClose}
    >
      {type === 'wiecej' ? (
        <div className="wiecej-container">
          <div className="wiecej-links-main">
            <Link href="/o-nas/" className="wiecej-link">{t('moreLinks.about')}</Link>
            <Link href="/kariera/" className="wiecej-link">{t('moreLinks.career')}</Link>
            <Link href="/blog/" className="wiecej-link">{t('moreLinks.blog')}</Link>
            <Link href="/dystrybutorzy/" className="wiecej-link">{t('moreLinks.distributors')}</Link>
            <Link href="/realizacje/" className="wiecej-link">{t('moreLinks.projects')}</Link>
          </div>
          
          <div className="wiecej-footer">
            <Link href="/polityka-prywatnosci/" className="wiecej-link-small">{t('moreLinks.privacy')}</Link>
            <Link href="/do-pobrania/" className="wiecej-link-small">{t('moreLinks.downloads')}</Link>
          </div>
        </div>
      ) : (
        <>
          {/* SECONDARY NAV - TABS */}
          <div className="mega-secondary-nav">
            {tabs.map((tab) => (
              <div 
                key={tab.id}
                className={`secondary-nav-item ${activeTab === tab.id ? 'active' : ''} ${type === 'osiedle' ? 'osiedle-nav-item' : ''}`}
                onMouseEnter={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className={`mega-menu-inner ${activeTab === 'bramy' ? 'grid-cols-3-equal' : ''}`}
            >
              {activeTab === 'altany-zielone' && (
                <>
                  {/* COLUMN 1: MAIN PRODUCT CARD (40%) */}
                  <div className="mega-card-product border-green-accent">
                      <div className="mega-card-content flex flex-col items-start justify-center">
                        <h2 className="mega-card-title-main">Altany Zielone</h2>
                        <Link href="/system-osiedle/altany-z-zielonym-dachem/" className="mega-btn-green">{t('tabs.superstrong')}</Link>
                      </div>
                      <div className="mega-card-img-wrap">
                        <img src="/assets/images/wiaty-stalowe-na-rowery/steptodown.com543925.jpg" alt="Altana z zielonym dachem" />
                      </div>
                    </div>

                    {/* COLUMN 2: CENTER LOGO PLACEHOLDER (20%) */}
                    <div className="mega-logo-placeholder">
                      <div className="placeholder-box">
                        <img src="/assets/piktogramy/Piktogram_4.svg" alt="Piktogram Altana" className="w-48 h-48 opacity-80" />
                      </div>
                    </div>

              {/* COLUMN 3: PROMOS & BLOG (40%) */}
              <div className="mega-right-col">
                
                <div className="mega-right-top-row">
                  {/* PROMO BANNER */}
                  <div className="promo-banner">
                    <img src="/assets/images/wiaty-stalowe-na-rowery/Wiata-na-rowery-GMS-System.jpg" className="absolute inset-0 w-full h-full object-cover opacity-40" />
                    <div className="promo-content relative z-10">
                      <div className="text-[10px] text-white/80 font-semibold mb-1">Sprawdź również:</div>
                      <div className="text-[18px] text-[#00e676] font-bold leading-tight">Altany i wiaty śmietnikowe</div>
                      <p className="text-[10px] text-white/90 mt-2 pr-4 leading-tight">Odpady też przechowuj z klasą.</p>
                    </div>
                  </div>

                  {/* EKO RUCHY CARD */}
                  <div className="configurator-card !bg-black border border-[#00e676]/20 relative overflow-hidden flex flex-col items-center justify-center p-4">
                    <div className="text-[14px] font-bold text-[#00e676] mb-2 text-center leading-tight">Nasze eko ruchy</div>
                    <div className="w-12 h-12 border-2 border-[#00e676] rounded-full flex items-center justify-center">
                      <span className="text-[#00e676] text-[20px]">🌍</span>
                    </div>
                  </div>
                </div>

                {/* BLOG SECTION */}
                <div className="blog-section">
                  <div className="text-[15px] font-bold mb-4 text-white">Artykuły blogowe</div>
                  <div className="blog-grid-mini">
                    <div className="blog-mini-card">
                      <div className="blog-mini-text flex-1">
                        Czy altana na pojemniki z odpadami może być przyjazna dla środowiska?
                      </div>
                      <div className="blog-mini-img-wrap">
                        <img src="/assets/images/wiaty-stalowe-na-rowery/steptodown.com543925.jpg" alt="blog 1" />
                      </div>
                    </div>
                    <div className="blog-mini-card">
                      <div className="blog-mini-img-wrap">
                        <img src="/assets/images/wiaty-stalowe-na-rowery/Wiata-na-meble-ogrodowe.jpg" alt="blog 2" />
                      </div>
                      <div className="blog-mini-text flex-1">
                        Zasady dotyczące odległości śmietnika od budynku
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </>
          )}

          {activeTab === 'altany-smietnikowe' && (
            <>
              {/* COLUMN 1: MAIN PRODUCT CARD (40%) */}
              <div className="mega-card-product">
                <div className="mega-card-content flex flex-col items-start justify-center">
                  <h2 className="mega-card-title-main">Altany Śmietnikowe</h2>
                  <Link href="/system-osiedle/altany-smietnikowe/" className="mega-btn-black !bg-black !text-white border border-white/10">Strona produktu</Link>
                </div>
                <div className="mega-card-img-wrap">
                  <img src="/assets/images/wiaty-stalowe-na-rowery/steptodown.com543925.jpg" alt="Altany i wiaty śmietnikowe" />
                </div>
              </div>

              {/* COLUMN 2: CENTER LOGO PLACEHOLDER (20%) */}
              <div className="mega-logo-placeholder">
                <div className="placeholder-box">
                  <img src="/assets/piktogramy/Piktogram_4.svg" alt="Piktogram Altana" className="w-48 h-48 opacity-80" />
                </div>
              </div>

              {/* COLUMN 3: PROMOS & BLOG (40%) */}
              <div className="mega-right-col">
                
                <div className="mega-right-top-row">
                  {/* PROMO BANNER */}
                  <div className="promo-banner border-green-accent">
                    <img src="/assets/images/wiaty-stalowe-na-rowery/Wiata-na-rowery-GMS-System.jpg" className="absolute inset-0 w-full h-full object-cover opacity-40" />
                    <div className="promo-content relative z-10">
                      <div className="text-[10px] text-white/80 font-semibold mb-1">Sprawdź również:</div>
                      <div className="text-[18px] text-[#00e676] font-bold leading-tight">Altany z zielonym dachem</div>
                      <p className="text-[10px] text-white/90 mt-2 pr-4 leading-tight">Zielony akcent w betonowym lesie.</p>
                    </div>
                  </div>

                  {/* CONFIGURATOR CARD */}
                  <div className="configurator-card !bg-transparent border border-white/10 relative overflow-hidden flex flex-col items-center justify-center p-4">
                    <div className="w-10 h-10 mb-2">
                       <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                         <path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                       </svg>
                    </div>
                    <div className="text-[14px] font-bold text-white text-center leading-tight">Skonfiguruj swoją altanę</div>
                  </div>
                </div>

                {/* BLOG SECTION */}
                <div className="blog-section">
                  <div className="text-[15px] font-bold mb-4 text-white">Artykuły blogowe</div>
                  <div className="blog-grid-mini">
                    <div className="blog-mini-card">
                      <div className="blog-mini-text flex-1">
                        Zasady dotyczące odległości śmietnika od budynku
                      </div>
                      <div className="blog-mini-img-wrap">
                        <img src="/assets/images/wiaty-stalowe-na-rowery/Wiata-na-meble-ogrodowe.jpg" alt="blog 1" />
                      </div>
                    </div>
                    <div className="blog-mini-card">
                      <div className="blog-mini-img-wrap">
                        <img src="/assets/images/wiaty-stalowe-na-rowery/steptodown.com543925.jpg" alt="blog 2" />
                      </div>
                      <div className="blog-mini-text flex-1">
                        Czy altana na pojemniki z odpadami może być przyjazna dla środowiska?
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </>
          )}

          {activeTab === 'kompaktowe' && (
            <>
              {/* COLUMN 1: MAIN PRODUCT CARD (40%) */}
              <div className="mega-card-product">
                <div className="mega-card-content flex flex-col items-start justify-center">
                  <h2 className="mega-card-title-main">Kompaktowe Osłony</h2>
                  <Link href="/system-osiedle/kompaktowe-oslony-smietnikowe/" className="mega-btn-black !bg-black !text-white border border-white/10">Strona produktu</Link>
                </div>
                <div className="mega-card-img-wrap">
                  <img src="/assets/images/wiaty-stalowe-na-rowery/Wiata-na-rowery-GMS-System.jpg" alt="Kompaktowe osłony śmietnikowe" />
                </div>
              </div>

              {/* COLUMN 2: CENTER LOGO PLACEHOLDER (20%) */}
              <div className="mega-logo-placeholder">
                <div className="placeholder-box">
                  <img src="/assets/piktogramy/Piktogram_4.svg" alt="Piktogram Kompaktowe" className="w-48 h-48 opacity-80" />
                </div>
              </div>

              {/* COLUMN 3: SHOP SECTION (40%) */}
              <div className="mega-right-col">
                <div className="blog-section w-full !bg-[#0f0f0f] border border-white/5 !p-8">
                  <div className="text-[16px] font-bold mb-6 text-white">Skonfiguruj w sklepie</div>
                  <div className="mega-shop-grid !grid-cols-2 !gap-4">
                    {[1, 2, 3, 4].map((num) => (
                      <div key={num} className="shop-card-mini !bg-black border border-white/10 !p-3 !flex-col !items-stretch !gap-3">
                        <div className="shop-card-img-wrap-mini !w-full !h-32">
                          <img src={`/assets/images/wiaty-stalowe-na-rowery/steptodown.com543925.jpg`} alt={`NANO-${num}`} />
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="shop-card-title !text-[13px] text-white">Osłona NANO-{num}</div>
                          <button className="btn-shop-mini !bg-[#1a1a1b] !text-white !text-[10px] !px-3 !py-1 border border-white/10">Konfiguruj</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'drzwi' && (
            <>
              {/* COLUMN 1: MAIN PRODUCT CARD (40%) */}
              <div className="mega-card-product">
                <div className="mega-card-content flex flex-col items-start justify-center">
                  <h2 className="mega-card-title-main">Drzwi Piwniczne</h2>
                  <Link href="/system-osiedle/drzwi-piwniczne/" className="mega-btn-black !bg-black !text-white border border-white/10">Strona produktu</Link>
                </div>
                <div className="mega-card-img-wrap">
                  <img src="/assets/images/wiaty-stalowe-na-rowery/steptodown.com543925.jpg" alt="Drzwi piwniczne" />
                </div>
              </div>

              {/* COLUMN 2: CENTER LOGO PLACEHOLDER (20%) */}
              <div className="mega-logo-placeholder">
                <div className="placeholder-box">
                  <img src="/assets/piktogramy/Piktogram_1.svg" alt="Piktogram Drzwi" className="w-48 h-48 opacity-80" />
                </div>
              </div>

              {/* COLUMN 3: PROMOS & BLOG (40%) */}
              <div className="mega-right-col">
                
                <div className="mega-right-top-row">
                  {/* PROMO 1: Garaże zbiorcze */}
                  <div className="promo-banner !h-[180px]">
                    <img src="/assets/images/wiaty-stalowe-na-rowery/Wiata-na-meble-ogrodowe.jpg" className="absolute inset-0 w-full h-full object-cover opacity-50" />
                    <div className="promo-content relative z-10">
                      <div className="text-[10px] text-white/80 font-semibold mb-1">Sprawdź również:</div>
                      <div className="text-[18px] text-white font-bold leading-tight">Garaże zbiorcze - boksy</div>
                      <p className="text-[10px] text-white/90 mt-2 leading-tight">Niezawodna jakość w Twoim boksie.</p>
                    </div>
                  </div>

                  {/* PROMO 2: Ścianki działowe */}
                  <div className="promo-banner !h-[180px]">
                    <img src="/assets/images/wiaty-stalowe-na-rowery/Wiata-na-rowery-GMS-System.jpg" className="absolute inset-0 w-full h-full object-cover opacity-40" />
                    <div className="promo-content relative z-10">
                      <div className="text-[10px] text-white/80 font-semibold mb-1">Sprawdź również:</div>
                      <div className="text-[16px] text-white font-bold leading-tight">Ścianki działowe i wygrodzenia</div>
                    </div>
                  </div>
                </div>

                {/* FEATURED BLOG POST */}
                <div className="blog-section !p-8 !bg-[#0f0f0f] border border-white/5">
                  <div className="text-[13px] font-bold text-white/60 mb-2 uppercase tracking-wider">Artykuł z bloga</div>
                  <div className="text-[18px] font-bold text-white mb-6 leading-snug">Czy warto zainwestować w drzwi piwniczne i jakie wybrać?</div>
                  <button className="mega-btn-black !bg-black !text-white !px-8 !py-2 border border-white/10 text-[12px]">Czytaj artykuł</button>
                </div>

              </div>
            </>
          )}

          {activeTab === 'garaze-zbiorcze' && (
            <>
              {/* COLUMN 1: MAIN PRODUCT CARD (40%) */}
              <div className="mega-card-product">
                <div className="mega-card-content flex flex-col items-start justify-center">
                  <h2 className="mega-card-title-main">{t(`titles.${activeTab.replace("-", "_")}`)}</h2>
                  <Link href="/system-osiedle/garaze-zbiorcze/" className="mega-btn-black !bg-black !text-white border border-white/10">{tCommon('productPage')}</Link>
                </div>
                <div className="mega-card-img-wrap">
                  <img src="/assets/images/wiaty-stalowe-na-rowery/Wiata-na-meble-ogrodowe.jpg" alt="Garaże zbiorcze" />
                </div>
              </div>

              {/* COLUMN 2: CENTER LOGO PLACEHOLDER (20%) */}
              <div className="mega-logo-placeholder">
                <div className="placeholder-box">
                  <img src="/assets/piktogramy/Piktogram_1.svg" alt="Piktogram Garaże" className="w-48 h-48 opacity-80" />
                </div>
              </div>

              {/* COLUMN 3: PROMOS & BLOG (40%) */}
              <div className="mega-right-col">
                
                <div className="mega-right-top-row">
                  {/* PROMO 1: Drzwi piwniczne */}
                  <div className="promo-banner !h-[180px]">
                    <img src="/assets/images/wiaty-stalowe-na-rowery/steptodown.com543925.jpg" className="absolute inset-0 w-full h-full object-cover opacity-50" />
                    <div className="promo-content relative z-10">
                      <div className="text-[10px] text-white/80 font-semibold mb-1">Sprawdź również:</div>
                      <div className="text-[18px] text-white font-bold leading-tight">Drzwi piwniczne</div>
                      <p className="text-[10px] text-white/90 mt-2 leading-tight">Sztuka nowoczesna z podziemia.</p>
                    </div>
                  </div>

                  {/* PROMO 2: Ścianki działowe */}
                  <div className="promo-banner !h-[180px]">
                    <img src="/assets/images/wiaty-stalowe-na-rowery/Wiata-na-rowery-GMS-System.jpg" className="absolute inset-0 w-full h-full object-cover opacity-40" />
                    <div className="promo-content relative z-10">
                      <div className="text-[10px] text-white/80 font-semibold mb-1">Sprawdź również:</div>
                      <div className="text-[16px] text-white font-bold leading-tight">Ścianki działowe i wygrodzenia</div>
                    </div>
                  </div>
                </div>

                {/* FEATURED BLOG POST */}
                <div className="blog-section !p-8 !bg-[#0f0f0f] border border-white/5">
                  <div className="text-[13px] font-bold text-white/60 mb-2 uppercase tracking-wider">Artykuł z bloga</div>
                  <div className="text-[18px] font-bold text-white mb-6 leading-snug">Jak optymalnie zagospodarować boks garażowy w bloku?</div>
                  <button className="mega-btn-black !bg-black !text-white !px-8 !py-2 border border-white/10 text-[12px]">Czytaj artykuł</button>
                </div>

              </div>
            </>
          )}

          {activeTab === 'scianki' && (
            <>
              {/* COLUMN 1: MAIN PRODUCT CARD (40%) */}
              <div className="mega-card-product">
                <div className="mega-card-content flex flex-col items-start justify-center">
                  <h2 className="mega-card-title-main">{t(`titles.${activeTab.replace("-", "_")}`)}</h2>
                  <Link href="/system-osiedle/scianki-dzialowe/" className="mega-btn-black !bg-black !text-white border border-white/10">{tCommon('productPage')}</Link>
                </div>
                <div className="mega-card-img-wrap">
                  <img src="/assets/images/wiaty-stalowe-na-rowery/Wiata-na-rowery-GMS-System.jpg" alt="Ścianki działowe" />
                </div>
              </div>

              {/* COLUMN 2: CENTER LOGO PLACEHOLDER (20%) */}
              <div className="mega-logo-placeholder">
                <div className="placeholder-box">
                  <img src="/assets/piktogramy/Piktogram_1.svg" alt="Piktogram Ścianki" className="w-48 h-48 opacity-80" />
                </div>
              </div>

              {/* COLUMN 3: PROMOS & BLOG (40%) */}
              <div className="mega-right-col">
                
                <div className="mega-right-top-row">
                  {/* PROMO 1: Drzwi piwniczne */}
                  <div className="promo-banner !h-[180px]">
                    <img src="/assets/images/wiaty-stalowe-na-rowery/steptodown.com543925.jpg" className="absolute inset-0 w-full h-full object-cover opacity-50" />
                    <div className="promo-content relative z-10">
                      <div className="text-[10px] text-white/80 font-semibold mb-1">Sprawdź również:</div>
                      <div className="text-[18px] text-white font-bold leading-tight">Drzwi piwniczne</div>
                      <p className="text-[10px] text-white/90 mt-2 leading-tight">Sztuka nowoczesna z podziemia.</p>
                    </div>
                  </div>

                  {/* PROMO 2: Garaże zbiorcze */}
                  <div className="promo-banner !h-[180px]">
                    <img src="/assets/images/wiaty-stalowe-na-rowery/Wiata-na-meble-ogrodowe.jpg" className="absolute inset-0 w-full h-full object-cover opacity-40" />
                    <div className="promo-content relative z-10">
                      <div className="text-[10px] text-white/80 font-semibold mb-1">Sprawdź również:</div>
                      <div className="text-[16px] text-white font-bold leading-tight">Garaże zbiorcze - boksy</div>
                    </div>
                  </div>
                </div>

                {/* FEATURED BLOG POST */}
                <div className="blog-section !p-8 !bg-[#0f0f0f] border border-white/5">
                  <div className="text-[13px] font-bold text-white/60 mb-2 uppercase tracking-wider">Artykuł z bloga</div>
                  <div className="text-[18px] font-bold text-white mb-6 leading-snug">Zasady planowania wygrodzeń w nowoczesnym budownictwie</div>
                  <button className="mega-btn-black !bg-black !text-white !px-8 !py-2 border border-white/10 text-[12px]">Czytaj artykuł</button>
                </div>

              </div>
            </>
          )}

          {activeTab === 'wygrodzenia' && (
            <>
              {/* COLUMN 1: MAIN PRODUCT CARD (40%) */}
              <div className="mega-card-product">
                <div className="mega-card-content flex flex-col items-start justify-center">
                  <h2 className="mega-card-title-main">{t(`titles.${activeTab.replace("-", "_")}`)}</h2>
                  <Link href="/system-osiedle/wygrodzenia-przemyslowe/" className="mega-btn-black !bg-black !text-white border border-white/10">{tCommon('productPage')}</Link>
                </div>
                <div className="mega-card-img-wrap">
                  <img src="/assets/images/wiaty-stalowe-na-rowery/steptodown.com543925.jpg" alt="Wygrodzenia przemysłowe" />
                </div>
              </div>

              {/* COLUMN 2: CENTER LOGO PLACEHOLDER (20%) */}
              <div className="mega-logo-placeholder">
                <div className="placeholder-box">
                  <img src="/assets/piktogramy/Piktogram_1.svg" alt="Piktogram Wygrodzenia" className="w-48 h-48 opacity-80" />
                </div>
              </div>

              {/* COLUMN 3: PROMOS & BLOG (40%) */}
              <div className="mega-right-col">
                
                <div className="mega-right-top-row">
                  {/* PROMO 1: Drzwi piwniczne */}
                  <div className="promo-banner !h-[180px]">
                    <img src="/assets/images/wiaty-stalowe-na-rowery/Wiata-na-rowery-GMS-System.jpg" className="absolute inset-0 w-full h-full object-cover opacity-50" />
                    <div className="promo-content relative z-10">
                      <div className="text-[10px] text-white/80 font-semibold mb-1">Sprawdź również:</div>
                      <div className="text-[18px] text-white font-bold leading-tight">Drzwi piwniczne</div>
                      <p className="text-[10px] text-white/90 mt-2 leading-tight">Sztuka nowoczesna z podziemia.</p>
                    </div>
                  </div>

                  {/* PROMO 2: Garaże zbiorcze */}
                  <div className="promo-banner !h-[180px]">
                    <img src="/assets/images/wiaty-stalowe-na-rowery/Wiata-na-meble-ogrodowe.jpg" className="absolute inset-0 w-full h-full object-cover opacity-40" />
                    <div className="promo-content relative z-10">
                      <div className="text-[10px] text-white/80 font-semibold mb-1">Sprawdź również:</div>
                      <div className="text-[16px] text-white font-bold leading-tight">Garaże zbiorcze</div>
                    </div>
                  </div>
                </div>

                {/* FEATURED BLOG POST */}
                <div className="blog-section !p-8 !bg-[#0f0f0f] border border-white/5">
                  <div className="text-[13px] font-bold text-white/60 mb-2 uppercase tracking-wider">Artykuł z bloga</div>
                  <div className="text-[18px] font-bold text-white mb-6 leading-snug">Bezpieczeństwo i organizacja przestrzeni w halach magazynowych</div>
                  <button className="mega-btn-black !bg-black !text-white !px-8 !py-2 border border-white/10 text-[12px]">Czytaj artykuł</button>
                </div>

              </div>
            </>
          )}

          {/* FINAL FALLBACK (Only for tabs not implemented yet) */}
          {![
            'garaze-stalowe', 'garaze-superstrong', 'wiata', 'wiaty-stalowe', 'bramy',
            'altany-zielone', 'altany-smietnikowe', 'kompaktowe', 'drzwi', 'garaze-zbiorcze', 'scianki',
            'wygrodzenia'
          ].includes(activeTab) && (
            <div className="w-full flex items-center justify-center py-24 text-gray-500 font-medium">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-gray-100 flex items-center justify-center opacity-50">
                  <span className="text-[20px]">🛠️</span>
                </div>
                <span>Sekcja {tabs.find(t => t.id === activeTab)?.label} jest aktualnie w przygotowaniu.</span>
              </div>
            </div>
          )}

          {activeTab === 'garaze-stalowe' && (
            <>
              {/* COLUMN 1: MAIN PRODUCT CARD (40%) */}
              <div className="mega-card-product">
                <div className="mega-card-content flex flex-col items-start justify-center">
                  <h2 className="mega-card-title-main">{t(`titles.${activeTab.replace("-", "_")}`)}</h2>
                  <Link href="/system-dom/garaze-stalowe/" className="mega-btn-black">{tCommon('productPage')}</Link>
                </div>
                <div className="mega-card-img-wrap">
                  <img src="/assets/images/wiaty-stalowe-na-rowery/Wiata-na-meble-ogrodowe.jpg" alt="Garaż stalowy" />
                </div>
              </div>

              {/* COLUMN 2: CENTER LOGO PLACEHOLDER (20%) */}
              <div className="mega-logo-placeholder">
                <div className="placeholder-box">
                  <img src="/assets/piktogramy/Piktogram_1.svg" alt="Piktogram Garaż" className="w-48 h-48 opacity-80" />
                </div>
              </div>

              {/* COLUMN 3: PROMOS & BLOG (40%) */}
              <div className="mega-right-col">
                
                <div className="mega-right-top-row">
                  {/* PROMO BANNER */}
                  <div className="promo-banner">
                    <div className="promo-content">
                      <div className="text-[10px] text-white/80 font-semibold mb-1">Sprawdź również:</div>
                      <div className="text-[18px] text-[#ffcc33] font-bold leading-tight">Garaże SuperStrong</div>
                      <p className="text-[10px] text-white/90 mt-2 pr-4 leading-tight">Supermocne garaże, do montażu bezpośrednio w gruncie.</p>
                    </div>
                  </div>

                  {/* CONFIGURATOR CARD */}
                  <div className="configurator-card relative overflow-hidden flex items-center justify-center">
                    {/* Faded background icon - centered */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.05] pointer-events-none text-black/20">
                      <svg width="140" height="140" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="4" y1="21" x2="4" y2="14"></line>
                        <line x1="4" y1="10" x2="4" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12" y2="3"></line>
                        <line x1="20" y1="21" x2="20" y2="16"></line>
                        <line x1="20" y1="12" x2="20" y2="3"></line>
                        <line x1="1" y1="14" x2="7" y2="14"></line>
                        <line x1="9" y1="8" x2="15" y2="8"></line>
                        <line x1="17" y1="16" x2="23" y2="16"></line>
                      </svg>
                    </div>
                    <div className="configurator-title relative z-10 text-[20px] font-bold text-center px-4 leading-tight text-black">
                      Skonfiguruj swój garaż
                    </div>
                  </div>
                </div>

                {/* BLOG SECTION */}
                <div className="blog-section">
                  <div className="text-[15px] font-bold mb-4 text-black">Artykuły blogowe</div>
                  <div className="blog-grid-mini">
                    
                    {/* Card 1: Text Left, Image Right */}
                    <div className="blog-mini-card">
                      <div className="blog-mini-text flex-1">
                        6 rzeczy, które warto wiedzieć przed zakupem garażu stalowego
                      </div>
                      <div className="blog-mini-img-wrap">
                        <img src="/assets/images/wiaty-stalowe-na-rowery/steptodown.com543925.jpg" alt="blog 1" />
                      </div>
                    </div>

                    {/* Card 2: Image Left, Text Right */}
                    <div className="blog-mini-card">
                      <div className="blog-mini-img-wrap">
                        <img src="/assets/images/wiaty-stalowe-na-rowery/Reka-z-kotwa-fade-min.jpg" alt="blog 2" />
                      </div>
                      <div className="blog-mini-text flex-1">
                        Jak urządzić garaż: od prostego magazynu do stylowego warsztatu
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </>
          )}

          {activeTab === 'garaze-superstrong' && (
            <>
              {/* COLUMN 1: MAIN PRODUCT CARD (40%) */}
              <div className="mega-card-product">
                <div className="mega-card-content flex flex-col items-start justify-center">
                  <h2 className="mega-card-title-main">{t(`titles.${activeTab.replace("-", "_")}`)}</h2>
                  <Link href="/system-dom/garaze-superstrong/" className="mega-btn-black">{tCommon('productPage')}</Link>
                </div>
                <div className="mega-card-img-wrap">
                  <img src="/assets/images/wiaty-stalowe-na-rowery/steptodown.com543925.jpg" alt="Garaż SuperStrong" />
                </div>
              </div>

              {/* COLUMN 2: CENTER LOGO PLACEHOLDER (20%) */}
              <div className="mega-logo-placeholder">
                <div className="placeholder-box">
                  <img src="/assets/piktogramy/Piktogram_1.svg" alt="Piktogram Garaż" className="w-48 h-48 opacity-80" />
                </div>
              </div>

              {/* COLUMN 3: PROMOS & BLOG (40%) */}
              <div className="mega-right-col">
                
                <div className="mega-right-top-row">
                  {/* PROMO BANNER */}
                  <div className="promo-banner">
                    <img src="/assets/images/wiaty-stalowe-na-rowery/Wiata-na-meble-ogrodowe.jpg" className="absolute inset-0 w-full h-full object-cover opacity-40" />
                    <div className="promo-content relative z-10">
                      <div className="text-[10px] text-white/80 font-semibold mb-1">Sprawdź również:</div>
                      <div className="text-[18px] text-white font-bold leading-tight">Garaże Stalowe</div>
                    </div>
                  </div>

                  {/* YOUTUBE TEST CARD */}
                  <div className="configurator-card relative overflow-hidden flex flex-col items-center justify-center p-4">
                    <div className="text-[14px] font-bold text-black mb-2 text-center leading-tight">Obejrzyj test SuperStronga</div>
                    <div className="flex items-center gap-2">
                       <img src="/assets/images/icons/youtube-icon.svg" alt="YT" className="w-8 h-8" onError={(e) => e.currentTarget.style.display = 'none'} />
                       <span className="text-[18px] font-black text-[#ff0000]">You<span className="bg-[#ff0000] text-white px-1 rounded ml-0.5">Tube</span></span>
                    </div>
                  </div>
                </div>

                {/* BLOG SECTION */}
                <div className="blog-section">
                  <div className="text-[15px] font-bold mb-4 text-black">Artykuły blogowe</div>
                  <div className="blog-grid-mini">
                    <div className="blog-mini-card">
                      <div className="blog-mini-text flex-1">
                        Dlaczego garaż SuperStrong to inwestycja na lata?
                      </div>
                      <div className="blog-mini-img-wrap">
                        <img src="/assets/images/wiaty-stalowe-na-rowery/steptodown.com543925.jpg" alt="blog 1" />
                      </div>
                    </div>
                    <div className="blog-mini-card">
                      <div className="blog-mini-img-wrap">
                        <img src="/assets/images/wiaty-stalowe-na-rowery/Reka-z-kotwa-fade-min.jpg" alt="blog 2" />
                      </div>
                      <div className="blog-mini-text flex-1">
                        Montaż garażu SuperStrong krok po kroku
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </>
          )}

          {activeTab === 'wiata' && (
            <>
              {/* COLUMN 1: MAIN PRODUCT CARD (40%) */}
              <div className="mega-card-product">
                <div className="mega-card-content flex flex-col items-start justify-center">
                  <h2 className="mega-card-title-main">{t(`titles.${activeTab.replace("-", "_")}`)}</h2>
                  <Link href="/system-dom/wiata-na-rowery/" className="mega-btn-black">{tCommon('productPage')}</Link>
                </div>
                <div className="mega-card-img-wrap">
                  <img src="/assets/images/wiaty-stalowe-na-rowery/Wiata-na-rowery-GMS-System.jpg" alt="Wiata na rowery" />
                </div>
              </div>

              {/* COLUMN 2: CENTER LOGO PLACEHOLDER (20%) */}
              <div className="mega-logo-placeholder">
                <div className="placeholder-box">
                  <img src="/assets/piktogramy/Piktogram_3.svg" alt="Piktogram Wiata" className="w-48 h-48 opacity-80" />
                </div>
              </div>

              {/* COLUMN 3: PROMOS & BLOG (40%) */}
              <div className="mega-right-col">
                
                <div className="mega-right-top-row">
                  {/* PROMO BANNER */}
                  <div className="promo-banner">
                    <img src="/assets/images/wiaty-stalowe-na-rowery/steptodown.com543925.jpg" className="absolute inset-0 w-full h-full object-cover opacity-40" />
                    <div className="promo-content relative z-10">
                      <div className="text-[10px] text-white/80 font-semibold mb-1">Sprawdź również:</div>
                      <div className="text-[18px] text-white font-bold leading-tight">Wiaty Stalowe</div>
                      <p className="text-[9px] text-white/90 mt-1 leading-tight">Wiaty ogrodowe, narzędziowe, na drewno czy motocykl.</p>
                    </div>
                  </div>

                  {/* CONFIGURATOR CARD */}
                  <div className="configurator-card relative overflow-hidden flex items-center justify-center">
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.05] pointer-events-none text-black/20">
                      <svg width="140" height="140" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 20v-8m0 0V4m0 8h8m-8 0H4" />
                      </svg>
                    </div>
                    <div className="configurator-title relative z-10 text-[18px] font-bold text-center px-4 leading-tight text-black">
                      Skonfiguruj swoją wiatę
                    </div>
                  </div>
                </div>

                {/* BLOG SECTION */}
                <div className="blog-section">
                  <div className="text-[15px] font-bold mb-4 text-black">Artykuły blogowe</div>
                  <div className="blog-grid-mini">
                    <div className="blog-mini-card">
                      <div className="blog-mini-text flex-1">
                        Stwórz idealny garaż na motocykl: Poradnik krok po kroku
                      </div>
                      <div className="blog-mini-img-wrap">
                        <img src="/assets/images/wiaty-stalowe-na-rowery/Wiata-na-meble-ogrodowe.jpg" alt="blog 1" />
                      </div>
                    </div>
                    <div className="blog-mini-card">
                      <div className="blog-mini-img-wrap">
                        <img src="/assets/images/wiaty-stalowe-na-rowery/steptodown.com543925.jpg" alt="blog 2" />
                      </div>
                      <div className="blog-mini-text flex-1">
                        Jak zabezpieczyć rowery przed kradzieżą i pogodą?
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </>
          )}

          {activeTab === 'wiaty-stalowe' && (
            <>
              {/* COLUMN 1: MAIN PRODUCT CARD (40%) */}
              <div className="mega-card-product">
                <div className="mega-card-content flex flex-col items-start justify-center">
                  <h2 className="mega-card-title-main">{t(`titles.${activeTab.replace("-", "_")}`)}</h2>
                  <Link href="/system-dom/wiaty-stalowe/" className="mega-btn-black">{tCommon('productPage')}</Link>
                </div>
                <div className="mega-card-img-wrap">
                  <img src="/assets/images/wiaty-stalowe-na-rowery/steptodown.com543925.jpg" alt="Wiaty stalowe" />
                </div>
              </div>

              {/* COLUMN 2: CENTER LOGO PLACEHOLDER (20%) */}
              <div className="mega-logo-placeholder">
                <div className="placeholder-box">
                  <img src="/assets/piktogramy/Piktogram_3.svg" alt="Piktogram Wiata" className="w-48 h-48 opacity-80" />
                </div>
              </div>

              {/* COLUMN 3: SHOP SECTION (40%) */}
              <div className="mega-right-col">
                <div className="blog-section w-full !bg-transparent !p-0">
                  <div className="text-[15px] font-bold mb-4 text-black">Skonfiguruj w sklepie</div>
                  <div className="mega-shop-grid">
                    
                    {/* Card 1: Wiata ogrodowa */}
                    <div className="shop-card-mini">
                      <div className="shop-card-img-wrap-mini">
                        <img src="/assets/images/wiaty-stalowe-na-rowery/Wiata-na-meble-ogrodowe.jpg" alt="Wiata ogrodowa" />
                      </div>
                      <div className="shop-card-content">
                        <div className="shop-card-title">Wiata ogrodowa</div>
                        <button className="btn-shop-mini">Konfiguruj</button>
                      </div>
                    </div>

                    {/* Card 2: Wiata na wózki */}
                    <div className="shop-card-mini">
                      <div className="shop-card-img-wrap-mini">
                        <img src="/assets/images/wiaty-stalowe-na-rowery/Reka-z-kotwa-fade-min.jpg" alt="Wiata na wózki" />
                      </div>
                      <div className="shop-card-content">
                        <div className="shop-card-title">Wiata na wózki inwalidzkie</div>
                        <button className="btn-shop-mini">Konfiguruj</button>
                      </div>
                    </div>

                    {/* Card 3: Wiata na jednoślady (Wide) */}
                    <div className="shop-card-wide">
                      <div className="shop-card-img-wrap-mini">
                        <img src="/assets/images/wiaty-stalowe-na-rowery/Wiata-na-rowery-GMS-System.jpg" alt="Wiata na jednoślady" />
                      </div>
                      <div className="shop-card-content">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="shop-card-title !text-[16px]">Wiata na jednoślady</div>
                            <div className="shop-card-subtitle">z możliwością montażu szyny wjazdowej</div>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4 justify-end">
                          <button className="btn-shop-mini !bg-black !text-white">Zobacz film</button>
                          <button className="btn-shop-mini">Konfiguruj</button>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'bramy' && (
            <>
              {/* COLUMN 1: INTRO & BANNER (40%) */}
              <div className="flex flex-col gap-8">
                <div className="mega-card-product !flex-row !items-stretch !p-0 !bg-[#f5f5f7] dark:!bg-white/5 overflow-hidden !rounded-[32px]">
                  <div className="flex-[1.2] flex flex-col justify-center p-10">
                    <h2 className="mega-card-title-main !text-[32px] !whitespace-nowrap mb-6">Bramy garażowe</h2>
                    <div className="flex flex-col gap-3">
                      {['Bramy uchylne garażowe >>', 'Bramy rozwierne >>', 'Bramy rozwierne panelowe >>', 'Bramy segmentowe >>'].map((link, idx) => (
                        <Link key={idx} href="#" className="text-[14px] font-semibold text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors">
                          {link}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1 p-6 flex items-center justify-center">
                    <div className="w-full aspect-square rounded-[24px] overflow-hidden shadow-sm">
                      <img src="/assets/images/wiaty-stalowe-na-rowery/steptodown.com543925.jpg" className="w-full h-full object-cover" alt="Bramy garażowe" />
                    </div>
                  </div>
                </div>

                {/* Bramy segmentowe banner */}
                <div 
                  className="promo-banner flex items-end p-10 group rounded-[40px] overflow-hidden relative"
                  style={{ height: '220px' }}
                >
                   <img src="/assets/images/wiaty-stalowe-na-rowery/Wiata-na-rowery-GMS-System.jpg" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/10 to-transparent" />
                   <div className="relative z-10 w-full">
                     <h3 className="text-white text-[44px] font-black tracking-tighter leading-none mb-0">Bramy segmentowe</h3>
                   </div>
                </div>
              </div>

              {/* COLUMN 2: BRAMY UCHYLNE (30%) */}
              <div className="px-6 border-l border-black/5 dark:border-white/5">
                <div className="mega-section-box">
                  <div className="bramy-column-title">Bramy uchylne garażowe</div>
                  <div className="flex flex-col">
                    {['Compact Panel C', 'Compact Typ Vent', 'Compact Typ A', 'Classic'].map((item, idx) => (
                      <div key={idx} className="bramy-list-card">
                        <div className="bramy-thumb">
                          <img src="/assets/images/wiaty-stalowe-na-rowery/Reka-z-kotwa-fade-min.jpg" alt={item} />
                        </div>
                        <div className="bramy-content">
                          <div className="bramy-label">{item}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* COLUMN 3: ROZWIERNE & PANELOWE (30%) */}
              <div className="flex flex-col gap-10 pl-6 border-l border-black/5 dark:border-white/5">
                <div className="mega-section-box">
                  <div className="bramy-column-title">Bramy rozwierne</div>
                  <div className="flex flex-col">
                    {['Jednoskrzydłowe - blaszane', 'Dwuskrzydłowe - blaszane'].map((item, idx) => (
                      <div key={idx} className="bramy-list-card">
                        <div className="bramy-thumb">
                          <img src="/assets/images/wiaty-stalowe-na-rowery/Wiata-na-meble-ogrodowe.jpg" alt={item} />
                        </div>
                        <div className="bramy-content">
                          <div className="bramy-label">{item}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mega-section-box">
                  <div className="bramy-column-title">Bramy rozwierne panelowe</div>
                  <div className="flex flex-col">
                    {['Jednoskrzydłowe - panelowe', 'Dwuskrzydłowe - panelowe'].map((item, idx) => (
                      <div key={idx} className="bramy-list-card">
                        <div className="bramy-thumb">
                          <img src="/assets/images/wiaty-stalowe-na-rowery/steptodown.com543925.jpg" alt={item} />
                        </div>
                        <div className="bramy-content">
                          <div className="bramy-label">{item}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
          </motion.div>
        </AnimatePresence>
      </>
    )}
  </motion.div>
);
}
