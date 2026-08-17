'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import ResponsiveAsset from '@/components/common/ResponsiveAsset';
import { useTranslations } from 'next-intl';

interface ConfiguratorPromoProps {
  highlightColor?: string;
  bgClass?: string;
  textColor?: string;
}

const ConfiguratorPromo = ({
  highlightColor = '#2779c2',
  bgClass = 'bg-black',
  textColor = 'text-zinc-300'
}: ConfiguratorPromoProps) => {
  const t = useTranslations('configuratorPromo');
  const tc = useTranslations('common');

  return (
    <section className={`${bgClass} pb-16 px-6 relative overflow-hidden`}>
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* CONFIGURATOR PREVIEW IMAGE */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative w-full aspect-[1024/491] rounded-3xl overflow-hidden border border-black/10 dark:border-white/10 shadow-2xl mb-12"
        >
          <ResponsiveAsset
            src="/assets/images/wiaty-stalowe-na-rowery/Wiata_konfigurator-1024x491.jpg"
            alt={t('title')}
            className="object-cover"
          />
        </motion.div>

        {/* DESCRIPTION TEXT */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={`${textColor} text-lg md:text-xl text-center max-w-4xl leading-relaxed mb-12`}
        >
          {t('description')}
        </motion.p>

        {/* CTA BUTTON - Glowing Aura Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative"
        >
          {/* Pulsing glow background */}
          <motion.div
            animate={{
              boxShadow: [`0 0 20px ${highlightColor}66`, `0 0 40px ${highlightColor}b3`, `0 0 20px ${highlightColor}66`],
              scale: [1, 1.02, 1]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full blur-xl"
            style={{ backgroundColor: `${highlightColor}33` }}
          />

          <motion.button
            initial={{ backgroundColor: `${highlightColor}1a`, borderColor: `${highlightColor}80` }}
            whileHover={{ scale: 1.05, boxShadow: `0 0 50px ${highlightColor}cc`, backgroundColor: highlightColor, borderColor: 'rgba(0,0,0,0)' }}
            whileTap={{ scale: 0.95 }}
            className="relative flex items-center gap-3 px-10 py-5 rounded-full border text-white font-bold text-lg transition-all group overflow-hidden"
          >
            {/* Liquid shine effect on hover */}
            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <ShoppingBag size={22} className="group-hover:scale-110 transition-transform" />
            <span className="relative z-10">{tc('goToShop')}</span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default ConfiguratorPromo;
