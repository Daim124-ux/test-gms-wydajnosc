'use client';

import React from 'react';
import { motion } from 'framer-motion';

const features = [
  { title: 'Neodymowe magnesy', desc: 'zamontowane na bokach klapy' },
  { title: 'Materiałowy pochwyt', desc: 'ułatwiający otwieranie' },
  { title: 'Ocynowana', desc: 'klapa' },
  { title: 'Przykręcane zawiasy', desc: 'gwarantujące trwałość' },
  { title: 'Wzmacniające gięcia', desc: 'usztywniające próg' },
  { title: 'Wyprofilowany kąt', desc: 'dla prostszego wjazdu' },
];

export default function ThresholdGrid() {
  return (
    <section className="relative bg-black pt-12 pb-0 flex flex-col items-center overflow-hidden">
      {/* TOP EDGE MASK - Seamless Transition */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black to-transparent z-20 pointer-events-none" />

      {/* BACKGROUND GRADIENTS - Atmospheric Glow (Expansive for text transition) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-[-10%] w-[60%] h-[60%] bg-blue-600/15 blur-[140px] rounded-full" />
        <div className="absolute top-1/4 right-[-10%] w-[60%] h-[60%] bg-blue-500/15 blur-[140px] rounded-full" />
        {/* Large glow centered behind 'Kolarska wytrzymałość' and the start of the paragraph */}
        <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[120%] h-[60%] bg-blue-600/30 blur-[160px] rounded-[100%] opacity-80" />
      </div>

      {/* Grid of details */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-y-12 gap-x-12 mb-32">
        {features.map((f, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center group"
          >
            <h4 className="!text-[#2779c2] text-[22px] font-bold tracking-tight mb-2 transition-colors">
              {f.title}
            </h4>
            <p className="!text-white text-[12px] font-medium tracking-wide !lowercase">
              {f.desc}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Large Glow Footer */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] as const }}
        viewport={{ once: true }}
        className="relative z-30 pb-24"
      >
        <h3 
          className="text-[60px] md:text-[80px] font-[600] text-white tracking-tighter text-center mb-8"
          style={{ 
            textShadow: '0 -35px 50px rgba(22, 96, 177, 0.99), 0 -10px 30px rgba(22, 96, 177, 0.99), 0 -5px 20px rgba(22, 96, 177, 0.99), 0 10px 30px rgba(22, 96, 177, 0.8), 0 30px 50px rgba(22, 96, 177, 0.7), 0 50px 70px rgba(22, 96, 177, 0.6), 0 70px 90px rgba(22, 96, 177, 0.5), 0 90px 120px rgba(22, 96, 177, 0.4)'
          }}
        >
          Kolarska wytrzymałość.
        </h3>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-[#86868b] text-[18px] md:text-[21px] font-[600] leading-[1.5rem] text-center tracking-tight"
        >
          Konstrukcja wiaty na rowery została zaprojektowana z myślą o maksymalnej
          wytrzymałości i trwałości. Kluczowym elementem wzmacniającym są autorskie
          trójkąty połączone z ceownikami, które zostały opracowane i wyprodukowane we
          własnym zakresie. To rozwiązanie zapewnia niezwykłą sztywność i stabilność
          poszczególnych komponentów klapy. Ściany wiaty są z kolei połączone za
          pomocą regulowanych trójkątów, co umożliwia precyzyjne dopasowanie i
          montaż. Dodatkowe wzmocnienie zapewniają stalowe narożniki, wycinane na
          maszynach CNC, które nie tylko zwiększają sztywność ścian, ale także trwale
          zabezpieczają wszystkie połączenia. To innowacyjne podejście, które gwarantuje
          niezawodność na lata.
        </motion.p>
      </motion.div>

      {/* BOTTOM EDGE MASK - Płynne zagaszenie poświaty do całkowitej czerni */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black via-black/80 to-transparent z-20 pointer-events-none" />
    </section>
  );
}
