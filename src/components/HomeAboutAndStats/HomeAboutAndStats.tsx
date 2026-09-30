'use client';

import React from 'react';
import { motion } from 'framer-motion';

const aboutFacts = [
  "Ponad 30 lat doświadczenia",
  "Tysiące zrealizowanych projektów",
  "Dostawy w całej Europie",
  "Rozwiązania dla domów i osiedli"
];

export default function HomeAboutAndStats() {
  return (
    <section className="relative w-full py-32 bg-[#050505] overflow-hidden flex flex-col items-center justify-center text-center">
      {/* Background ambient light */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[800px] h-[800px] bg-[#ffcc33]/5 blur-[200px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 flex flex-col items-center">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center px-5 py-2 rounded-full bg-[#ffcc33]/10 border border-[#ffcc33]/20 text-xs font-bold tracking-widest text-[#ffcc33] uppercase mb-8 shadow-[0_0_30px_rgba(255,107,0,0.15)]"
        >
          Jakość klasy premium
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white mb-6 max-w-4xl text-balance"
        >
          Tworzeni z pasją. <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600 font-medium">Sprawdzeni w boju.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-gray-400 max-w-3xl font-light mb-12 text-pretty"
        >
          Jako producent garaży blaszanych, bram garażowych, wygrodzeń i wiat śmietnikowych oferujemy funkcjonalne rozwiązania, które zwiększają bezpieczeństwo i ułatwiają organizację przestrzeni. Poznaj naszą jakość.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="relative w-full overflow-hidden group mt-4 mask-edges"
        >
          <style>{`
            @keyframes marquee {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-50%); }
            }
            .animate-marquee {
              animation: marquee 120s linear infinite;
              display: flex;
              width: max-content;
            }
            .group:hover .animate-marquee {
              animation-play-state: paused;
            }
            .mask-edges {
              -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
              mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
            }
          `}</style>
          <div className="animate-marquee items-center gap-4 lg:gap-8 text-sm md:text-base lg:text-lg text-gray-300 font-light">
            {Array(10).fill(aboutFacts).flat().map((fact, idx) => (
              <React.Fragment key={idx}>
                <span className="whitespace-nowrap hover:text-white transition-colors duration-300 cursor-default">{fact}</span>
                <span className="text-gray-700/80 select-none">|</span>
              </React.Fragment>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
