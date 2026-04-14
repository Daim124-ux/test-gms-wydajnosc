'use client';

import React, { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

interface FeatureShowcaseProps {
  titleTop?: string;
  titleGlow?: string;
  titleBottom?: string;
  videoUrl: string;
  description: string;
  videoTranslateX?: string;
  videoTranslateY?: string;
  titleTranslateY?: string;
  contentTranslateY?: string;
  gradientFrom?: string;
  fullWidth?: boolean;
}

export default function FeatureShowcase({
  titleTop,
  titleGlow,
  titleBottom,
  videoUrl,
  description,
  videoTranslateX = "0px",
  videoTranslateY = "0px",
  titleTranslateY = "0px",
  contentTranslateY = "0px",
  gradientFrom = "#161617",
  fullWidth = false
}: FeatureShowcaseProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(videoRef, { once: true, amount: 0.3 });

  useEffect(() => {
    if (isInView && videoRef.current) {
      videoRef.current.play().catch(err => console.log("Video auto-play failed:", err));
    }
  }, [isInView]);

  return (
    <section className="relative flex flex-col items-center justify-center text-center overflow-hidden bg-black pb-0 pt-12">
      {/* Przejście gradientowe */}
      <div 
        className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b" 
        style={{ backgroundImage: `linear-gradient(to bottom, ${gradientFrom}, black)` }}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-20 flex flex-col items-center mb-12 px-4"
        style={{ transform: `translateY(${titleTranslateY})` }}
      >
        <h2 className="text-[48px] md:text-[80px] font-[600] text-white leading-[1.0] tracking-tight text-center">
          {titleTop && <>{titleTop}<br /></>}
          {titleGlow && (
            <span 
              className="glow-text inline-block"
              style={{ 
                position: 'relative', 
                zIndex: 10,
                textShadow: '0 -35px 50px rgba(22, 96, 177, 0.99), 0 -10px 30px rgba(22, 96, 177, 0.99), 0 -5px 20px rgba(22, 96, 177, 0.99), 0 10px 30px rgba(22, 96, 177, 0.8), 0 30px 50px rgba(22, 96, 177, 0.7), 0 50px 70px rgba(22, 96, 177, 0.6), 0 70px 90px rgba(22, 96, 177, 0.5), 0 90px 120px rgba(22, 96, 177, 0.4)'
              }}
            >
              {titleGlow}
            </span>
          )}
          {titleBottom && <><br />{titleBottom}</>}
        </h2>
      </motion.div>

      {/* VIDEO LAYER */}
      <div 
        className={`relative z-10 overflow-hidden ${fullWidth ? 'w-screen' : 'w-full max-w-7xl mx-auto rounded-2xl shadow-2xl'}`}
        style={{ transform: `translate(${videoTranslateX}, ${videoTranslateY})` }}
      >
        {/* Maski boczne - efekt rozmycia krawędzi (wzmocnione - widoczne tylko przy fullWidth) */}
        {fullWidth && (
          <>
            <div className="absolute inset-y-0 left-0 w-48 md:w-[25vw] bg-gradient-to-r from-black via-black/80 to-transparent z-20 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-48 md:w-[25vw] bg-gradient-to-l from-black via-black/80 to-transparent z-20 pointer-events-none" />
          </>
        )}

        <video
          ref={videoRef}
          src={videoUrl}
          muted
          playsInline
          preload="auto"
          className="w-full h-auto"
        />
      </div>

      {/* TEXT LAYER */}
      <div 
        className="relative z-10 w-full max-w-[1280px] mx-auto mt-4 pb-32"
        style={{ transform: `translateY(${contentTranslateY})` }}
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-[#86868b] text-[18px] md:text-[21px] font-[600] leading-[1.5rem] text-center tracking-tight px-4 md:px-0"
        >
          {description}
        </motion.p>
      </div>
    </section>
  );
}
