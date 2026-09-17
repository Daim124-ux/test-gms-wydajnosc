'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Warehouse, DoorClosed, Fence, Trash2 } from 'lucide-react';

const categories = [
  {
    id: 'garaze',
    title: 'Garaże blaszane',
    description: 'Trwałe i estetyczne garaże na każdą posesję. Możliwość pełnej personalizacji.',
    icon: <Warehouse className="w-10 h-10 mb-4 text-[#ff6b00]" />,
    link: '/garaze-blaszane',
  },
  {
    id: 'bramy',
    title: 'Bramy garażowe',
    description: 'Bezpieczne bramy uchylne i dwuskrzydłowe, dopasowane do Twojego garażu.',
    icon: <DoorClosed className="w-10 h-10 mb-4 text-[#ff6b00]" />,
    link: '/bramy-garazowe',
  },
  {
    id: 'wygrodzenia',
    title: 'Wygrodzenia',
    description: 'Systemy wygrodzeń idealne dla osiedli mieszkaniowych i obiektów przemysłowych.',
    icon: <Fence className="w-10 h-10 mb-4 text-[#ff6b00]" />,
    link: '/wygrodzenia',
  },
  {
    id: 'wiaty',
    title: 'Wiaty śmietnikowe',
    description: 'Nowoczesne wiaty ułatwiające organizację i dbające o estetykę otoczenia.',
    icon: <Trash2 className="w-10 h-10 mb-4 text-[#ff6b00]" />,
    link: '/wiaty-smietnikowe',
  }
];

export default function HomeCategories() {
  return (
    <section className="relative w-full py-32 bg-[#050505] overflow-hidden flex flex-col items-center text-center border-t border-white/5">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[400px] h-[400px] bg-white/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold tracking-widest text-[#ff6b00] uppercase mb-8"
        >
          Kategorie Produktów
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-semibold tracking-tighter text-white mb-6 max-w-4xl"
        >
          Nasza produkcja. <span className="text-gray-500">Wybierz odpowiednie rozwiązanie.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-400 max-w-2xl font-light mb-16 text-pretty"
        >
          Poznaj flagowe produkty GMS System, projektowane z myślą o najwyższej jakości i długowieczności.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + idx * 0.1, duration: 0.6 }}
              className="group"
            >
              <Link href={cat.link} className="block relative h-full bg-white/5 border border-white/10 rounded-3xl p-10 text-left overflow-hidden transition-all duration-500 hover:bg-white/10 hover:border-white/20">
                {/* subtle gradient hover overlay inside card */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#ff6b00]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 flex flex-col h-full justify-between min-h-[280px]">
                  <div>
                    {cat.icon}
                    <h3 className="text-3xl font-semibold tracking-tight text-white mb-4">{cat.title}</h3>
                    <p className="text-gray-400 text-lg font-light max-w-sm">
                      {cat.description}
                    </p>
                  </div>
                  
                  <div className="mt-8 flex items-center text-sm font-semibold tracking-wide uppercase text-white group-hover:text-[#ff6b00] transition-colors">
                    <span className="mr-2">Zobacz więcej</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
