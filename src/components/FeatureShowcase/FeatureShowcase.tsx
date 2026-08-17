'use client';

import React, { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import ResponsiveAsset from '@/components/common/ResponsiveAsset';

interface FeatureShowcaseProps {
  titleTop?: string;
  titleGlow?: string;
  titleBottom?: string;
  videoUrl?: string;
  imageUrl?: string;
  description: string;
  videoTranslateX?: string;
  videoTranslateY?: string;
  titleTranslateY?: string;
  contentTranslateY?: string;
  gradientFrom?: string;
  fullWidth?: boolean;
  loop?: boolean;
  videoClassName?: string;
  glowRgb?: string;
  bgClass?: string;
  textColor?: string;
  descColor?: string;
}

export default function FeatureShowcase({
  titleTop,
  titleGlow,
  titleBottom,
  videoUrl,
  imageUrl,
  description,
  videoTranslateX = "0px",
  videoTranslateY = "0px",
  titleTranslateY = "0px",
  contentTranslateY = "0px",
  gradientFrom = "#161617",
  fullWidth = false,
  loop = true,
  videoClassName = "",
  glowRgb = "22, 96, 177",
  bgClass = "bg-black",
  textColor = "text-white",
  descColor = "text-[#86868b]"
}: FeatureShowcaseProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(videoRef, { once: true, amount: 0.3 });

  const [isDesktop, setIsDesktop] = React.useState(false);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  useEffect(() => {
    if (isInView && videoRef.current) {
      videoRef.current.play().catch(err => console.log("Video auto-play failed:", err));
    }
  }, [isInView]);

  const targetBg = bgClass.includes('white') ? 'white' : bgClass.includes('f5f5f7') ? '#f5f5f7' : 'black';
  const maskFromClass = bgClass.includes('white')
    ? 'from-white via-white/80'
    : bgClass.includes('f5f5f7')
      ? 'from-[#f5f5f7] via-[#f5f5f7]/80'
      : 'from-black via-black/80';

  const gradientStart = (gradientFrom === '#161617' || gradientFrom === 'transparent') ? targetBg : gradientFrom;

  return (
    <section className={`relative flex flex-col items-center justify-center text-center overflow-hidden ${bgClass} pb-0 pt-12 w-full`}>
      {/* Przejście gradientowe */}
      <div
        className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b pointer-events-none z-10"
        style={{ backgroundImage: `linear-gradient(to bottom, ${gradientStart}, ${targetBg})` }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
        className="relative z-20 flex flex-col items-start md:items-center mb-12 px-[20px] w-full"
        style={{ transform: isDesktop ? `translateY(${titleTranslateY})` : 'none' }}
      >
        <h2 className={`text-[48px] md:text-[80px] font-[600] ${textColor} leading-[1.0] tracking-tight text-left md:text-center w-full`}>
          {titleTop && <>{titleTop}<br /></>}
          {titleGlow && (
            <span
              className="glow-text inline-block"
              style={{
                position: 'relative',
                zIndex: 10,
                textShadow: `0 -35px 50px rgba(${glowRgb}, 0.99), 0 -10px 30px rgba(${glowRgb}, 0.99), 0 -5px 20px rgba(${glowRgb}, 0.99), 0 10px 30px rgba(${glowRgb}, 0.8), 0 30px 50px rgba(${glowRgb}, 0.7), 0 50px 70px rgba(${glowRgb}, 0.6), 0 70px 90px rgba(${glowRgb}, 0.5), 0 90px 120px rgba(${glowRgb}, 0.4)`
              }}
            >
              {titleGlow}
            </span>
          )}
          {titleBottom && <><br />{titleBottom}</>}
        </h2>
      </motion.div>

      {/* VIDEO / IMAGE LAYER */}
      <div
        className={`relative z-10 overflow-hidden ${videoClassName} ${
          fullWidth 
            ? 'w-[180vw] left-1/2 -translate-x-1/2 md:w-full md:left-0 md:translate-x-0' 
            : 'w-full max-w-7xl mx-auto rounded-2xl shadow-2xl'
        }`}
        style={{ 
          transform: isDesktop 
            ? `translate(${videoTranslateX}, ${videoTranslateY})` 
            : (fullWidth ? 'translateX(22.5%)' : 'none') 
        }}
      >
        {/* Maski boczne - efekt rozmycia krawędzi */}
        {fullWidth && (
          <>
            <div className={`absolute inset-y-0 left-0 w-48 md:w-[25vw] bg-gradient-to-r ${maskFromClass} to-transparent z-20 pointer-events-none`} />
            <div className={`absolute inset-y-0 right-0 w-48 md:w-[25vw] bg-gradient-to-l ${maskFromClass} to-transparent z-20 pointer-events-none`} />
          </>
        )}

        <ResponsiveAsset
          ref={videoRef}
          src={videoUrl || imageUrl || ''}
          type={videoUrl ? "video" : "image"}
          muted
          playsInline
          priority
          loop={loop}
          className="w-full h-auto"
        />
      </div>

      {/* TEXT LAYER */}
      <div
        className="relative z-10 w-full max-w-[1280px] mx-auto mt-4 pb-32"
        style={{ transform: isDesktop ? `translateY(${contentTranslateY})` : 'none' }}
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className={`${descColor} text-[18px] md:text-[21px] font-[600] leading-[1.5rem] text-left md:text-center tracking-tight px-[20px] md:px-0`}
        >
          {description}
        </motion.p>
      </div>
    </section>
  );
}
