'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Shield, Zap, Droplets, Maximize } from 'lucide-react'; // Przykład ikon

export default function BentoGrid() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <section className="py-24 bg-[#f5f5f7] dark:bg-black w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400">
            Wiadomo, że potężna.
          </h2>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Główny, duży kafelek */}
          <motion.div variants={itemVariants} className="md:col-span-2 md:row-span-2 bg-white dark:bg-[#1c1c1e] rounded-[40px] p-8 sm:p-12 flex flex-col justify-end min-h-[400px] md:min-h-[600px] relative overflow-hidden group shadow-[0_35px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-white/5 dark:shadow-none">
             <div className="absolute top-10 left-10 text-[#1660b1] dark:text-[#ffcc33]">
              <Shield size={48} strokeWidth={1.5} />
             </div>
             <div className="relative z-10 w-full md:w-2/3">
              <h3 className="text-3xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Ocynk ogniowy. <br/><span className="text-gray-400">Niewzruszona obrona.</span>
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Stal cynkujemy ogniowo pokrywając powłoką antykorozyjną o grubości do 120 mikronów. Odporność, która trwa dekady.
              </p>
             </div>
             {/* Mock obrazka tła */}
             <div className="absolute right-0 bottom-0 w-3/4 h-3/4 bg-gradient-to-tl from-gray-100 to-transparent dark:from-gray-800 rounded-tl-[100px] -z-0 opacity-50 group-hover:scale-105 transition-transform duration-700" />
          </motion.div>

          {/* Mniejszy kafelek (Prawy górny) */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-[#1c1c1e] rounded-[40px] p-10 flex flex-col justify-between min-h-[250px] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-white/5 dark:shadow-none relative overflow-hidden group">
            <div className="text-purple-500 mb-6">
              <Zap size={36} strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Modułowość</h3>
              <p className="text-gray-600 dark:text-gray-400">Łącz segmenty w nieskończoność. Rozbudowuj z upływem czasu.</p>
            </div>
          </motion.div>

          {/* Mniejszy kafelek (Prawy środkowy) */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-[#1c1c1e] rounded-[40px] p-10 flex flex-col justify-between min-h-[250px] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-white/5 dark:shadow-none relative overflow-hidden group">
            <div className="text-blue-500 mb-6">
              <Droplets size={36} strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">System Odwodnień</h3>
              <p className="text-gray-600 dark:text-gray-400">Rynny ukryte w konstrukcji lub zintegrowany spadek dachu.</p>
            </div>
          </motion.div>

          {/* Podłużny kafelek (Dół, pełen wymiar) */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-3 bg-white dark:bg-[#1c1c1e] rounded-[40px] p-10 sm:p-16 flex flex-col sm:flex-row items-center justify-between min-h-[200px] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-white/5 dark:shadow-none overflow-hidden">
             <div className="w-full sm:w-1/2 mb-8 sm:mb-0">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Pełna paleta RAL.
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Malowanie proszkowe w standardzie pozwala dopasować system idealnie do Twojej inwestycji.
                </p>
             </div>
             <div className="w-full sm:w-1/2 flex items-center justify-center gap-4">
                {/* Kolorowe kółka symulujące paletę RAL */}
                <div className="w-16 h-16 rounded-full bg-[#161617] shadow-lg border border-white/20"></div>
                <div className="w-16 h-16 rounded-full bg-[#f5f5f7] shadow-lg border border-gray-200"></div>
                <div className="w-16 h-16 rounded-full bg-[#1660b1] shadow-lg border border-white/20"></div>
                <div className="w-16 h-16 rounded-full bg-orange-500 shadow-lg border border-white/20"></div>
             </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
