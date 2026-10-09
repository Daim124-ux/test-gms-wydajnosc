"use client";

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useTransform, MotionValue, useMotionValue, animate } from 'framer-motion';
import { Trash2, Fence, Warehouse, DoorClosed, Home, Bike, Accessibility, Factory, Grip } from 'lucide-react';
import ResponsiveAsset from '@/components/common/ResponsiveAsset';

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

const CATEGORIES = [
  { id: 'garaze', label: 'garaże stalowe', link: '/garaze-stalowe', image: '/assets/images/hero_v2/Gemini_Generated_Image_i0gmgti0gmgti0gm.jpg', video: '/assets/videos/garaze-stalowe/Cinematic_subtle_camera_motion_2.mp4', loop: false, callout: 'GARAŻE STALOWE', icon: <Warehouse className="w-3.5 h-3.5 text-white" strokeWidth={1.5} /> },
  { id: 'bramy-garazowe', label: 'bramy garażowe', link: '/bramy-garazowe', image: '/assets/images/hero_v2/Gemini_Generated_Image_xfvdj3xfvdj3xfvd.jpg', video: '/assets/videos/bramy-garazowe/Subtle_slow_camera_pan_across-ezgif.com-mute-video.mp4', loop: false, callout: 'BRAMY GARAŻOWE', icon: <DoorClosed className="w-3.5 h-3.5 text-white" strokeWidth={1.5} /> },
  { id: 'altany', label: 'altany śmietnikowe', link: '/altany-smietnikowe', image: '/assets/images/hero_v2/Gemini_Generated_Image_kpnzxlkpnzxlkpnz.jpg', video: '/assets/videos/altany-smietnikowe/Prompt_EN___Slow_and_smooth-ezgif.com-mute-video.mp4', loop: false, callout: 'ALTANY ŚMIETNIKOWE', icon: <Home className="w-3.5 h-3.5 text-white" strokeWidth={1.5} /> },
  { id: 'wiaty', label: 'wiaty stalowe', link: '/wiaty-stalowe', image: '/assets/images/hero_v2/Gemini_Generated_Image_hlah0bhlah0bhlah.jpg', video: null, loop: false, callout: 'WIATY STALOWE', icon: <Bike className="w-3.5 h-3.5 text-white" strokeWidth={1.5} /> },
  { id: 'wygrodzenia-przemyslowe', label: 'wygrodzenia przemysłowe', link: '/wygrodzenia-przemyslowe', image: '/assets/images/hero_v2/Gemini_Generated_Image_dz6mmddz6mmddz6m.jpg', video: null, loop: false, callout: 'WYGRODZENIA PRZEMYSŁOWE', icon: <Factory className="w-3.5 h-3.5 text-white" strokeWidth={1.5} /> },
  { id: 'oslony-smietnikowe', label: 'osłony śmietnikowe', link: '/oslony-smietnikowe', image: '/assets/images/hero_v2/Gemini_Generated_Image_m6asbvm6asbvm6as.jpg', video: null, loop: false, callout: 'OSŁONY ŚMIETNIKOWE', icon: <Trash2 className="w-3.5 h-3.5 text-white" strokeWidth={1.5} /> },
  { id: 'scianki', label: 'ścianki działowe', link: '/scianki-dzialowe', image: '/assets/images/hero_v2/Gemini_Generated_Image_45no145no145no14.jpg', video: null, loop: false, callout: 'ŚCIANKI DZIAŁOWE', icon: <Grip className="w-3.5 h-3.5 text-white" strokeWidth={1.5} /> },
  { id: 'zielony-dach', label: 'altany z zielonym dachem', link: '/altany-smietnikowe', image: '/assets/images/hero_v2/Gemini_Generated_Image_t8n4tgt8n4tgt8n4.jpg', video: '/assets/videos/altany-zielony-dach/Slow_smooth_camera_pan_aroun.mp4', loop: false, callout: 'GARAŻ Z ZIELONYM DACHEM', icon: <Warehouse className="w-3.5 h-3.5 text-white" strokeWidth={1.5} /> },
  { id: 'drzwi-piwniczne', label: 'drzwi piwniczne', link: '/drzwi-piwniczne', image: '/assets/images/hero_v2/Drzwi_piwniczne_baner-2.jpg', video: null, loop: false, callout: 'DRZWI PIWNICZNE', icon: <DoorClosed className="w-3.5 h-3.5 text-white" strokeWidth={1.5} /> },
  { id: 'bramy-segmentowe', label: 'bramy segmentowe', link: '/bramy-garazowe', image: '/assets/images/hero_v2/Gemini_Generated_Image_pnn9j1pnn9j1pnn9.jpg', video: null, loop: false, callout: 'BRAMY SEGMENTOWE', icon: <DoorClosed className="w-3.5 h-3.5 text-white" strokeWidth={1.5} /> },
  { id: 'garaze-superstrong', label: 'garaże superstrong', link: '/garaze-stalowe', image: '/assets/images/hero_v2/Gemini_Generated_Image_yr27ufyr27ufyr27.jpg', video: null, loop: false, callout: 'GARAŻE SUPERSTRONG', icon: <Warehouse className="w-3.5 h-3.5 text-white" strokeWidth={1.5} /> }
];

const LEFT_LABELS = [
  { id: 'garaze', label: 'garaże' },
  { id: 'altany', label: 'altany' },
  { id: 'wiaty', label: 'wiaty' },
  { id: 'scianki', label: 'ścianki działowe' },
  { id: 'zielony-dach', label: 'altany z zielonym dachem' },
  { id: 'drzwi-piwniczne', label: 'drzwi piwniczne' },
  { id: 'bramy-segmentowe', label: 'bramy segmentowe' },
  { id: 'garaze-superstrong', label: 'garaże superstrong' }
];

const SLIDER_IDS = ['garaze', 'bramy-garazowe', 'altany', 'wiaty', 'wygrodzenia-przemyslowe', 'oslony-smietnikowe', 'drzwi-piwniczne', 'bramy-segmentowe', 'garaze-superstrong'];
const SLIDER_CATEGORIES = CATEGORIES.filter(c => SLIDER_IDS.includes(c.id));

const START_INDEX = 10 * CATEGORIES.length;

const SamsungTabCard = ({ cat, idx, globalAngle, isActive, progress }: {
  cat: typeof CATEGORIES[0];
  idx: number;
  globalAngle: MotionValue<number>;
  isActive: boolean;
  progress: MotionValue<number>;
}) => {

  // Wheel parameters
  const angleSpacing = 20;
  const baseAngle = (idx - START_INDEX) * angleSpacing;
  const R = 450; // Radius of the wheel

  // Current angle of this specific card (no modulo needed, we have 160 distinct items)
  const currentAngle = useTransform(globalAngle, (g) => baseAngle - g);

  const cardRotate = useTransform(currentAngle, (a) => a);

  const x = useTransform(currentAngle, (a) => {
    const rad = a * (Math.PI / 180);
    return Math.round((R * Math.cos(rad) - R) * 1000) / 1000; // Center is at x=0
  });

  const y = useTransform(currentAngle, (a) => {
    const rad = a * (Math.PI / 180);
    return Math.round((R * Math.sin(rad)) * 1000) / 1000;
  });

  const scale = useTransform(currentAngle, [-70, -40, -20, 0, 20, 40, 70], [0.5, 0.7, 0.9, 1, 0.9, 0.7, 0.5]);
  const opacity = useTransform(currentAngle, [-70, -40, -20, 0, 20, 40, 70], [0, 0.2, 0.6, 1, 0.6, 0.2, 0]);
  const zIndex = useTransform(currentAngle, [-70, -20, 0, 20, 70], [0, 10, 50, 10, 0]);

  const borderProgress = useTransform(progress, [0, 1], [1000, 0]);

  const router = useRouter();

  return (
    <motion.div
      suppressHydrationWarning
      style={{
        rotate: cardRotate,
        x,
        y,
        scale,
        opacity,
        zIndex
      }}
      className={`relative overflow-hidden flex flex-col justify-between origin-center rounded-[1.5rem] [transition-property:background-color,border-color,box-shadow,backdrop-filter] duration-300 w-[240px] sm:w-[260px] h-[150px] shadow-2xl cursor-pointer ${isActive
        ? 'bg-black/40 backdrop-blur-xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)]'
        : 'bg-black/10 backdrop-blur-md border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.3)]'
        }`}
    >
      {/* The Image (animates between thumbnail and full background) */}
      <div
        className={`absolute z-0 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${isActive
          ? 'bottom-0 right-0 w-full h-full rounded-none border-0'
          : 'bottom-4 right-4 w-16 h-12 rounded-lg border border-white/20 shadow-lg'
          }`}
      >
        <ResponsiveAsset
          type="image"
          src={cat.image}
          alt={cat.label}
          className="w-full h-full object-cover"
        />
        {/* Dark overlay when active to ensure text readability */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'
            }`}
        />
      </div>

      {/* Content wrapper (above image) */}
      <div className="relative z-10 flex flex-col justify-between h-full p-4 pointer-events-none">
        {/* Top section: Icon */}
        <div
          className={`w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center transition-opacity duration-300 ${isActive ? 'opacity-0' : 'opacity-100'
            }`}
        >
          {cat.icon}
        </div>

        {/* Bottom section: Title */}
        <div className="flex items-end justify-between w-full">
          <span className={`text-white font-extrabold uppercase tracking-wide drop-shadow-md leading-tight transition-all duration-500 ${isActive ? 'text-lg' : 'text-sm'
            }`}>
            {cat.label}
          </span>
        </div>
      </div>

      {/* SVG Animated Border / Progress Bar */}
      {isActive && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none rounded-[1.5rem]"
          style={{ overflow: 'visible' }}
        >
          <defs>
            <filter id={`glow-${idx}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <motion.rect
            x="0" y="0"
            width="100%" height="100%"
            rx="24"
            fill="none"
            stroke="#ffcc33"
            strokeWidth="4"
            strokeDasharray="1000" // Wystarczająco duży, żeby pokryć obwód (np. 2*260 + 2*150 = 820)
            filter={`url(#glow-${idx})`}
            style={{
              strokeDashoffset: borderProgress
            }}
          />
        </svg>
      )}
    </motion.div>
  );
};

export default function HomeHero() {
  const [activeId, setActiveId] = useState<string>('garaze');

  const sliderRef = useRef<HTMLDivElement>(null);
  const mobileSliderRef = useRef<HTMLDivElement>(null);

  // Robust pseudo-infinite scroll parameters
  const PX_PER_ITEM = 120;
  const ANGLE_SPACING = 20;

  // 20 loops of 8 categories = 160 items total
  // This gives the user 10 full loops to scroll up, and 10 full loops to scroll down.
  const slots = useMemo(() => Array.from({ length: 20 }).flatMap(() => CATEGORIES), []);
  const NUM_SLOTS = slots.length;

  // Start exactly in the middle loop (index 80 is 'garaze')
  const START_INDEX = 10 * CATEGORIES.length;
  const CENTER_SCROLL = START_INDEX * PX_PER_ITEM; // 80 * 120 = 9600px
  const TOTAL_HEIGHT = NUM_SLOTS * PX_PER_ITEM; // 19200px

  const { scrollY } = useScroll({ container: sliderRef });

  // Convert absolute scroll pixels to a continuous global angle
  const globalAngle = useTransform(scrollY, (y) => {
    return (y - CENTER_SCROLL) * (ANGLE_SPACING / PX_PER_ITEM);
  });

  // Start in the exact middle to allow scrolling in both directions
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.scrollTop = CENTER_SCROLL;
    }
  }, []);

  // Update active category based on scroll
  useEffect(() => {
    return globalAngle.on('change', (g) => {
      const exactIdx = g / ANGLE_SPACING;
      // We offset by START_INDEX so slotIdx maps correctly to our 160 items
      let slotIdx = Math.round(exactIdx) + START_INDEX;

      // Clamp to array bounds just in case they manage to scroll past 160 items
      const currentId = slots[slotIdx]?.id;
      if (currentId && currentId !== activeId) {
        setActiveId(currentId);
      }
    });
  }, [globalAngle, activeId, slots, NUM_SLOTS]);

  const [isDown, setIsDown] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  const AUTO_SCROLL_INTERVAL = 10000;
  const lastInteractionTime = useRef<number>(Date.now());
  const progress = useMotionValue(0);

  const registerInteraction = () => {
    lastInteractionTime.current = Date.now();
    progress.set(0);
  };

  useEffect(() => {
    let animationFrameId: number;
    const loop = () => {
      const elapsed = Date.now() - lastInteractionTime.current;
      if (elapsed >= AUTO_SCROLL_INTERVAL) {
        // Desktop scroll
        if (sliderRef.current && !isDown && window.innerWidth >= 1024) {
          animate(sliderRef.current.scrollTop, sliderRef.current.scrollTop + PX_PER_ITEM, {
            duration: 1.2,
            ease: "easeInOut",
            onUpdate: (val) => {
              if (sliderRef.current) sliderRef.current.scrollTop = val;
            }
          });
        }
        // Mobile scroll
        if (mobileSliderRef.current && window.innerWidth < 1024) {
          const container = mobileSliderRef.current;
          const currentIdx = CATEGORIES.findIndex(c => c.id === activeId);
          const nextIdx = (currentIdx + 1) % CATEGORIES.length;
          
          const childWidth = (container.children[0] as HTMLElement)?.offsetWidth || 300;
          const gap = 16;
          const itemWidth = childWidth + gap;
          
          container.scrollTo({
             left: nextIdx * itemWidth,
             behavior: 'smooth'
          });
        }
        lastInteractionTime.current = Date.now();
        progress.set(0);
      } else {
        progress.set(elapsed / AUTO_SCROLL_INTERVAL);
      }
      animationFrameId = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isDown, PX_PER_ITEM, progress]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    setIsDown(true);
    setIsDragging(false);
    setStartY(e.pageY - sliderRef.current.offsetTop);
    setScrollTop(sliderRef.current.scrollTop);
    registerInteraction();
  };

  const handleMouseLeave = () => {
    setIsDown(false);
  };

  const handleMouseUp = () => {
    setIsDown(false);
    setTimeout(() => setIsDragging(false), 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown || !sliderRef.current) return;
    e.preventDefault();
    setIsDragging(true);
    const y = e.pageY - sliderRef.current.offsetTop;
    const walk = (y - startY) * 1.5;
    sliderRef.current.scrollTop = scrollTop - walk;
    registerInteraction();
  };

  const handleMobileScroll = () => {
    if (!mobileSliderRef.current) return;
    const container = mobileSliderRef.current;
    
    const scrollLeft = container.scrollLeft;
    const childWidth = (container.children[0] as HTMLElement)?.offsetWidth || 300;
    const gap = 16;
    const itemWidth = childWidth + gap;
    
    let idx = Math.round(scrollLeft / itemWidth);
    if (idx < 0) idx = 0;
    if (idx >= CATEGORIES.length) idx = CATEGORIES.length - 1;
    
    const currentId = CATEGORIES[idx]?.id;
    if (currentId && currentId !== activeId) {
      setActiveId(currentId);
      registerInteraction(); 
    }
  };

  const activeCategory = CATEGORIES.find(c => c.id === activeId) || CATEGORIES[4];

  return (
    <div className="relative w-full h-[70vh] lg:h-[100dvh] lg:min-h-[800px] bg-[#050505] flex flex-col justify-between overflow-visible lg:overflow-hidden font-sans">

      {/* Background Image / Video ze smooth transition */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="w-full h-full relative"
          >
            {activeCategory.video ? (
              <ResponsiveAsset
                type="video"
                src={activeCategory.video}
                autoPlay
                loop={activeCategory.loop}
                muted
                playsInline
                poster={resolveMediaUrl(activeCategory.image)}
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={resolveMediaUrl(activeCategory.image)}
                alt={activeCategory.label}
                className="w-full h-full object-cover"
              />
            )}
          </motion.div>
        </AnimatePresence>
        {/* Lekki gradient tylko z lewej i dołu */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      </div>

      {/* Main Content Area - Odsunięte od góry na header, padding zgodny z headerem */}
      <div className="relative z-10 w-full px-5 md:px-[calc(14px+clamp(20px,2.4vw,44px))] flex-1 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12 pt-24 md:pt-32 lg:pt-40">

        {/* Left Column (Text & Buttons) */}
        <div className="flex-1 max-w-3xl text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] md:text-xs font-semibold tracking-[0.15em] uppercase mb-8"
          >
            LIDER PRODUKCJI W POLSCE
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.1] mb-6 tracking-tight drop-shadow-xl font-medium">
            Producent garaży, bram garażowych, altan i wiat
            <br />
            <span className="font-bold">GMS System</span>
          </h1>

          <p className="hidden md:block text-sm md:text-base lg:text-lg text-gray-200 mb-10 max-w-xl leading-relaxed drop-shadow-md font-light">
            GMS System to firma tworzona z pasją i zaangażowaniem, z wieloletnim doświadczeniem na rynku. Jako producent garaży blaszanych, bram garażowych, wygrodzeń i wiat śmietnikowych oferujemy funkcjonalne i estetyczne rozwiązania, które zwiększają bezpieczeństwo i ułatwiają organizację przestrzeni zarówno na osiedlach, jak i na prywatnych posesjach. Poznaj nas bliżej i już dziś przekonaj się, co możesz zyskać, wybierając najwyższą jakość i wiedzę specjalistów w swojej dziedzinie!
          </p>

          <div className="flex flex-row flex-wrap gap-3 sm:gap-5">
            <Link
              href="/konfigurator"
              className="inline-flex flex-1 justify-center items-center px-4 sm:px-10 py-3 sm:py-3.5 bg-[#ffcc33] hover:bg-[#e6b800] text-white text-[11px] sm:text-sm font-bold tracking-wide rounded-md transition-all text-center shadow-[0_0_20px_rgba(255,204,51,0.5)] whitespace-nowrap"
            >
              SKONFIGURUJ POD SIEBIE
            </Link>
            <Link
              href="/realizacje"
              className="inline-flex flex-1 justify-center items-center px-4 sm:px-10 py-3 sm:py-3.5 bg-white/10 backdrop-blur-md border border-white/30 text-white hover:bg-white/20 text-[11px] sm:text-sm font-bold tracking-wide rounded-md transition-all text-center whitespace-nowrap"
            >
              ZOBACZ REALIZACJE
            </Link>
          </div>
        </div>

        {/* Right Column (Samsung Internet 3D Tab Switcher Stack - DESKTOP ONLY) */}
        <div className="hidden lg:flex relative w-[350px] flex-col items-end justify-center mt-0">
          <div className="relative w-full overflow-hidden flex flex-col items-end py-4">
            <div
              ref={sliderRef}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              onWheel={registerInteraction}
              onTouchStart={registerInteraction}
              onTouchMove={registerInteraction}
              className={`w-full relative overflow-y-auto overscroll-none h-[600px] max-h-[80vh] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden transition-all duration-300 ${isDown ? 'cursor-grabbing select-none snap-none' : 'cursor-grab snap-y snap-mandatory'}`}
            >
              <div style={{ height: `${TOTAL_HEIGHT}px` }} className="relative w-full">
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                  <div className="sticky top-0 h-[600px] max-h-[80vh] flex items-center justify-end w-full pointer-events-none">
                    {slots.map((cat, idx) => (
                      <Link
                        key={`${cat.id}-${idx}`}
                        href={cat.link}
                        onClick={(e) => {
                          if (isDragging) e.preventDefault();
                        }}
                        className="absolute pointer-events-auto block"
                        draggable={false}
                      >
                        <SamsungTabCard
                          cat={cat}
                          idx={idx}
                          globalAngle={globalAngle}
                          isActive={activeId === cat.id}
                          progress={progress}
                        />
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="w-full flex flex-col pointer-events-none">
                  {Array.from({ length: NUM_SLOTS }).map((_, i) => (
                    <div key={i} style={{ height: `${PX_PER_ITEM}px` }} className="w-full snap-start shrink-0" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Normal Horizontal Carousel - MOBILE ONLY */}
      <div className="flex lg:hidden w-full absolute -bottom-12 left-0 right-0 z-20">
        <div 
          ref={mobileSliderRef}
          onScroll={handleMobileScroll}
          onTouchStart={registerInteraction}
          className="flex w-full overflow-x-auto snap-x snap-mandatory gap-4 px-[clamp(20px,2.4vw,44px)] pb-4 pt-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {CATEGORIES.map((cat, idx) => {
            const isActive = activeId === cat.id;
            return (
              <Link 
                href={cat.link} 
                key={cat.id} 
                className={`w-[75vw] max-w-[320px] shrink-0 snap-center relative rounded-[1.5rem] overflow-hidden h-[160px] flex flex-col justify-between p-5 border transition-all duration-500 shadow-xl ${isActive ? 'bg-black/40 border-[#ffcc33]/60 scale-100 shadow-[0_0_30px_rgba(255,204,51,0.2)]' : 'bg-black/10 border-white/10 scale-95 opacity-70'}`}
              >
                {/* Background img */}
                <div className={`absolute z-0 inset-0 transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                   <ResponsiveAsset type="image" src={cat.image} className="w-full h-full object-cover" alt={cat.label} />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                </div>
                
                {/* Icon */}
                <div className="relative z-10 flex w-full">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 ${isActive ? 'bg-[#ffcc33] text-black shadow-[0_0_15px_rgba(255,204,51,0.5)]' : 'bg-white/10 border border-white/10 text-white'}`}>
                    {cat.icon}
                  </div>
                </div>

                {/* Text */}
                <div className="relative z-10 flex flex-col">
                  <span className={`font-bold uppercase tracking-wide drop-shadow-md leading-tight transition-all duration-300 ${isActive ? 'text-white text-lg' : 'text-gray-300 text-sm'}`}>
                    {cat.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
