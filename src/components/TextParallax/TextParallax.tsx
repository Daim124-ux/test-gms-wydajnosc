'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface TextParallaxProps {
  text: string;
}

export default function TextParallax({ text }: TextParallaxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Analizujemy progress przesuwania od momentu kiedy kontener pojawia się na dole ekranu, aż wyjdzie
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 50%"]
  });

  // Skalujemy krycie elementu oraz lekko go podnosimy bazując na Scroll progress
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0.1, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [50, 0]);

  return (
    <section 
      ref={containerRef}
      className="py-32 md:py-48 bg-[#161617] flex items-center justify-center px-4 sm:px-8"
    >
      <div className="max-w-[980px] mx-auto text-center">
        <motion.p 
          style={{ opacity, y }}
          className="text-5xl sm:text-6xl md:text-[80px] font-semibold tracking-tighter leading-[1.05]"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-br from-gray-900 to-gray-400 dark:from-white dark:to-gray-500">
             {text}
          </span>
        </motion.p>
      </div>
    </section>
  );
}
