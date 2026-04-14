'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';

interface CinematicHeroProps {
  title: string;
  description?: string;
  imageUrl?: string;
}

export default function CinematicHero({ title, imageUrl }: CinematicHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax dla sekcji Hero
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Animacje skrolowania
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Dla głównego tytułu (pojawia się na wejście)
  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[100vh] sm:h-[90vh] overflow-hidden bg-black flex items-center justify-center pt-14"
    >
      {/* Tło kontener z obrazkiem */}
      <motion.div
        style={{ scale, opacity }}
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
      >
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover opacity-80"
            priority
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
      </motion.div>

      {/* Kontent Hero - wycentrowany tekst premium */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 w-full text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-orange-500 font-semibold mb-2 sm:mb-4 tracking-widest text-xs sm:text-sm uppercase"
        >
          Całkowicie nowa kategoria
        </motion.p>

        <motion.h1
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="text-white text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-6 text-gray-300 text-lg sm:text-2xl max-w-2xl font-light"
        >
          Lżejsze, mocniejsze, dopracowane w każdym milimetrze. Prawdziwa stal, której nie oprze się żaden wiatr.
        </motion.p>
      </div>

    </section>
  );
}
