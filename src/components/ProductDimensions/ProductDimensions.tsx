'use client';

import React from 'react';
import { motion } from 'framer-motion';
import ResponsiveAsset from '@/components/common/ResponsiveAsset';

const ProductDimensions = () => {
  const dimensions = [
    { label: 'Wysokość', value: '1230 mm' },
    { label: 'Szerokość', value: '1950 mm' },
    { label: 'Głębokość', value: '900 mm' },
  ];

  return (
    <section className="bg-black py-24 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="section-headline mb-12"
          >
            Wymiary wiaty na rowery
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
                className="flex flex-col items-center"
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

        {/* IMAGE CONTAINER */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative w-full aspect-[1024/392] rounded-3xl overflow-hidden bg-zinc-900/30 border border-white/5 shadow-2xl group"
        >
          <ResponsiveAsset
            src="/assets/images/wiaty-stalowe-na-rowery/Wymiary_wiaty_na_rowery-min-scaled-1024x392.jpg"
            alt="Wymiary wiaty na rowery - rysunek techniczny"
            type="image"
            className="w-full h-full object-contain p-8 md:p-12"
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
