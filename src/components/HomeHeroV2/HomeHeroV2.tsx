"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Trophy, FileCheck, Globe, Trash2, Fence, Warehouse, DoorClosed, CarFront, Home, ShieldCheck, Bike, Accessibility, Factory, Grip } from 'lucide-react';
import ResponsiveAsset from '@/components/common/ResponsiveAsset';
import LiquidGlassWidget from '@/components/common/LiquidGlassWidget';

const CLOUDFRONT_URL = 'https://d1moyf5ccth9x8.cloudfront.net';

const resolveMediaUrl = (url?: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  if (process.env.NODE_ENV === 'development') return url;
  
  const cleanSrc = url.startsWith('/') ? url.slice(1) : url;
  return `${CLOUDFRONT_URL}/_optimized/originals/${cleanSrc}`;
};

const CATEGORIES = [
  { id: 'wiaty-smietnikowe', title: 'Wiaty śmietnikowe', desc: 'Estetyczne i funkcjonalne osłony na pojemniki.', icon: <Trash2 size={24} strokeWidth={1.5} />, image: '/assets/images/hero_v2/category_wiaty_1789645248018.jpg' },
  { id: 'wygrodzenia-podziemne', title: 'Wygrodzenia podziemne', desc: 'Bezpieczne systemy wydzieleń w garażach podziemnych.', icon: <Fence size={24} strokeWidth={1.5} />, image: '/assets/images/hero_v2/category_fence_1789645257537.jpg' },
  { id: 'scianki-dzialowe', title: 'Ścianki działowe', desc: 'Lekkie i trwałe przegrody stalowe.', icon: <Grip size={24} strokeWidth={1.5} />, image: '/assets/images/hero_v2/category_fence_1789645257537.jpg' },
  { id: 'drzwi-piwniczne', title: 'Drzwi piwniczne', desc: 'Solidne zabezpieczenie pomieszczeń technicznych.', icon: <DoorClosed size={24} strokeWidth={1.5} />, image: '/assets/images/hero_v2/category_garage_1789645268198.jpg' },
  { id: 'garaze-stalowe', title: 'Garaże stalowe', desc: 'Solidne i wytrzymałe konstrukcje garażowe.', icon: <Warehouse size={24} strokeWidth={1.5} />, image: '/assets/images/hero_v2/category_garage_1789645268198.jpg' },
  { id: 'bramy-garazowe', title: 'Bramy garażowe', desc: 'Wygodne i bezpieczne bramy wjazdowe.', icon: <DoorClosed size={24} strokeWidth={1.5} />, image: '/assets/images/hero_v2/category_garage_1789645268198.jpg' },
  { id: 'wiaty-na-rowery', title: 'Wiaty na rowery', desc: 'Nowoczesne zadaszenia dla rowerzystów.', icon: <Bike size={24} strokeWidth={1.5} />, image: '/assets/images/hero_v2/category_wiaty_1789645248018.jpg' },
  { id: 'wiaty-na-jednoslady', title: 'Wiaty na jednoślady', desc: 'Ochrona przed warunkami atmosferycznymi dla motocykli i skuterów.', icon: <Bike size={24} strokeWidth={1.5} />, image: '/assets/images/hero_v2/category_wiaty_1789645248018.jpg' },
  { id: 'wiaty-ogrodowe', title: 'Wiaty ogrodowe', desc: 'Funkcjonalna przestrzeń do przechowywania w ogrodzie.', icon: <Home size={24} strokeWidth={1.5} />, image: '/assets/images/hero_v2/category_wiaty_1789645248018.jpg' },
  { id: 'wiaty-wozki', title: 'Wiaty na wózki inwalidzkie', desc: 'Dostępne i bezpieczne rozwiązania zadaszeń.', icon: <Accessibility size={24} strokeWidth={1.5} />, image: '/assets/images/hero_v2/category_wiaty_1789645248018.jpg' },
  { id: 'oslony-smietnikowe', title: 'Osłony śmietnikowe', desc: 'Maskowanie pojemników i kontenerów na odpady.', icon: <Trash2 size={24} strokeWidth={1.5} />, image: '/assets/images/hero_v2/category_wiaty_1789645248018.jpg' },
  { id: 'wygrodzenia-przemyslowe', title: 'Wygrodzenia przemysłowe', desc: 'Systemy bezpieczeństwa dla hal i magazynów.', icon: <Factory size={24} strokeWidth={1.5} />, image: '/assets/images/hero_v2/category_fence_1789645257537.jpg' },
];

export default function HomeHeroV2() {
  const sliderRef = React.useRef<HTMLDivElement>(null);
  const [isDown, setIsDown] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [scrollLeft, setScrollLeft] = React.useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    setIsDown(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };
  const handleMouseLeave = () => setIsDown(false);
  const handleMouseUp = () => setIsDown(false);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Scroll speed
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden font-sans bg-[#0a0f12]">
      <LiquidGlassWidget />
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={resolveMediaUrl('/assets/images/hero_v2/hero_main_bg_1789645236902.jpg')}
          alt="GMS System Background"
          className="w-full h-full object-cover opacity-50 mix-blend-overlay pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/80 via-transparent to-black/80 pointer-events-none"></div>
      </div>

      <div className="relative z-10 w-full px-[calc(14px+clamp(20px,2.4vw,44px))] flex flex-col flex-1 pt-24 lg:pt-32 pb-4 pointer-events-none">
        <div className="max-w-4xl text-white pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4 mb-4"
          >
            <div className="w-12 h-[2px] bg-[#ffcc33]"></div>
            <span className="text-[11px] md:text-xs font-semibold tracking-[0.2em] uppercase text-gray-300">
              SOLIDNE KONSTRUKCJE. NA LATA.
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] mb-4 font-bold tracking-tight drop-shadow-xl"
          >
            Wiaty śmietnikowe, <br />
            ogrodzenia, garaże, <br />
            <span className="text-[#ffcc33]">bramy garażowe</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm md:text-base lg:text-lg text-gray-300 mb-8 max-w-2xl leading-relaxed drop-shadow-md font-light"
          >
            Nowoczesne i trwałe rozwiązania ze stali, 
            które podnoszą komfort i bezpieczeństwo Twojej posesji.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-start gap-6 lg:gap-10 mb-8"
          >
            <div className="flex items-center gap-3">
              <Trophy className="w-7 h-7 text-white" strokeWidth={1.5} />
              <div>
                <p className="font-bold text-xs sm:text-sm">Lider <br className="hidden sm:block"/> w branży</p>
                <p className="text-[9px] sm:text-[10px] text-gray-400 mt-0.5 uppercase tracking-wider">Doświadczenie</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FileCheck className="w-7 h-7 text-white" strokeWidth={1.5} />
              <div>
                <p className="font-bold text-xs sm:text-sm">Certyfikaty CE</p>
                <p className="text-[9px] sm:text-[10px] text-gray-400 mt-0.5 uppercase tracking-wider">Normy europejskie</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="w-7 h-7 text-white" strokeWidth={1.5} />
              <div>
                <p className="font-bold text-xs sm:text-sm">Dystrybucja <br className="hidden sm:block"/> w UE</p>
                <p className="text-[9px] sm:text-[10px] text-gray-400 mt-0.5 uppercase tracking-wider">Szybkie dostawy</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/produkty"
              className="inline-flex justify-center items-center gap-2 px-8 py-3.5 bg-[#ffcc33] hover:bg-[#e6b82e] text-black text-sm font-bold tracking-wide rounded-full transition-all text-center shadow-[0_0_20px_rgba(255,204,51,0.3)]"
            >
              Zobacz produkty <span className="text-lg leading-none">&rarr;</span>
            </Link>
            <Link
              href="/realizacje"
              className="inline-flex justify-center items-center gap-2 px-8 py-3.5 bg-transparent border border-gray-400 text-white hover:border-white hover:bg-white/10 text-sm font-bold tracking-wide rounded-full transition-all text-center"
            >
              Nasze realizacje <span className="text-lg leading-none">&rarr;</span>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Cards Slider */}
      <div className="relative z-10 w-full pb-4">
        <div 
          ref={sliderRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          style={{ 
            paddingLeft: 'calc(14px + clamp(20px, 2.4vw, 44px))',
            paddingRight: 'calc(14px + clamp(20px, 2.4vw, 44px))'
          }}
          className={`flex gap-4 overflow-x-auto py-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${isDown ? 'cursor-grabbing select-none' : 'cursor-grab snap-x snap-mandatory'}`}
        >
          {CATEGORIES.map((cat, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
              key={cat.id}
              className={`snap-start shrink-0 w-[240px] md:w-[280px] bg-[#111] border border-gray-800 rounded-xl overflow-hidden group hover:border-gray-600 transition-colors ${isDown ? 'pointer-events-none' : ''}`}
            >
              <div className="h-32 w-full overflow-hidden relative">
                <img src={resolveMediaUrl(cat.image)} alt={cat.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent pointer-events-none"></div>
              </div>
              <div className="p-4 relative pointer-events-none">
                <div className="absolute -top-5 left-4 w-10 h-10 bg-[#222] border border-gray-700 rounded-lg flex items-center justify-center text-white shadow-lg">
                  <div className="scale-75">{cat.icon}</div>
                </div>
                <div className="flex items-center gap-3 mb-1 mt-3">
                  <h3 className="font-bold text-white text-base">{cat.title}</h3>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed mb-2">{cat.desc}</p>
                <div className="flex justify-end text-gray-500 group-hover:text-white transition-colors text-sm">
                  &rarr;
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Footer Bar of Hero */}
      <div className="relative z-10 w-full border-t border-gray-800 bg-black/60 backdrop-blur-md px-[calc(14px+clamp(20px,2.4vw,44px))] py-3">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 max-w-[1920px] mx-auto">
          <div className="flex items-center gap-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/Flag_of_Europe.svg" alt="EU Flag" className="w-12 h-8 rounded-sm object-cover shadow-sm" />
            <div>
              <p className="text-white font-semibold text-sm">Dostarczamy na terenie całej Unii Europejskiej</p>
              <p className="text-gray-400 text-xs mt-0.5">Szybka i bezpieczna logistyka | Profesjonalne doradztwo</p>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8 border-l-0 md:border-l border-gray-700 md:pl-8">
            <div className="hidden lg:block">
              <p className="text-white font-semibold text-sm">Lider w produkcji konstrukcji stalowych</p>
              <p className="text-gray-400 text-[10px] uppercase tracking-wider mt-0.5">Jakość | Doświadczenie | Zaufanie klientów</p>
            </div>
            
            <div className="flex items-center gap-6 text-gray-300">
               <span className="text-3xl font-bold font-serif">CE</span>
               <div className="flex items-center gap-2">
                 <ShieldCheck className="w-6 h-6" strokeWidth={1.5} />
                 <span className="text-[10px] uppercase font-bold leading-[1.1] text-gray-400 tracking-wider">ISO<br/>9001</span>
               </div>
               <div className="flex items-center gap-2">
                 <Globe className="w-6 h-6" strokeWidth={1.5} />
                 <span className="text-[10px] uppercase font-bold leading-[1.1] text-gray-400 tracking-wider">ECO</span>
               </div>
               <div className="flex items-center gap-2">
                 <ShieldCheck className="w-6 h-6" strokeWidth={1.5} />
                 <span className="text-[10px] uppercase font-bold leading-[1.1] text-gray-400 tracking-wider">SOLIDNA<br/>KONSTRUKCJA</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
