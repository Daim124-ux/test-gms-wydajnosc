'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';

interface StickySectionProps {
  title: string;
  description: string;
  images: string[];
}

export default function AppleStickyScroll({ title, description, images }: StickySectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Ten layout ma wysokości 300vh, aby wymusić bardzo dużo miejsca na scrollowanie (dla "przyklejenia")
  return (
    <section ref={containerRef} className="relative bg-white dark:bg-[#161617] w-full pt-32 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 relative">
        
        {/* Lewa strona - Zblokowana (Sticky) */}
        <div className="lg:sticky top-0 h-auto lg:h-screen flex flex-col justify-center py-20 lg:py-0 2xl:pr-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white"
          >
            {title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-xl md:text-3xl font-light leading-relaxed text-gray-500 dark:text-gray-400"
          >
            {description}
          </motion.p>
        </div>

        {/* Prawa strona - Scrollująca (zdjęcia zlikwidowane z brzydkich placeholderów na makiety CSS) */}
        <div className="flex flex-col gap-16 lg:gap-32 pb-32 lg:pb-screen/2">
          {images.map((url, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full aspect-[4/5] sm:aspect-square relative rounded-[40px] overflow-hidden shadow-[0_35px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-none border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1c1c1e] flex flex-col items-center justify-center p-8"
            >
              {/* Tutaj docelowo wrzucisz swój model, my dajemy Apple'owską czystą przestrzeń */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-tr from-[#1660b1]/10 to-transparent dark:from-[#ffcc33]/10 rounded-full blur-3xl opacity-50" />
              
              <h3 className="relative z-10 text-2xl font-semibold text-gray-400 dark:text-gray-500 tracking-tight text-center">
                Moduł {idx + 1}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
