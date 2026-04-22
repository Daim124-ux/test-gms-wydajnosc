'use client';

import React, { useRef, useEffect } from 'react';
import { motion, useTransform, useMotionValue } from 'framer-motion';

interface AppleHeroEntranceProps {
  videoUrl?: string;
}

export default function AppleHeroEntrance({ videoUrl }: AppleHeroEntranceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollValue = useMotionValue(0);

  const resolveS3Url = (url?: string) => {
    if (!url) return undefined;
    if (url.startsWith('http')) return url;
    
    // Używamy CDN dla ciężkich plików hero, jeśli to lokalna ścieżka
    const CLOUDFRONT_URL = 'https://d1moyf5ccth9x8.cloudfront.net';
    const cleanSrc = url.startsWith('/') ? url.slice(1) : url;
    return `${CLOUDFRONT_URL}/_optimized/${cleanSrc}`;
  };

  const resolvedVideoUrl = resolveS3Url(videoUrl);

  // SILNIK WIDEO (Tylko dla desktopu)
  useEffect(() => {
    let reqId: number;
    const handleScroll = () => {
      if (window.innerWidth < 768) return;

      const video = videoRef.current;
      const container = containerRef.current;
      if (!video || !container) return;

      reqId = requestAnimationFrame(() => {
        const { top, height } = container.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const scrollDistance = height - windowHeight;
        if (scrollDistance <= 0) return;

        const progress = Math.max(0, Math.min(1, -top / scrollDistance));

        if (video.duration && isFinite(video.duration)) {
          const targetTime = progress * video.duration;
          if (Math.abs(video.currentTime - targetTime) > 0.01) {
            video.currentTime = targetTime;
          }
        }
        scrollValue.set(progress);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (reqId) cancelAnimationFrame(reqId);
    };
  }, [scrollValue]);

  const handleLoadedMetadata = () => {
    if (videoRef.current && window.innerWidth >= 768) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0.001;
    }
  };

  // CHOREOGRAFIA ZBIEŻNA (Desktop Only)
  const line3Y = useTransform(scrollValue, [0.1, 0.9], ["0px", "-58vh"]);
  const exitY = useTransform(scrollValue, [0.85, 1], ["0px", "65vh"]);
  const groupScale = useTransform(scrollValue, [0.85, 1], [1, 1]);
  const groupOpacity = useTransform(scrollValue, [0.95, 1], [1, 1]);

  const glowTextStyle = {
    textShadow: `
      0 -35px 50px rgba(22, 96, 177, 0.99), 
      0 -10px 30px rgba(22, 96, 177, 0.99), 
      0 -5px 20px rgba(22, 96, 177, 0.99),  
      0 10px 30px rgba(22, 96, 177, 0.8),   
      0 30px 50px rgba(22, 96, 177, 0.7),   
      0 50px 70px rgba(22, 96, 177, 0.6),
      0 70px 90px rgba(22, 96, 177, 0.5),
      0 90px 120px rgba(22, 96, 177, 0.4)
    `
  };

  return (
    <div ref={containerRef} className="relative w-full bg-black">

      {/* ================================================================= */}
      {/* 📱 WERSJA MOBILE (Autoplay Hero - Isolated)                       */}
      {/* ================================================================= */}
      <div className="block md:hidden relative h-[75vh] w-full overflow-hidden bg-black">
        <div className="absolute inset-0 flex items-center justify-center z-0">
          <motion.div
            initial={{ y: -60 }}
            className="w-full flex items-center justify-center"
          >
            {resolvedVideoUrl && (
              <video
                src={resolvedVideoUrl}
                autoPlay
                loop={false}
                muted
                playsInline
                className="w-[210vw] max-w-none h-auto aspect-video opacity-80"
              />
            )}
          </motion.div>
        </div>

        <div className="relative z-30 h-full w-full flex flex-col items-center pt-[15vh] px-6 pointer-events-none -translate-y-[60px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.9, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <span className="text-[28px] font-semibold tracking-tight text-center inner-shine-text" style={{ animationDelay: '2.9s' }}>
              Wiata stalowa
            </span>
            <h1 className="text-[52px] font-semibold tracking-tight leading-none text-center font-sans mt-[250px] inner-shine-text" style={{ animationDelay: '2.9s' }}>
              na rowery
            </h1>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-[40vh] pointer-events-none z-10 
          bg-gradient-to-t from-[#161617] via-[#161617]/95 via-[#161617]/40 to-transparent" />
      </div>

      {/* ================================================================= */}
      {/* 🖥️ WERSJA DESKTOP (Restored from Master)                          */}
      {/* ================================================================= */}
      <div className="hidden md:block">
        <div className="relative w-full h-[400vh]">
          <div className="sticky top-0 h-screen w-full overflow-hidden z-0 bg-black">
            {resolvedVideoUrl && (
              <video
                ref={videoRef}
                src={resolvedVideoUrl}
                muted playsInline preload="auto"
                onLoadedMetadata={handleLoadedMetadata}
                className="w-full h-full object-cover opacity-80"
              />
            )}
          </div>
        </div>

        <div className="relative w-full h-[400vh] -mt-[400vh] pointer-events-none z-20">
          <div className="sticky top-0 h-screen w-full">
            <motion.div
              style={{ scale: groupScale, opacity: groupOpacity, y: exitY }}
              className="relative w-full h-full flex flex-col items-center"
            >
              <div className="absolute top-[80px] flex flex-col items-center px-4 w-full h-fit">
                <span className="text-[32px] md:text-[40px] font-semibold tracking-tight text-[#2779c2] scale-[1.15] text-center drop-shadow-[0_0_10px_rgba(22,96,177,0.3)]">
                  Wiata stalowa
                </span>
                <h1 className="text-[64px] md:text-[110px] font-semibold tracking-tight leading-none text-[#2779c2] drop-shadow-[0_0_60px_rgba(39,121,194,0.4)] text-center font-sans -mt-4">
                  na rowery
                </h1>
              </div>

              <motion.div
                style={{ y: line3Y }}
                className="absolute bottom-[100px] flex justify-center px-4 w-full h-fit items-center"
              >
                <span
                  style={glowTextStyle}
                  className="relative z-10 text-[32px] font-[600] tracking-[2px] text-[#2779c2] text-center whitespace-nowrap"
                >
                  Nasz rouler przechowywania.
                </span>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-[25vh] pointer-events-none z-10 backdrop-blur-[4px]">
          <div className="absolute inset-x-0 bottom-0 h-full opacity-40" style={{ background: 'radial-gradient(circle at 50% 100%, rgba(39, 121, 194, 0.2) 0%, transparent 50%)' }} />
          <div className="absolute inset-x-0 bottom-0 h-full" style={{ background: `linear-gradient(to bottom, rgba(22, 22, 23, 0) 0%, rgba(22, 22, 23, 0) 40%, rgba(22, 22, 23, 0.1) 60%, rgba(22, 22, 23, 0.4) 80%, rgba(22, 22, 23, 0.8) 92%, #161617 100%)` }} />
        </div>
      </div>
    </div>
  );
}
