'use client'; // Karuzela będzie wymagała JS do obsługi przewijania, więc dajemy 'use client'

import React, { useRef } from 'react';
import Image from 'next/image';

interface CarouselItem {
  id: string;
  url?: string;
  alt?: string;
  title?: string;
}

interface GenericCarouselProps {
  items: CarouselItem[];
}

export default function GenericCarousel({ items }: GenericCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -350, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 350, behavior: 'smooth' });
    }
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full max-w-[100vw] group">
      
      {/* Element przewijający */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-4 sm:gap-6 px-4 sm:px-6 lg:px-8 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-6"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Ukrywa domyślny scrollbar
      >
        {items.map((item) => (
          <div 
            key={item.id} 
            className="snap-start snap-always shrink-0 min-w-[280px] sm:min-w-[350px] aspect-[4/3] relative rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-all duration-300 ring-1 ring-black/5 dark:ring-white/10 flex-col flex"
          >
            {item.url ? (
              <div className="w-full h-full bg-gradient-to-tr from-gray-100 to-white dark:from-[#222222] dark:to-[#111111] flex flex-col items-center justify-center relative shadow-inner">
                {/* Odbicie */}
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/40 to-transparent dark:from-white/5 pointer-events-none" />
                <span className="text-gray-400 dark:text-gray-500 font-medium tracking-tight text-sm px-8 text-center">{item.alt || 'Kadr produktu'}</span>
              </div>
            ) : (
              <div className="w-full h-full bg-gray-200 dark:bg-zinc-800 flex items-center justify-center">
                Brak zdjęcia
              </div>
            )}
            
            {/* Opcjonalny tytuł pod zdjęciem lub warstwą overlay */}
            {item.title && (
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 flex items-end justify-start h-1/2">
                <h3 className="text-white font-medium text-lg truncate w-full">{item.title}</h3>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Przyciski nawigacji - aktywne tylko na hover (lub zawsze na mobile, gdzie defaultowo można scrollować palcem) */}
      <button 
        onClick={scrollLeft}
        aria-label="Poprzednie"
        className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 dark:bg-black/80 backdrop-blur items-center justify-center rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 ring-1 ring-black/5 dark:ring-white/10 z-10 hover:bg-white dark:hover:bg-black text-gray-900 dark:text-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      <button 
        onClick={scrollRight}
        aria-label="Następne"
        className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 dark:bg-black/80 backdrop-blur items-center justify-center rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 ring-1 ring-black/5 dark:ring-white/10 z-10 hover:bg-white dark:hover:bg-black text-gray-900 dark:text-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      {/* Prosty stylowy hack aby upewnić się że scrollbar jest ukryty na webkit */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </div>
  );
}
