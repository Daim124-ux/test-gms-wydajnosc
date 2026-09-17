"use client";

import React from 'react';
import { motion } from 'framer-motion';

const images = [
  "https://picsum.photos/seed/gal1/600/800",
  "https://picsum.photos/seed/gal2/800/600",
  "https://picsum.photos/seed/gal3/600/600",
  "https://picsum.photos/seed/gal4/800/800",
  "https://picsum.photos/seed/gal5/600/800",
  "https://picsum.photos/seed/gal6/800/600",
];

export default function HomeGallery() {
  return (
    <section className="py-32 bg-[#0a0a0a] text-white overflow-hidden">
      <div className="px-4 md:px-12 lg:px-20 mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-medium tracking-tight mb-4"
          >
            Nasze Realizacje.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-500 font-light"
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
          <a href="/realizacje" className="inline-flex items-center text-lg font-medium hover:text-[#ff6b00] transition-colors border-b-2 border-transparent hover:border-[#ff6b00] pb-1">
            Zobacz całą galerię
            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </a>
        </motion.div>
      </div>

      {/* Marquee or Masonry grid. Here a simple scrollable flex row for modern look */}
      <div className="w-full flex overflow-x-auto gap-6 px-4 md:px-12 lg:px-20 pb-12 snap-x scrollbar-hide">
        {images.map((img, idx) => (
          <div key={idx} className="relative shrink-0 snap-center w-[75vw] md:w-[40vw] lg:w-[25vw] aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 group">
            <img 
              src={img} 
              alt={`Realizacja ${idx + 1}`} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
          </div>
        ))}
      </div>
    </section>
  );
}
