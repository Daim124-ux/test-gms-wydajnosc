"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import InteractivePointCloud from '../InteractivePointCloud/InteractivePointCloud';

const CLOUDFRONT_URL = 'https://d1moyf5ccth9x8.cloudfront.net';

const resolveMediaUrl = (url?: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  if (process.env.NODE_ENV === 'development') return url;
  
  const cleanSrc = url.startsWith('/') ? url.slice(1) : url;
  return `${CLOUDFRONT_URL}/_optimized/originals/${cleanSrc}`;
};

export default function HomeConfiguratorPromo() {
  return (
    <section className="relative w-full min-h-[1000px] pt-24 pb-32 bg-[#050505] overflow-hidden flex flex-col items-center justify-start text-center">
      {/* Interactive Background */}
      <InteractivePointCloud imageUrl={resolveMediaUrl("/assets/images/home/garaz_pointcloud.png")} />
      
      {/* Background glow effects - moved below point cloud so it doesn't block clicks but adds to ambiance */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ffcc33]/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 flex flex-col items-center pointer-events-none mt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold tracking-widest text-[#ffcc33] uppercase mb-8"
        >
          Konfigurator 3D
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-semibold tracking-tighter text-white mb-6 max-w-4xl"
        >
          Twój projekt. <span className="text-gray-500">W każdym wymiarze.</span>
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-400 max-w-2xl font-light mb-16"
        >
          Zbuduj idealną przestrzeń. Zmieniaj wymiary, kolory i warianty w czasie rzeczywistym używając naszego narzędzia 3D.
        </motion.p>
      </div>
      
      {/* Przycisk na samym dole sekcji */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20"
      >
        <Link 
          href="/konfigurator" 
          className="pointer-events-auto relative group overflow-hidden inline-flex items-center justify-center px-10 py-4 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-white text-sm md:text-base font-bold tracking-widest uppercase transition-all duration-300 hover:scale-105 hover:border-[#ffcc33]/50 hover:bg-[#ffcc33]/10 hover:shadow-[0_0_40px_rgba(255,204,51,0.2)]"
        >
          {/* Liquid glass reflection */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/3 bg-white/10 blur-md rounded-full"></div>
          
          <span className="relative z-10 drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)] group-hover:text-[#ffcc33] transition-colors duration-300">
            Przejdź do konfiguratora
          </span>
        </Link>
      </motion.div>
    </section>
  );
}
