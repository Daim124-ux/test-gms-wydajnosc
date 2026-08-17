'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface LifestyleDescriptionProps {
  bgClass?: string;
  textColor?: string;
  accentTextColor?: string;
  borderColor?: string;
}

const LifestyleDescription = ({
  bgClass = 'bg-black',
  textColor = 'text-zinc-400',
  accentTextColor = 'text-white',
  borderColor = 'border-white/5',
}: LifestyleDescriptionProps) => {
  const t = useTranslations('productLayout.lifestyle');
  const tc = useTranslations('configuratorPromo');

  return (
    <section className={`${bgClass} pt-2 pb-5 px-6 relative overflow-hidden`}>
      <div className="max-w-6xl mx-auto">
        <div className={`space-y-8 ${textColor} text-lg md:text-xl leading-relaxed font-medium`}>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {t('p1')}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {t('p2')}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={`font-bold ${accentTextColor}`}
          >
            {t('p3')}
          </motion.p>
        </div>

        {/* SECTION HEADING */}
        <div className={`mt-16 mb-0 pt-16 border-t ${borderColor} text-left`}>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-headline"
          >
            {tc('title')}
          </motion.h2>
        </div>
      </div>
    </section>
  );
};

export default LifestyleDescription;
