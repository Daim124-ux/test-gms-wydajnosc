"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';

const products = [
  {
    id: 'garaze',
    title: 'Garaże Modułowe',
    description: 'Bezpieczeństwo i elegancja dla Twoich pojazdów. W pełni konfigurowalne.',
    image: '/assets/images/hero_bg_garaze.jpg',
    link: '/konfigurator'
  },
  {
    id: 'wiaty',
    title: 'Wiaty Rowerowe i Samochodowe',
    description: 'Minimalistyczne zadaszenia, chroniące przed warunkami atmosferycznymi.',
    image: '/assets/images/hero_bg_wiaty.jpg',
    link: '/konfigurator'
  },
  {
    id: 'altany',
    title: 'Altany Śmietnikowe',
    description: 'Dyskretne i estetyczne rozwiązanie na odpady, pasujące do fasady.',
    image: '/assets/images/hero_bg_altany.jpg',
    link: '/konfigurator'
  },
  {
    id: 'scianki',
    title: 'Ścianki Działowe',
    description: 'Podziel przestrzeń na zewnątrz lub wewnątrz zachowując nowoczesny styl.',
    image: '/assets/images/hero_bg_scianki.jpg',
    link: '/konfigurator'
  }
];

export default function HomeProductShowcase() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-black">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden bg-black text-white">
        
        <div className="absolute top-32 left-4 md:left-[calc(14px+clamp(20px,2.4vw,44px))] z-10">
          <motion.h2 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-medium tracking-tight mb-2"
          >
            Poznaj nasze rozwiązania.
          </motion.h2>
          <p className="text-gray-400 text-lg md:text-xl font-light">Zaprojektowane by trwać.</p>
        </div>

        <motion.div style={{ x }} className="flex gap-8 px-4 md:px-[calc(14px+clamp(20px,2.4vw,44px))] mt-32 w-[400vw] md:w-[300vw] lg:w-[250vw]">
          {products.map((product) => (
            <div key={product.id} className="relative w-full max-w-[80vw] md:max-w-[60vw] lg:max-w-[45vw] h-[50vh] md:h-[60vh] shrink-0 rounded-3xl overflow-hidden group">
              <img 
                src={product.image} 
                alt={product.title} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>
              
              <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
                <h3 className="text-3xl md:text-4xl font-semibold text-white mb-4 tracking-tight drop-shadow-md">
                  {product.title}
                </h3>
                <p className="text-gray-300 text-base md:text-lg mb-8 max-w-lg drop-shadow-md">
                  {product.description}
                </p>
                <Link 
                  href={product.link}
                  className="inline-flex items-center px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors"
                >
                  Odkryj w 3D
                </Link>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
