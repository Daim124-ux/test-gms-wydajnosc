'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, CheckCircle2 } from 'lucide-react';

const benefits = [
  'Ceny prosto od producenta',
  'Szeroki wybór akcesoriów',
  'Szybka realizacja zamówień',
  'Bezpieczne płatności online'
];

export default function HomeStorePromo() {
  return (
    <section className="relative w-full py-32 bg-[#050505] overflow-hidden flex flex-col items-center justify-center text-center border-t border-white/5">
      {/* Background glow effects */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-[#ff6b00]/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 flex flex-col items-center">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold tracking-widest text-[#ff6b00] uppercase mb-8"
        >
          <ShoppingBag className="w-3 h-3 mr-2" />
          Sklep Online
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-semibold tracking-tighter text-white mb-6 max-w-4xl"
        >
          Wygodne zakupy. <span className="text-gray-500">Bezpośrednio od nas.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-400 max-w-2xl font-light mb-16 text-pretty"
        >
          Zamawiaj gotowe wiaty, akcesoria do bram, napędy i elementy wykończeniowe prosto od producenta, bez pośredników i z gwarancją jakości.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="relative w-full max-w-[1000px] bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-16 overflow-hidden flex flex-col md:flex-row items-center justify-between shadow-2xl"
        >
          <div className="relative z-10 md:w-1/2 mb-12 md:mb-0 text-left">
            <h3 className="text-3xl font-semibold text-white mb-8 tracking-tight">Gotowe rozwiązania w jednym miejscu</h3>
            <ul className="space-y-4 mb-10">
              {benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-center gap-3 text-gray-300 font-light text-lg">
                  <CheckCircle2 className="w-5 h-5 text-[#ff6b00] flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <Link 
              href="/sklep" 
              className="inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-gray-200 text-black font-semibold rounded-full transition-colors duration-300"
            >
              Przejdź do sklepu
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>

          <div className="relative z-10 md:w-[45%] flex justify-center">
            {/* Abstract shop representation */}
            <div className="relative w-full max-w-sm group">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#ff6b00]/20 to-transparent rounded-3xl transform rotate-3 scale-105 opacity-50 group-hover:rotate-6 transition-transform duration-700" />
              <div className="bg-[#0f0f0f] border border-white/10 rounded-3xl shadow-2xl p-6 relative flex flex-col items-center justify-center min-h-[300px]">
                <ShoppingBag className="w-20 h-20 text-[#ff6b00] mb-6 opacity-80" />
                <div className="h-4 w-3/4 bg-white/10 rounded-full mb-4" />
                <div className="h-4 w-1/2 bg-white/5 rounded-full" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
