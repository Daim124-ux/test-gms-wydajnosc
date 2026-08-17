import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface ThresholdGridProps {
  highlightColor?: string;
  bgClass?: string;
  textColor?: string;
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 39, g: 121, b: 194 };
}

export default function ThresholdGrid({
  highlightColor = '#2779c2',
  bgClass = 'bg-black',
  textColor = 'text-white'
}: ThresholdGridProps) {
  const t = useTranslations('thresholdGrid');
  const rgb = hexToRgb(highlightColor);

  const maskFromClass = bgClass.includes('white')
    ? 'from-white'
    : bgClass.includes('f5f5f7')
      ? 'from-[#f5f5f7]'
      : 'from-black';

  const maskViaClass = bgClass.includes('white')
    ? 'via-white/80'
    : bgClass.includes('f5f5f7')
      ? 'via-[#f5f5f7]/80'
      : 'via-black/80';

  const features = [
    { title: t('features.magnets.title'), desc: t('features.magnets.desc') },
    { title: t('features.handle.title'), desc: t('features.handle.desc') },
    { title: t('features.tin.title'), desc: t('features.tin.desc') },
    { title: t('features.hinges.title'), desc: t('features.hinges.desc') },
    { title: t('features.bends.title'), desc: t('features.bends.desc') },
    { title: t('features.angle.title'), desc: t('features.angle.desc') },
  ];

  return (
    <section className={`relative ${bgClass} pt-0 pb-0 flex flex-col items-center overflow-hidden`}>
      {/* TOP EDGE MASK - Seamless Transition */}
      <div className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-b ${maskFromClass} to-transparent z-20 pointer-events-none`} />

      {/* BACKGROUND GRADIENTS - Atmospheric Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-[-10%] w-[60%] h-[60%] blur-[140px] rounded-full" style={{ backgroundColor: highlightColor, opacity: 0.15 }} />
        <div className="absolute top-1/4 right-[-10%] w-[60%] h-[60%] blur-[140px] rounded-full" style={{ backgroundColor: highlightColor, opacity: 0.15 }} />
        <div className="absolute bottom-[calc(10%+150px)] left-1/2 -translate-x-1/2 w-[120%] h-[60%] blur-[160px] rounded-[100%] opacity-85" style={{ backgroundColor: highlightColor, mixBlendMode: bgClass.includes('black') ? 'plus-lighter' : 'normal' as any }} />
      </div>

      {/* Grid of details */}
      <div className="relative z-30 max-w-7xl mx-auto px-[20px] md:px-6 grid grid-cols-1 md:grid-cols-3 gap-y-12 gap-x-12 mb-32">
        {features.map((f, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="flex flex-col items-start md:items-center text-left md:text-center group"
          >
            <h4 className="text-[22px] font-bold tracking-tight mb-2 transition-colors" style={{ color: highlightColor }}>
              {f.title}
            </h4>
            <p className={`${textColor} text-[12px] font-medium tracking-wide !lowercase opacity-80`}>
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
        className="relative z-30 pb-24 px-[20px] md:px-0"
      >
        <h3
          className={`text-[42px] md:text-[64px] font-[600] ${textColor} tracking-tighter text-left md:text-center mb-8`}
          style={{
            textShadow: `0 -35px 50px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.99), 0 -10px 30px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.99), 0 -5px 20px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.99), 0 10px 30px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8), 0 30px 50px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.7), 0 50px 70px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.6), 0 70px 90px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5), 0 90px 120px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4)`
          }}
        >
          {t('headline')}
        </h3>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-[#86868b] text-[18px] md:text-[21px] font-[600] leading-[1.5rem] text-left md:text-center tracking-tight"
        >
          {t('description')}
        </motion.p>
      </motion.div>

      {/* BOTTOM EDGE MASK */}
      <div className={`absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t ${maskFromClass} ${maskViaClass} to-transparent z-20 pointer-events-none`} />
    </section>
  );
}
