'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FileText, Download, Briefcase, ChevronRight, ShieldCheck } from 'lucide-react';

const b2bCards = [
  {
    icon: <Briefcase className="w-8 h-8" />,
    title: 'Zostań dystrybutorem',
    description: 'Dołącz do naszej sieci i oferuj produkty GMS System. Gwarantujemy wsparcie marketingowe.',
    link: '/wspolpraca',
    linkText: 'Dowiedz się więcej'
  },
  {
    icon: <FileText className="w-8 h-8" />,
    title: 'Strefa Architekta',
    description: 'Pliki DWG, modele 3D, specyfikacje techniczne i atesty niezbędne do projektowania.',
    link: '/do-pobrania',
    linkText: 'Pobierz materiały'
  },
  {
    icon: <Download className="w-8 h-8" />,
    title: 'Katalogi i cenniki',
    description: 'Aktualne katalogi produktowe oraz cenniki dedykowane dla partnerów biznesowych.',
    link: '/do-pobrania',
    linkText: 'Zobacz katalogi'
  }
];

export default function HomeB2BAndDocs() {
  return (
    <section className="relative w-full py-32 bg-[#050505] overflow-hidden flex flex-col items-center justify-center text-center border-t border-white/5">
      
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 flex flex-col items-center">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold tracking-widest text-[#ff6b00] uppercase mb-8"
        >
          Partnerzy B2B
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-semibold tracking-tighter text-white mb-6 max-w-4xl"
        >
          Strefa biznesu. <span className="text-gray-500">Materiały dla profesjonalistów.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-400 max-w-2xl font-light mb-16 text-pretty"
        >
          Współpracujemy z deweloperami, architektami oraz dystrybutorami. Udostępniamy pełną dokumentację i profesjonalne doradztwo.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-20">
          {b2bCards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + idx * 0.1, duration: 0.6 }}
            >
              <div className="bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 rounded-3xl p-10 h-full flex flex-col items-center text-center">
                <div className="bg-[#ff6b00]/10 border border-[#ff6b00]/20 w-16 h-16 rounded-2xl flex items-center justify-center text-[#ff6b00] mb-8">
                  {card.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-white tracking-tight">{card.title}</h3>
                <p className="text-gray-400 font-light mb-8 flex-grow">
                  {card.description}
                </p>
                <Link 
                  href={card.link}
                  className="inline-flex items-center text-[#ff6b00] hover:text-[#ff8533] font-semibold group"
                >
                  {card.linkText}
                  <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Certificates Ribbon */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="w-full flex flex-col items-center"
        >
          <p className="text-gray-500 uppercase tracking-widest text-xs font-semibold mb-8 text-center">Certyfikowana jakość produktów</p>
          <div className="flex flex-wrap justify-center gap-12 opacity-40 hover:opacity-100 transition-opacity duration-500">
            <div className="flex items-center gap-2 font-bold text-2xl text-white"><ShieldCheck className="w-8 h-8 text-[#ff6b00]" /> CE</div>
            <div className="flex items-center gap-2 font-bold text-2xl text-white"><ShieldCheck className="w-8 h-8 text-[#ff6b00]" /> ISO 9001</div>
            <div className="flex items-center gap-2 font-bold text-2xl text-white"><ShieldCheck className="w-8 h-8 text-[#ff6b00]" /> PZH</div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
