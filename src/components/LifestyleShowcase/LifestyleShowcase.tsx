'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const LifestyleShowcase = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const items = [
    {
      id: '1',
      title: 'Stalowy schowek na rowery',
      description: 'Przechowuj swoje rowery bezpiecznie w wiacie stalowej od Polskiego producenta.',
      image: '/assets/images/wiaty-stalowe-na-rowery/Wiata_na_rowery_diff_ratio.jpg',
    },
    {
      id: '2',
      title: 'Wiata stalowa na ogrodowe akcesoria',
      description: 'Wiata stalowa na ogrodowe akcesoria.',
      image: '/assets/images/wiaty-stalowe-na-rowery/Wiata-na-meble-ogrodowe.jpg',
    },
    {
      id: '3',
      title: 'Wiata stalowa na rzeczy do SPA',
      description: 'Przechowuj ręczniki, szlafroki oraz sprzęt do czyszczenia jacuzzi.',
      image: '/assets/images/wiaty-stalowe-na-rowery/Wiata-dla-hoteli_smaller.jpg',
    },
  ];

  const scrollToIndex = (index: number) => {
    if (scrollContainerRef.current) {
      const width = scrollContainerRef.current.offsetWidth;
      scrollContainerRef.current.scrollTo({
        left: index * width,
        behavior: 'smooth',
      });
      setCurrentIndex(index);
    }
  };

  const nextSlide = React.useCallback(() => {
    const next = (currentIndex + 1) % items.length;
    scrollToIndex(next);
  }, [currentIndex, items.length]);

  const prevSlide = () => {
    const prev = (currentIndex - 1 + items.length) % items.length;
    scrollToIndex(prev);
  };

  // AUTOPLAY EFFECT
  React.useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000); // Switch every 5 seconds

    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="bg-black py-24 px-4 overflow-hidden relative">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* NEON TITLE - Slightly overlapping the slider, moved 10px up */}
        <div className="text-center mb-[-5px] md:mb-[-15px] relative z-20">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[48px] md:text-[80px] font-semibold text-white tracking-tighter leading-[0.9em]"
            style={{
              textShadow: '0 -35px 50px rgba(22, 96, 177, 0.99), 0 -10px 30px rgba(22, 96, 177, 0.99), 0 -5px 20px rgba(22, 96, 177, 0.99), 0 10px 30px rgba(22, 96, 177, 0.8), 0 30px 50px rgba(22, 96, 177, 0.7), 0 50px 70px rgba(22, 96, 177, 0.6), 0 70px 90px rgba(22, 96, 177, 0.5), 0 90px 120px rgba(22, 96, 177, 0.4)'
            }}
          >
            Nie tylko na rowery
          </motion.h2>
        </div>

        {/* SLIDER CONTAINER - Taller aspect ratio and UI consistency */}
        <div className="relative group max-w-6xl mx-auto z-10">
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-hidden snap-x snap-mandatory rounded-[20px] shadow-[0_0_100px_rgba(22,96,177,0.2)] border border-white/10"
          >
            {items.map((item, index) => (
              <div 
                key={item.id}
                className="min-w-full snap-start relative aspect-[4/5] md:aspect-[21/11] overflow-hidden"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />

                <div className="absolute bottom-10 left-10 md:bottom-16 md:left-16 max-w-2xl">
                  <motion.h3 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl md:text-[32px] font-bold text-white mb-2 tracking-tight leading-none"
                  >
                    {item.title}
                  </motion.h3>
                  <motion.p 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-[18px] md:text-[20px] text-zinc-300 font-normal leading-relaxed max-w-xl tracking-tight opacity-90"
                  >
                    {item.description}
                  </motion.p>
                </div>
              </div>
            ))}
          </div>

          {/* NAVIGATION BUTTONS - Smaller Liquid Glass Style */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 md:px-8 pointer-events-none">
            <button 
              onClick={prevSlide}
              className="w-10 h-10 md:w-14 md:h-14 bg-blue-600/30 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white shadow-2xl hover:bg-blue-600/50 active:scale-90 transition-all pointer-events-auto"
              aria-label="Poprzedni slajd"
            >
              <ChevronLeft size={28} strokeWidth={2.5} />
            </button>
            <button 
              onClick={nextSlide}
              className="w-10 h-10 md:w-14 md:h-14 bg-blue-600/30 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white shadow-2xl hover:bg-blue-600/50 active:scale-90 transition-all pointer-events-auto"
              aria-label="Następny slajd"
            >
              <ChevronRight size={28} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LifestyleShowcase;
