'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function AluminumFloor() {
  return (
    <section className="relative w-full bg-black overflow-hidden flex flex-col">
      {/* Background Image - Adjusted height with procedural bottom mask */}
      <div 
        className="relative w-full max-h-[800px] md:max-h-[1050px] z-0 overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 75%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 75%, rgba(0,0,0,0) 100%)'
        }}
      >
        <Image
          src="/assets/images/wiaty-stalowe-na-rowery/Reka-z-kotwa-fade-min.jpg"
          alt="Aluminiowa podłoga - montaż"
          width={1920}
          height={1080}
          className="w-full h-full object-cover object-top block"
          priority
        />
        {/* Cinematic Overlays (Atmospheric) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/10" />
        
        {/* Content Overlay - Absolute over the image */}
        <div className="absolute inset-0 z-20 w-full h-full flex flex-col justify-start p-6 md:p-20">
          {/* Top-Left: Massive Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          >
            <h2 className="text-[48px] md:text-[80px] font-[600] text-white leading-[1.1] tracking-tighter">
              Aluminiowa<br />podłoga
            </h2>
          </motion.div>

          {/* Technical Details - Anchored position */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            viewport={{ once: true }}
            className="self-end text-right mt-[140px] md:mt-[340px]"
          >
            <div className="max-w-[320px] sm:max-w-2xl md:max-w-[1000px] xl:max-w-[1200px]">
              <h3 className="text-white text-[18px] md:text-[21px] font-[600] mb-2 md:mb-6 tracking-tight leading-[1.5rem]">
                mocowana do gruntu za pomocą nierdzewnych kotew.
              </h3>
              <p className="text-[#86868b] text-[16px] md:text-[21px] font-[600] leading-[1.6] tracking-tight">
                W wiacie rowerowej istnieje możliwość zamontowania aluminiowej podłogi, 
                która skutecznie zapobiega wzrostowi niechcianej roślinności, 
                szczególnie w przypadku montażu na kostce brukowej. Podłoga została 
                zaprojektowana w taki sposób, aby kotwienie wiaty odbywało się przez 
                te same otwory, co w wersji bez podłogi. Dzięki temu można łatwo 
                doposażyć wiatę w tę opcję w dowolnym momencie, gdy uznamy, że jest to potrzebne.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
