"use client";

import React from 'react';
import { motion } from 'framer-motion';

const features = [
  {
    title: "Najwyższa Wytrzymałość",
    description: "Konstrukcje przetestowane w ekstremalnych warunkach. Gwarancja stabilności na dekady.",
    image: "https://picsum.photos/seed/wytrzymalosc/800/600",
    colSpan: "col-span-1 md:col-span-2",
    rowSpan: "row-span-1 md:row-span-2",
  },
  {
    title: "100% Ocynk",
    description: "Zabezpieczenie przed rdzą dzięki pełnemu ocynkowaniu ogniowemu.",
    image: "https://picsum.photos/seed/ocynk/600/400",
    colSpan: "col-span-1",
    rowSpan: "row-span-1",
  },
  {
    title: "Szybki Montaż",
    description: "Innowacyjny system modułowy pozwala na montaż w kilka godzin.",
    image: "https://picsum.photos/seed/montaz/600/400",
    colSpan: "col-span-1",
    rowSpan: "row-span-1",
  },
  {
    title: "Nowoczesny Design",
    description: "Minimalistyczne linie idealnie pasujące do nowoczesnej architektury.",
    image: "https://picsum.photos/seed/design/1000/400",
    colSpan: "col-span-1 md:col-span-3",
    rowSpan: "row-span-1",
  }
];

export default function HomeFeatures() {
  return (
    <section className="py-24 bg-[#0a0a0a] text-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 md:px-[calc(14px+clamp(20px,2.4vw,44px))]">
        
        <div className="mb-16 md:mb-24 text-center md:text-left">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-6"
          >
            Technologia spotyka <br className="hidden md:block"/>
            <span className="text-gray-400">nowoczesny design.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl font-light"
          >
            Nasze moduły to nie tylko wygląd. To zaawansowana inżynieria, która gwarantuje trwałość, bezpieczeństwo i niezawodność przez pokolenia.
          </motion.p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[280px] md:auto-rows-[300px] gap-4 md:gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`relative rounded-3xl overflow-hidden group bg-[#111] border border-white/10 ${feature.colSpan} ${feature.rowSpan}`}
            >
              <div className="absolute inset-0">
                <img 
                  src={feature.image} 
                  alt={feature.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
              </div>
              
              <div className="absolute bottom-0 left-0 w-full p-8 md:p-10 z-10 flex flex-col justify-end h-full">
                <h3 className="text-2xl md:text-3xl font-semibold mb-3 text-white tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-gray-300 text-sm md:text-base font-light max-w-md opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
