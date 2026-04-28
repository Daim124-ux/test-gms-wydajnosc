'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { X, BoxIcon, Move3d, RotateCcw } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRef } from 'react';
import ResponsiveAsset from '@/components/common/ResponsiveAsset';
import { useTranslations } from 'next-intl';

const VergeViewer = dynamic(() => import('./VergeViewer'), {
  ssr: false,
});

export default function ThreeDShowcase() {
  const t = useTranslations('threeDShowcase');

  const tabs = [
    { 
      id: 'ha-tab-title-9972', 
      label: t('tabs.pianoHinge.label'), 
      description: t('tabs.pianoHinge.description') 
    },
    { 
      id: 'ha-tab-title-9973', 
      label: t('tabs.reinforcedCorners.label'), 
      description: t('tabs.reinforcedCorners.description') 
    },
    { 
      id: 'ha-tab-title-9974', 
      label: t('tabs.locking.label'), 
      description: t('tabs.locking.description') 
    },
    { 
      id: 'ha-tab-title-9975', 
      label: t('tabs.stopPoints.label'), 
      description: t('tabs.stopPoints.description') 
    },
    { 
      id: 'ha-tab-title-9976', 
      label: t('tabs.thresholdHandle.label'), 
      description: t('tabs.thresholdHandle.description') 
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [isClosing, setIsClosing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
 
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "600px" });

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isInView && !shouldLoad) {
      console.log('[ThreeDShowcase] Preloading 3D model...');
      setShouldLoad(true);
    }
  }, [isInView, shouldLoad]);

  const handleOpen = () => {
    setIsModalOpen(true);
    setIsClosing(false);
    // Wyzwalamy animację "Front" po stronie Verge3D w momencie otwarcia
    (window as any).vergeViewer?.sendCommandToPuzzles('przycisk_off_canvas');
  };

  const handleVergeLoad = () => {
    console.log('[ThreeDShowcase] Verge ready');
    // Nie wyzwalamy tutaj animacji, żeby nie startowała w tle podczas preloadu
  };

  const handleClose = () => {
    setIsClosing(true);
    // Wyzwalamy animację reverse w Verge3D
    (window as any).vergeViewer?.sendCommandToPuzzles('off_canvas_close');
    
    // Czekamy na koniec animacji Verge3D i fade-outu przed zamknięciem modala Reactowego
    setTimeout(() => {
      setIsModalOpen(false);
      setIsClosing(false);
    }, 1000); // 1 sekunda zgodnie z prośbą
  };

  const handleTabClick = (tab: typeof tabs[0]) => {
    setActiveTab(tab);
    (window as any).vergeViewer?.sendCommandToPuzzles(tab.id);
    
    // Notify the AI assistant of the state change
    const event = new CustomEvent('gms:3d-update', { 
      detail: { 
        activeTab: tab.label,
        description: tab.description,
        timestamp: Date.now()
      } 
    });
    window.dispatchEvent(event);
    
    // Fallback for direct state access (Configurator-Ready architecture)
    if (!(window as any).__GMS_CONFIG__) (window as any).__GMS_CONFIG__ = {};
    (window as any).__GMS_CONFIG__.current3DView = tab.label;
  };

  const handleReset = () => {
    setActiveTab(tabs[0]);
    (window as any).vergeViewer?.sendCommandToPuzzles('ha-tab-title-9971');
    
    const event = new CustomEvent('gms:3d-update', { 
      detail: { activeTab: 'Reset', timestamp: Date.now() } 
    });
    window.dispatchEvent(event);
  };

  const modalContent = (
    <div 
      className={`fixed inset-0 z-[2000] flex items-center justify-center bg-black overflow-hidden transition-all duration-1000 ${
        isModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* CLOSE BUTTON */}
      <button
        onClick={handleClose}
        className="absolute top-8 right-8 z-[2010] p-3 bg-white/10 hover:bg-white/20 backdrop-blur-2xl rounded-full text-[#3b82f6] border border-white/10 transition-all duration-300 active:scale-90 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
        title={t('close')}
      >
        <X size={18} />
      </button>

      {/* AR BUTTON (MOBILE ONLY) */}
      <div className="absolute top-24 right-8 z-[2010] md:hidden">
        {typeof window !== 'undefined' && (
          <a
            href={`intent://arvr.google.com/scene-viewer/1.0?file=${window.location.origin}/assets/makieta_3d/wiata_makieta.glb&mode=ar_only#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url=https://developers.google.com/ar;end;`}
            className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-full font-bold text-xs shadow-lg active:scale-95 transition-transform"
          >
            <BoxIcon size={16} />
            {t('arButton')}
          </a>
        )}
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="relative w-full h-full flex flex-col">
        
        {/* 3D VIEWPORT */}
        <div className="flex-1 relative">
           <VergeViewer 
             src="/apps/verge-model/index.html" 
             className="w-full h-full"
             onLoad={handleVergeLoad}
             shouldLoad={shouldLoad}
           />
        </div>

        {/* BOTTOM NAVIGATION BAR (APPLE STYLE) */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-full bg-black/80 backdrop-blur-3xl border-t border-white/5 pt-6 pb-10 px-6"
            >
              <div className="max-w-[1400px] mx-auto">
                {/* TABS HEADER */}
                <div className="flex items-center gap-6 mb-4">
                  {/* RESET BUTTON */}
                  <button 
                    onClick={handleReset}
                    className="p-2 text-white/30 hover:text-white transition-colors flex-shrink-0"
                    title={t('resetTooltip')}
                  >
                    <RotateCcw size={18} />
                  </button>

                  {/* TABS - NO SCROLL, JUST WRAP (now wider) */}
                  <div className="flex flex-wrap items-baseline gap-x-4 lg:gap-x-12 gap-y-3">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => handleTabClick(tab)}
                        className={`relative text-[10px] md:text-xs lg:text-sm font-medium transition-all duration-300 whitespace-nowrap pb-2 uppercase tracking-wider ${
                          activeTab.id === tab.id ? 'text-blue-500' : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        {tab.label}
                        {activeTab.id === tab.id && (
                          <motion.div 
                            layoutId="activeTab"
                            className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* DIVIDER */}
                <div className="w-full h-px bg-white/5 mb-6" />

                {/* DESCRIPTION AREA */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-3xl"
                  >
                    <p className="text-zinc-400 text-xs md:text-sm leading-relaxed font-light">
                      {activeTab.description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <section ref={sectionRef} className="relative w-full min-h-[80vh] bg-black py-24 flex flex-col items-center justify-center overflow-hidden">
      {/* BACKGROUND GLOW */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* TITLE */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative z-10 text-center mb-16 px-4"
      >
        <h2 className="text-3xl md:text-5xl font-semibold text-[#86868b] tracking-tight text-glow-blue-vibrant/20">
          {t('title')}
        </h2>
      </motion.div>

      {/* MAIN RENDER IMAGE */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
        className="relative z-10 w-full max-w-4xl px-4 flex justify-center aspect-[1024/600] min-h-[300px] md:min-h-[500px]"
      >
        <ResponsiveAsset
          src="/assets/images/wiaty-stalowe-na-rowery/Kolor_wiaty_png-min.png"
          alt={t('modelAlt')}
          className="object-contain drop-shadow-[0_0_50px_rgba(59,130,246,0.2)]"
        />
      </motion.div>

      {/* ACTION BUTTON */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
        className="relative z-10 mt-12"
      >
        <button
          onClick={handleOpen}
          className="group relative flex items-center gap-3 px-10 py-4 bg-transparent border-2 border-[#1660b1]/60 hover:border-[#1660b1] rounded-full text-blue-400 font-medium transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden"
        >
          <div className="absolute inset-0 bg-[#1660b1]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="text-xl">+</span>
          <span className="tracking-wide">{t('button')}</span>
        </button>
      </motion.div>

      {/* FULLSCREEN CONFIGURATOR MODAL (W PORTALU) */}
      {mounted && createPortal(modalContent, document.body)}

      {/* HIDDEN TRIGGERS FOR VERGE3D (PARENT DOC LISTENERS) */}
      <div style={{ display: 'none' }} aria-hidden="true">
        <div id="przycisk_off_canvas" />
        <div id="off_canvas_close" />
        <div id="ha-tab-title-9971" />
        {tabs.map(tab => (
          <div key={tab.id} id={tab.id} />
        ))}
      </div>
    </section>
  );
}
