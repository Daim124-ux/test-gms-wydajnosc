'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, MapPin, Building2, Users } from 'lucide-react';

const stats = [
  {
    icon: <MapPin className="w-6 h-6 text-[#ff6b00]" />,
    value: 'Cała Europa',
    label: 'Zasięg działania'
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-[#ff6b00]" />,
    value: 'Wieloletnie',
    label: 'Doświadczenie'
  },
  {
    icon: <Building2 className="w-6 h-6 text-[#ff6b00]" />,
    value: 'Tysiące',
    label: 'Zrealizowanych projektów'
  },
  {
    icon: <Users className="w-6 h-6 text-[#ff6b00]" />,
    value: 'Dla każdego',
    label: 'Osiedla & Posesje'
  }
];

export default function HomeAboutAndStats() {
  return (
    <section className="relative w-full py-32 bg-[#050505] overflow-hidden flex flex-col items-center justify-center text-center">
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold tracking-widest text-[#ff6b00] uppercase mb-8"
        >
          Jakość klasy premium
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-semibold tracking-tighter text-white mb-6 max-w-4xl text-balance"
        >
          Tworzeni z pasją. <span className="text-gray-500">Sprawdzeni w boju.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-400 max-w-3xl font-light mb-16 text-pretty"
        >
          Jako producent garaży blaszanych, bram garażowych, wygrodzeń i wiat śmietnikowych oferujemy funkcjonalne rozwiązania, które zwiększają bezpieczeństwo i ułatwiają organizację przestrzeni. Poznaj naszą jakość.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full"
        >
          {stats.map((stat, idx) => (
            <div 
              key={idx} 
              className="bg-white/5 border border-white/10 p-8 rounded-3xl flex flex-col items-center text-center hover:bg-white/10 transition-colors duration-300"
            >
              <div className="mb-4 p-3 bg-white/5 rounded-2xl border border-white/5">
                {stat.icon}
              </div>
              <div className="text-2xl font-semibold text-white mb-1 tracking-tight">{stat.value}</div>
              <div className="text-sm font-light text-gray-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
