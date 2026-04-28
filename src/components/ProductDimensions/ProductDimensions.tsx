'use client';

import React from 'react';
import { motion } from 'framer-motion';
import ResponsiveAsset from '@/components/common/ResponsiveAsset';

import { useTranslations } from 'next-intl';

const ProductDimensions = () => {
  const t = useTranslations('productLayout.dimensions');
  
  const dimensions = [
    { label: t('height'), value: '1230 mm' },
    { label: t('width'), value: '1950 mm' },
    { label: t('depth'), value: '900 mm' },
  ];

  return (
    <section className="bg-black py-24 px-0 md:px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto px-[20px] md:px-0">
        {/* HEADER */}
        <div className="text-left md:text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="section-headline mb-12"
          >
            {t('title')}
          </motion.h2>

          {/* STATS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
            {dimensions.map((dim, index) => (
              <motion.div 
                key={dim.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="flex flex-col items-start md:items-center"
              >
                <span className="text-zinc-500 text-sm md:text-base font-medium mb-2 uppercase tracking-widest leading-none">
                  {dim.label}
                </span>
                <span className="text-white text-3xl md:text-4xl font-bold tracking-tight">
                  {dim.value}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* IMAGE CONTAINER - Moved outside max-w-6xl inner div to achieve 100% width on mobile */}
      <div className="max-w-6xl mx-auto px-0 md:px-0">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative w-full aspect-[1024/392] rounded-none md:rounded-3xl overflow-hidden bg-zinc-900/30 border-0 md:border md:border-white/5 shadow-none md:shadow-2xl group"
        >
          <ResponsiveAsset
            src="/assets/images/wiaty-stalowe-na-rowery/Wymiary_wiaty_na_rowery-min-scaled-1024x392.jpg"
            alt={t('drawingAlt')}
            type="image"
            className="w-full h-full object-contain p-4 md:p-12"
            priority={false}
          />
          
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
};

export default ProductDimensions;
