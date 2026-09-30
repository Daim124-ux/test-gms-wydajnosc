"use client";

import React, { useRef } from 'react';
import { motion } from 'framer-motion';

const images = [
  {
    src: "/assets/images/hero_v2/Gemini_Generated_Image_i0gmgti0gmgti0gm.jpg",
    title: "Garaże Stalowe",
    link: "/garaze-stalowe"
  },
  {
    src: "/assets/images/hero_v2/category_wiaty_1789645248018.jpg",
    title: "Wiaty Rowerowe",
    link: "/wiaty-stalowe"
  },
  {
    src: "/assets/images/hero_v2/category_fence_1789645257537.jpg",
    title: "Wygrodzenia",
    link: "/wygrodzenia-przemyslowe"
  },
  {
    src: "/assets/images/wiaty-stalowe-na-rowery/Wiata-na-meble-ogrodowe.jpg",
    title: "Wiaty Ogrodowe",
    link: "/wiaty-stalowe"
  },
  {
    src: "/assets/images/hero_v2/Gemini_Generated_Image_kpnzxlkpnzxlkpnz.jpg",
    title: "Altany Śmietnikowe",
    link: "/altany-smietnikowe"
  },
  {
    src: "/assets/images/hero_v2/Gemini_Generated_Image_pnn9j1pnn9j1pnn9.jpg",
    title: "Bramy Segmentowe",
    link: "/bramy-garazowe"
  },
];

export default function HomeGallery() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      // Pobieramy orientacyjną szerokość jednego elementu (np. po to, by scrollować o jeden element)
      const itemWidth = scrollRef.current.firstElementChild?.clientWidth || 300;
      scrollRef.current.scrollBy({ left: -(itemWidth + 24), behavior: 'smooth' }); // 24 to gap
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      const itemWidth = scrollRef.current.firstElementChild?.clientWidth || 300;
      scrollRef.current.scrollBy({ left: (itemWidth + 24), behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 md:py-32 bg-[#050505] text-white overflow-hidden relative">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#ffcc33]/5 blur-[120px] rounded-full pointer-events-none z-0"></div>

      <div className="px-4 md:px-12 lg:px-20 mb-12 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
        <div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-4 drop-shadow-lg"
          >
            Nasze Realizacje.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-gray-400 font-light"
          >
            Zainspiruj się projektami naszych klientów.
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <a href="/realizacje" className="group inline-flex items-center text-lg font-medium text-white hover:text-[#ffcc33] transition-colors border-b-2 border-transparent hover:border-[#ffcc33] pb-1">
            Zobacz całą galerię
            <svg className="w-5 h-5 ml-2 transform transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </a>
        </motion.div>
      </div>

      <div 
        ref={scrollRef}
        className="w-full flex overflow-x-auto gap-6 px-4 md:px-12 lg:px-20 pb-4 snap-x snap-mandatory relative z-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {images.map((item, idx) => (
          <div key={idx} className="relative shrink-0 snap-center w-[85vw] md:w-[45vw] lg:w-[28vw] xl:w-[22vw] aspect-[3/4] rounded-2xl overflow-hidden bg-gray-900 group shadow-2xl border border-white/10 cursor-pointer">
            <img 
              src={item.src} 
              alt={item.title} 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            {/* Dark gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Content overlay */}
            <div className="absolute inset-0 p-8 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <h3 className="text-2xl font-bold text-white mb-4 drop-shadow-md">{item.title}</h3>
              
              <a 
                href={item.link} 
                className="inline-flex justify-center items-center px-6 py-3 bg-[#ffcc33]/90 hover:bg-[#ffcc33] backdrop-blur-md text-black text-sm font-bold tracking-wide rounded-full transition-all text-center shadow-[0_0_15px_rgba(255,204,51,0.4)] opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 duration-500"
              >
                DOWIEDZ SIĘ WIĘCEJ
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <div className="flex justify-center items-center gap-4 mt-8 relative z-10">
        <button 
          onClick={scrollLeft} 
          aria-label="Przewiń w lewo"
          className="w-14 h-14 flex items-center justify-center rounded-full border border-white/10 hover:border-[#ffcc33] hover:text-[#ffcc33] hover:bg-white/5 transition-all text-white/50 backdrop-blur-md"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button 
          onClick={scrollRight} 
          aria-label="Przewiń w prawo"
          className="w-14 h-14 flex items-center justify-center rounded-full border border-white/10 hover:border-[#ffcc33] hover:text-[#ffcc33] hover:bg-white/5 transition-all text-white/50 backdrop-blur-md"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
}
