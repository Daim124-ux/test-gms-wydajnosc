"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HomeCTA() {
  return (
    <section className="relative py-32 bg-[#050505] text-white overflow-hidden flex items-center justify-center border-t border-white/5">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#ff6b00]/10 pointer-events-none"></div>
      
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 text-center">
        <motion.h2 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-5xl md:text-7xl font-semibold tracking-tighter mb-8"
        >
          Gotowy na <span className="text-[#ff6b00]">zmianę?</span>
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-xl md:text-2xl text-gray-400 font-light mb-12 max-w-2xl mx-auto"
        >
          Zaprojektuj idealną przestrzeń za pomocą naszego konfiguratora lub skontaktuj się z naszymi doradcami, aby uzyskać bezpłatną wycenę.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link 
            href="/konfigurator"
            className="w-full sm:w-auto px-10 py-4 bg-[#ff6b00] hover:bg-[#e56000] text-white font-bold rounded-full transition-colors text-lg text-center"
          >
            Skonfiguruj w 3D
          </Link>
          <Link 
            href="/kontakt"
            className="w-full sm:w-auto px-10 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full border border-white/20 transition-colors text-lg text-center"
          >
            Skontaktuj się z nami
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
