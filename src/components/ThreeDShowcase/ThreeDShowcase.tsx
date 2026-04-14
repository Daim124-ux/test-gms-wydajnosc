'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BoxIcon, Move3d, RotateCcw } from 'lucide-react';
import dynamic from 'next/dynamic';

const VergeViewer = dynamic(() => import('./VergeViewer'), {
  ssr: false,
});

const tabs = [
  { 
    id: 'ha-tab-title-9972', 
    label: 'Zawias fortepianowy', 
    description: 'Zamocowany na klapie za pomocą niewielkich, gęsto rozmieszczonych wkrętów, element ten gwarantuje cichą i niezawodną pracę oraz długowieczność klapy. Dzięki starannemu rozmieszczeniu wkrętów, klapa działa płynnie i bezszelestnie, zapewniając jednocześnie trwałość i stabilność przez wiele lat użytkowania.' 
  },
  { 
    id: 'ha-tab-title-9973', 
    label: 'Wzmocnione naroża', 
    description: 'Dodatkowe wzmocnienia w narożnikach konstrukcji zapewniają wyjątkową sztywność i odporność na odkształcenia. Jest to kluczowy element przy intensywnym użytkowaniu wiaty, zapobiegający "pracowaniu" materiału i utrzymujący geometrię przez dekady.' 
  },
  { 
    id: 'ha-tab-title-9974', 
    label: 'Zamykanie na klucz', 
    description: 'Zastosowaliśmy zamek bębenkowy z wielopunktowym ryglowaniem, który zapewnia najwyższy stopień bezpieczeństwa Twojego roweru. System ten jest odporny na warunki atmosferyczne i próby sforsowania, dając Ci pełny spokój ducha.' 
  },
  { 
    id: 'ha-tab-title-9975', 
    label: 'Innowacyjny system z punktami STOP', 
    description: 'Specjalne odbojniki i hydrauliczny system hamowania klapy zapobiegają gwałtownym uderzeniom przy zamykaniu. Punkty STOP pozwalają na bezpieczne operowanie klapą bez ryzyka przytrzaśnięcia palców czy uszkodzenia obudowy.' 
  },
  { 
    id: 'ha-tab-title-9976', 
    label: 'Próg z materiałowym uchwytem', 
    description: 'Ergonomiczny próg wyposażony w materiałowy uchwyt ułatwia wprowadzanie roweru do wnętrza wiaty. Uchwyt zapewnia pewny chwyt nawet w rękawiczkach, a konstrukcja progu niweluje przeszkodę dla kół roweru.' 
  },
];

export default function ThreeDShowcase() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [isClosing, setIsClosing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleOpen = () => {
    setIsModalOpen(true);
    setIsClosing(false);
  };

  const handleVergeLoad = () => {
    console.log('[ThreeDShowcase] Verge ready, triggering open animation');
    // Wyzwalamy animację "Front" po stronie Verge3D
    (window as any).vergeViewer?.sendCommandToPuzzles('przycisk_off_canvas');
  };

  const handleClose = () => {
    setIsClosing(true);
    // Wyzwalamy animację reverse w Verge3D
    (window as any).vergeViewer?.sendCommandToPuzzles('off_canvas_close');
    
    // Czekamy na koniec animacji Verge3D przed zamknięciem modala Reactowego
    setTimeout(() => {
      setIsModalOpen(false);
      setIsClosing(false);
    }, 1200);
  };

  const handleTabClick = (tab: typeof tabs[0]) => {
    setActiveTab(tab);
    (window as any).vergeViewer?.sendCommandToPuzzles(tab.id);
  };

  const handleReset = () => {
    setActiveTab(tabs[0]);
    (window as any).vergeViewer?.sendCommandToPuzzles('ha-tab-title-9971');
  };

  const modalContent = (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[500] flex items-center justify-center bg-black overflow-hidden"
        >
          {/* CLOSE BUTTON */}
          <button
            onClick={handleClose}
            className="absolute top-8 right-8 z-[510] p-4 bg-white/5 hover:bg-white/10 backdrop-blur-xl rounded-full text-white/60 hover:text-white border border-white/10 transition-all duration-300 active:scale-90"
          >
            <X size={24} />
          </button>

          {/* MAIN CONTENT AREA */}
          <div className="relative w-full h-full flex flex-col">
            
            {/* 3D VIEWPORT */}
            <div className="flex-1 relative">
               <VergeViewer 
                 src="/apps/verge-model/index.html" 
                 className="w-full h-full"
                 onLoad={handleVergeLoad}
               />
            </div>

            {/* BOTTOM NAVIGATION BAR (APPLE STYLE) */}
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
                    title="Resetuj widok"
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
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <section className="relative w-full min-h-[80vh] bg-black py-24 flex flex-col items-center justify-center overflow-hidden">
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
          Zobacz parę wyróżników w 3D
        </h2>
      </motion.div>

      {/* MAIN RENDER IMAGE */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
        className="relative z-10 w-full max-w-4xl px-4 flex justify-center"
      >
        <Image
          src="/assets/images/wiaty-stalowe-na-rowery/Kolor_wiaty_png-min.png"
          alt="Wiata w 3D"
          width={1000}
          height={600}
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
          <span className="tracking-wide">Zobacz z bliska</span>
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

