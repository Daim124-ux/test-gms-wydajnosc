'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from '@/i18n/navigation';
import Link from 'next/link';
import { ArrowRight, Warehouse, DoorClosed, Home, Bike, Factory, Trash2, Grip, ChevronLeft, ChevronRight } from 'lucide-react';

const CLOUDFRONT_URL = 'https://d1moyf5ccth9x8.cloudfront.net';

const resolveMediaUrl = (url?: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  if (process.env.NODE_ENV === 'development') return url;
  
  const cleanSrc = url.startsWith('/') ? url.slice(1) : url;
  if (cleanSrc.includes('hero_v2')) {
    return `${CLOUDFRONT_URL}/_optimized/originals/${cleanSrc}`;
  }
  return `${CLOUDFRONT_URL}/_optimized/${cleanSrc}`;
};

const categories = [
  {
    id: 'garaze',
    title: 'Garaże Stalowe',
    description: 'Trwałe i nowoczesne garaże na każdą posesję. Możliwość pełnej personalizacji pod wymiar.',
    icon: Warehouse,
    link: '/garaze-stalowe',
    image: '/assets/images/hero_v2/Gemini_Generated_Image_i0gmgti0gmgti0gm.jpg',
  },
  {
    id: 'bramy',
    title: 'Bramy Garażowe',
    description: 'Bezpieczne bramy uchylne i dwuskrzydłowe, dopasowane do Twojego garażu.',
    icon: DoorClosed,
    link: '/bramy-garazowe',
    image: '/assets/images/hero_v2/Gemini_Generated_Image_xfvdj3xfvdj3xfvd.jpg',
  },
  {
    id: 'altany',
    title: 'Altany śmietnikowe',
    description: 'Estetyczne i funkcjonalne altany, dyskretnie maskujące przestrzeń odpadową.',
    icon: Home,
    link: '/altany-smietnikowe',
    image: '/assets/images/hero_v2/Gemini_Generated_Image_kpnzxlkpnzxlkpnz.jpg',
  },
  {
    id: 'wiaty',
    title: 'Wiaty Stalowe',
    description: 'Solidne zadaszenia chroniące przed warunkami atmosferycznymi.',
    icon: Bike,
    link: '/wiaty-stalowe',
    image: '/assets/images/hero_v2/Gemini_Generated_Image_hlah0bhlah0bhlah.jpg',
  },
  {
    id: 'wygrodzenia',
    title: 'Wygrodzenia Przemysłowe',
    description: 'Niezawodne systemy wygrodzeń idealne dla magazynów i obiektów przemysłowych.',
    icon: Factory,
    link: '/wygrodzenia-przemyslowe',
    image: '/assets/images/hero_v2/Gemini_Generated_Image_dz6mmddz6mmddz6m.jpg',
  },
  {
    id: 'oslony',
    title: 'Osłony Śmietnikowe',
    description: 'Nowoczesne osłony ułatwiające organizację i dbające o estetykę otoczenia.',
    icon: Trash2,
    link: '/oslony-smietnikowe',
    image: '/assets/images/hero_v2/Gemini_Generated_Image_m6asbvm6asbvm6as.jpg',
  },
  {
    id: 'scianki',
    title: 'Ścianki Działowe',
    description: 'Praktyczne rozwiązania do podziału przestrzeni magazynowych i piwnicznych.',
    icon: Grip,
    link: '/scianki-dzialowe',
    image: '/assets/images/hero_v2/Gemini_Generated_Image_45no145no145no14.jpg',
  }
];

export default function HomeCategories() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [transitionState, setTransitionState] = useState<{ url: string, rect: DOMRect } | null>(null);

  useEffect(() => {
    if (isHovered || transitionState) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % categories.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovered, transitionState, currentIndex]);

  const getOffset = (idx: number) => {
    const diff = idx - currentIndex;
    const half = Math.floor(categories.length / 2);
    let normalized = diff % categories.length;
    if (normalized > half) normalized -= categories.length;
    if (normalized < -half) normalized += categories.length;
    return normalized;
  };

  const nextSlide = () => setCurrentIndex((p) => (p + 1) % categories.length);
  const prevSlide = () => setCurrentIndex((p) => (p - 1 + categories.length) % categories.length);

  const handleNavigate = (e: React.MouseEvent<HTMLAnchorElement>, link: string, image: string, index: number) => {
    e.preventDefault();
    if (transitionState) return; // Zapobiegaj wielokrotnym kliknięciom
    
    // Jeśli kliknięto inną ikonę, ustaw ją jako centralną
    if (currentIndex !== index) {
      setCurrentIndex(index);
    }
    
    const element = document.getElementById(`carousel-item-${index}`);
    if (element) {
      setTransitionState({
        url: resolveMediaUrl(image),
        rect: element.getBoundingClientRect()
      });
    } else {
      // Fallback awaryjny - rozszerzenie z małego punktu na srodku ekranu
      setTransitionState({
        url: resolveMediaUrl(image),
        rect: new DOMRect(window.innerWidth / 2, window.innerHeight / 2, 0, 0)
      });
    }

    // Prefetchowanie następnej strony przez routera (wiele aplikacji Next.js wspiera prefetch przez hover na Linku, ale dla pewności wymuszamy)
    // Czekamy 0.5s zeby animacja pokryla ekran
    setTimeout(() => {
      router.push(link);
    }, 500);
  };

  return (
    <section className="relative w-full py-24 md:py-32 bg-[#050505] overflow-hidden flex flex-col items-center">
      {/* FULLSCREEN ANIMATION OVERLAY */}
      <AnimatePresence>
        {transitionState && (
          <motion.div
            initial={{
              position: 'fixed',
              top: transitionState.rect.top,
              left: transitionState.rect.left,
              width: transitionState.rect.width,
              height: transitionState.rect.height,
              borderRadius: '2rem',
              zIndex: 1000,
              opacity: 1
            }}
            animate={{
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              borderRadius: '0px',
            }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none overflow-hidden"
          >
            <img 
              src={transitionState.url} 
              alt="Transition" 
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background ambient light */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[800px] h-[800px] bg-[#ffcc33]/5 blur-[200px] rounded-full pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto flex flex-col items-center">
        {/* Header Section */}
        <div className="flex flex-col items-center justify-center w-full mb-12 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-5 py-2 rounded-full bg-[#ffcc33]/10 border border-[#ffcc33]/20 text-xs font-bold tracking-widest text-[#ffcc33] uppercase mb-6 shadow-[0_0_30px_rgba(255,107,0,0.15)]"
          >
            Kategorie Produktów
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white max-w-4xl"
          >
            Nasza produkcja. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600 font-medium">
              Wybierz odpowiednie rozwiązanie.
            </span>
          </motion.h2>
        </div>

        {/* 3D CAROUSEL */}
        <div 
          className="relative w-full h-[300px] sm:h-[400px] md:h-[550px] flex justify-center items-center mt-8"
          style={{ perspective: 1500 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
        >
          {/* FIXED CENTER GLOW */}
          <div className="absolute w-[80%] max-w-[500px] md:max-w-[750px] aspect-[16/9] -z-10 pointer-events-none">
            <div className="absolute -inset-8 md:-inset-12 bg-[#ffcc33]/15 blur-[80px] rounded-[4rem]" />
          </div>

          {categories.map((cat, i) => {
            const offset = getOffset(i);
            const isCenter = offset === 0;
            const absOffset = Math.abs(offset);
            
            // Render only up to 2 items on each side to keep DOM clean and animations smooth
            if (absOffset > 2) return null;

            return (
              <motion.div
                key={cat.id}
                id={`carousel-item-${i}`}
                className="absolute w-[80%] max-w-[500px] md:max-w-[750px] aspect-[16/9] cursor-pointer"
                animate={{
                  x: `${offset * 50}%`,
                  scale: 1 - absOffset * 0.2,
                  zIndex: 10 - absOffset,
                  opacity: 1 - absOffset * 0.25,
                  rotateY: offset * -18
                }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => {
                  if (!isCenter) setCurrentIndex(i);
                }}
              >
                <div className={`w-full h-full relative rounded-[2rem] overflow-hidden group bg-[#0c0c0c] border transition-all duration-500 ${isCenter ? 'border-[#ffcc33]/30 shadow-[0_0_100px_rgba(255,204,51,0.1)]' : 'border-white/5 shadow-2xl'}`}>
                  {/* We only wrap with Link if it's the center item so users don't accidentally navigate when trying to bring an item to center */}
                  <Link 
                    href={isCenter ? cat.link : '#'} 
                    className={`block w-full h-full relative z-10 ${!isCenter && 'pointer-events-none'}`}
                    onClick={(e) => {
                      if(!isCenter) {
                        e.preventDefault();
                      } else {
                        handleNavigate(e, cat.link, cat.image, i);
                      }
                    }}
                  >
                    
                    {/* Background Image */}
                    <div className="absolute inset-0 w-full h-full overflow-hidden">
                      <img
                        src={resolveMediaUrl(cat.image)}
                        alt={cat.title}
                        className={`w-full h-full object-cover transition-transform duration-700 ease-out ${isCenter ? 'group-hover:scale-105 opacity-80 group-hover:opacity-100' : 'opacity-40'}`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="relative z-30 flex flex-col h-full justify-between p-6 md:p-8">
                      <div className="flex justify-between items-start w-full">
                        <div className={`w-12 h-12 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-500 ${isCenter ? 'bg-white/10 border border-white/20 group-hover:bg-[#ffcc33]/20 group-hover:border-[#ffcc33]/50 group-hover:scale-110' : 'bg-black/20 border border-white/5'}`}>
                          <cat.icon className={`w-5 h-5 transition-colors duration-300 ${isCenter ? 'text-white group-hover:text-[#ffcc33]' : 'text-gray-500'}`} />
                        </div>
                        {isCenter && (
                          <div className="w-10 h-10 rounded-full bg-[#ffcc33] text-black flex items-center justify-center opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out shadow-[0_0_15px_rgba(255,204,51,0.5)]">
                            <ArrowRight className="w-4 h-4 font-bold" />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <h3 className={`text-2xl md:text-3xl font-bold tracking-tight transition-colors duration-300 ${isCenter ? 'text-white group-hover:text-[#ffcc33]' : 'text-gray-500'}`}>
                          {cat.title}
                        </h3>
                        {isCenter && (
                          <motion.p 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-gray-400 text-sm md:text-base font-light group-hover:text-gray-200 transition-colors duration-300"
                          >
                            {cat.description}
                          </motion.p>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Carousel Controls & Pagination */}
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 mt-4 md:mt-6">
          <button 
            onClick={prevSlide} 
            className="hidden md:flex w-14 h-14 rounded-full border border-white/10 bg-white/5 items-center justify-center hover:bg-white/10 hover:border-white/20 hover:scale-105 transition-all text-white"
            aria-label="Poprzednia kategoria"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Ikonki - nawigacja / linki */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3 flex-nowrap w-full md:w-auto px-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-2 md:pb-0">
            {categories.map((cat, i) => (
              <Link
                key={'icon-' + cat.id}
                href={cat.link}
                onMouseEnter={() => setCurrentIndex(i)}
                onClick={(e) => handleNavigate(e, cat.link, cat.image, i)}
                className={`shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 border ${
                  currentIndex === i 
                    ? 'bg-[#ffcc33] text-black border-[#ffcc33] scale-110 shadow-[0_0_15px_rgba(255,204,51,0.4)]' 
                    : 'bg-white/5 text-gray-500 border-white/5 hover:bg-white/10 hover:text-white hover:border-white/20'
                }`}
                title={cat.title}
              >
                <cat.icon className="w-5 h-5 md:w-6 md:h-6" />
              </Link>
            ))}
          </div>

          <button 
            onClick={nextSlide} 
            className="hidden md:flex w-14 h-14 rounded-full border border-white/10 bg-white/5 items-center justify-center hover:bg-white/10 hover:border-white/20 hover:scale-105 transition-all text-white"
            aria-label="Następna kategoria"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

      </div>
    </section>
  );
}
