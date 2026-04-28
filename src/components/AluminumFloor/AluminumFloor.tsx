'use client';

import React from 'react';
import { motion } from 'framer-motion';
import ResponsiveAsset from '@/components/common/ResponsiveAsset';

import { useTranslations } from 'next-intl';

export default function AluminumFloor() {
  const t = useTranslations('productLayout.aluminumFloor');

  return (
    <section className="relative w-full bg-black flex flex-col">
      {/* Title moved OUTSIDE the background container to avoid clipping */}
      <div className="relative z-30 w-full px-6 md:p-20 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="pointer-events-auto"
        >
          <h2 
            className="text-[48px] md:text-[80px] font-[600] text-white leading-[1.1] tracking-tighter mt-[-200px] md:mt-0 relative z-[999]"
            dangerouslySetInnerHTML={{ __html: t.raw('title').replace(' ', '<br />') }}
          />
        </motion.div>
      </div>

      {/* Background Image Container */}
      <div
        className="relative w-full h-[850px] md:h-[900px] lg:h-[1050px] z-0 overflow-hidden mt-[-200px] md:mt-0"
        style={{
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 80%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 80%, rgba(0,0,0,0) 100%)'
        }}
      >
        <ResponsiveAsset
          src="/assets/images/wiaty-stalowe-na-rowery/Reka-z-kotwa-fade-min.jpg"
          alt={t('title')}
          type="image"
          priority
          className="w-full h-full object-cover object-[center_115px] md:object-top block"
        />
        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/20" />

        {/* Content Overlay */}
        <div className="absolute inset-0 z-20 w-full h-full flex flex-col justify-end p-6 md:p-20">
          {/* Bottom-Right Description */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            viewport={{ once: true }}
            className="self-end text-right mt-auto mb-12 md:mb-0"
          >
            <div className="max-w-[320px] sm:max-w-xl md:max-w-3xl">
              <h3 className="text-white text-[18px] md:text-[21px] font-[600] mb-2 md:mb-6 tracking-tight leading-snug">
                {t('subtitle')}
              </h3>
              <p className="text-[#86868b] text-[16px] md:text-[21px] font-[600] leading-[1.6] tracking-tight">
                {t('description')}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>

  );
}
