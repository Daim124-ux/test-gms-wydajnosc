'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CompareModel {
  id: string;
  name: string;
  description: string;
  stats: {
    label: string;
    value: string;
    subtext: string;
  }[];
  image: string;
  dimensions: {
    lengths: string[];
    widths: string[];
    heights: string[];
  };
}

const models: CompareModel[] = [
  {
    id: 'gs-standard',
    name: 'GS Standard',
    description: 'Wykończenie z blachy ocynk gołej lub fabrycznie malowanej (10 kolorów w standardzie).',
    stats: [
      { label: 'Pojemność', value: '1 Auto', subtext: 'jednostanowiskowy' },
      { label: 'Konstrukcja', value: 'Ocynk', subtext: 'lub malowana' },
      { label: 'Wjazd', value: '1 Brama', subtext: 'uchylna w standardzie' },
      { label: 'Kolory', value: 'Ocynkowany RAL', subtext: 'Standard' }
    ],
    image: 'https://gms-system.com/wp-content/uploads/2023/04/Garaz_premium_kukurydza.avif',
    dimensions: {
      lengths: ['5220', '5405', '5590', '5775', '5960'],
      widths: ['2970', '3340', '3710', '4080'],
      heights: ['2240', '2420']
    }
  },
  {
    id: 'gs-premium',
    name: 'GS Premium',
    description: 'Wykończenie tynkiem strukturalnym, efekt końcowy zapewnia zastosowanie estetycznej attyki.',
    stats: [
      { label: 'Pojemność', value: '1 Auto', subtext: 'jednostanowiskowy' },
      { label: 'Konstrukcja', value: 'Tynk', subtext: 'efekt murowany' },
      { label: 'Wjazd', value: '1 Brama', subtext: 'uchylna lub segmentowa' },
      { label: 'Kolory', value: 'Malowanie RAL + Tynk', subtext: 'Premium' }
    ],
    image: 'https://gms-system.com/wp-content/uploads/2023/04/Garaz_premium_kukurydza.avif',
    dimensions: {
      lengths: ['5220', '5405', '5590', '5775', '5960'],
      widths: ['2970', '3340', '3710', '4080'],
      heights: ['2240', '2420']
    }
  },
  {
    id: 'gs-dual-standard',
    name: 'GS Dual Standard',
    description: 'Przestronny garaż dwustanowiskowy z wykończeniem z blachy ocynkowanej lub malowanej.',
    stats: [
      { label: 'Pojemność', value: '2 Auta', subtext: 'dwustanowiskowy' },
      { label: 'Konstrukcja', value: 'Ocynk', subtext: 'lub malowana' },
      { label: 'Wjazd', value: '2 Bramy', subtext: 'niezależne wjazdy' },
      { label: 'Kolory', value: 'Ocynkowany RAL', subtext: 'Standard' }
    ],
    image: 'https://gms-system.com/wp-content/uploads/2023/04/Garaz_standard_dual_7016_mat.avif',
    dimensions: {
      lengths: ['5220', '5405', '5590', '5775', '5960'],
      widths: ['5940'],
      heights: ['2240', '2420']
    }
  },
  {
    id: 'gs-dual-premium',
    name: 'GS Dual Premium',
    description: 'Dwustanowiskowy garaż wykończony tynkiem strukturalnym z estetyczną attyką maskującą spadek dachu.',
    stats: [
      { label: 'Pojemność', value: '2 Auta', subtext: 'dwustanowiskowy' },
      { label: 'Konstrukcja', value: 'Tynk', subtext: 'efekt murowany' },
      { label: 'Wjazd', value: '2 Bramy', subtext: 'niezależne wjazdy' },
      { label: 'Kolory', value: 'Malowanie RAL + Tynk', subtext: 'Premium' }
    ],
    image: 'https://gms-system.com/wp-content/uploads/2023/04/Garaz_premium_dual_cytrynowy.avif',
    dimensions: {
      lengths: ['5220', '5405', '5590', '5775', '5960'],
      widths: ['5940'],
      heights: ['2240', '2420']
    }
  }
];

export default function AppleCompareSection() {
  const [selectedId, setSelectedId] = useState(models[0].id);

  const activeModel = models.find((m) => m.id === selectedId) || models[0];

  return (
    <section className="w-full bg-[#fbfbfd] text-[#1d1d1f] py-24 overflow-hidden font-sans">
      <div className="max-w-5xl mx-auto px-6 flex flex-col items-center">
        {/* NAGŁÓWEK */}
        <h2 className="text-[48px] md:text-[64px] font-bold tracking-tight text-center leading-[1.05] mb-12">
          Który garaż wybierasz?
        </h2>

        {/* SELECTOR - BĄBELEK */}
        <div className="flex flex-col items-center mb-16 relative w-full">
          <div className="flex flex-wrap justify-center bg-[#e5e5ea] rounded-[24px] md:rounded-full p-1.5 gap-1 shadow-inner">
            {models.map((model) => {
              const isSelected = selectedId === model.id;
              return (
                <button
                  key={model.id}
                  onClick={() => setSelectedId(model.id)}
                  className={`relative px-4 py-2 md:px-6 md:py-2.5 rounded-full text-[14px] md:text-[15px] font-semibold transition-colors z-10 ${isSelected ? 'text-[#1d1d1f]' : 'text-[#5f6368] hover:text-[#1d1d1f]'
                    }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeTabBubble"
                      className="absolute inset-0 bg-white rounded-full z-[-1]"
                      style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  {model.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* STATS HEADER */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full max-w-4xl mb-12">
          {activeModel.stats.map((stat, idx) => (
            <motion.div
              key={stat.label + activeModel.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              className="flex flex-col items-center text-center"
            >
              <span className="text-[#5f6368] text-[12px] md:text-[14px] font-medium mb-1">{stat.label}</span>
              <span className="text-[#1d1d1f] text-[20px] md:text-[26px] font-bold tracking-tight leading-none mb-1">{stat.value}</span>
              <span className="text-[#5f6368] text-[11px] md:text-[13px] leading-snug">{stat.subtext}</span>
            </motion.div>
          ))}
        </div>

        {/* SZCZEGÓŁOWE DANE TECHNICZNE (LEKKA TABELA W KOLUMNACH) */}
        <motion.div
          key={'specs-' + activeModel.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-full max-w-4xl mb-20 border-t border-b border-[#e5e5ea] py-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#e5e5ea]">
            {/* DŁUGOŚĆ */}
            <div className="flex flex-col items-center text-center py-6 md:py-0">
              <span className="text-[#1d1d1f] text-[16px] font-semibold mb-4">
                Długość garażu <span className="text-[#86868b] font-normal text-[14px] ml-1">(mm)</span>
              </span>
              <div className="flex flex-col gap-2 text-[15px] font-medium text-[#5f6368]">
                {activeModel.dimensions.lengths.map(l => <span key={l}>{l}</span>)}
              </div>
            </div>

            {/* SZEROKOŚĆ */}
            <div className="flex flex-col items-center text-center py-6 md:py-0">
              <span className="text-[#1d1d1f] text-[16px] font-semibold mb-4">
                Szerokość garażu <span className="text-[#86868b] font-normal text-[14px] ml-1">(mm)</span>
              </span>
              <div className="flex flex-col gap-2 text-[15px] font-medium text-[#5f6368]">
                {activeModel.dimensions.widths.map(w => <span key={w}>{w}</span>)}
              </div>
            </div>

            {/* WYSOKOŚĆ */}
            <div className="flex flex-col items-center text-center py-6 md:py-0">
              <span className="text-[#1d1d1f] text-[16px] font-semibold mb-4">
                Wysokość garażu <span className="text-[#86868b] font-normal text-[14px] ml-1">(mm)</span>
              </span>
              <div className="flex flex-col gap-2 text-[15px] font-medium text-[#5f6368]">
                {activeModel.dimensions.heights.map(h => <span key={h}>{h}</span>)}
              </div>
            </div>
          </div>
        </motion.div>

        {/* IMAGE */}
        <motion.div
          key={activeModel.id}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl aspect-[16/9] mt-auto rounded-[24px] overflow-hidden"
        >
          <img
            src={activeModel.image}
            alt={activeModel.name}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
