'use client';

import React, { useRef, useEffect } from 'react';
import { motion, useTransform, useMotionValue } from 'framer-motion';
import ResponsiveAsset from '@/components/common/ResponsiveAsset';

interface AppleHeroEntranceProps {
  videoUrl?: string;
}

export default function AppleHeroEntrance({ videoUrl }: AppleHeroEntranceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollValue = useMotionValue(0);

  // SILNIK WIDEO
  useEffect(() => {
    let reqId: number;
    const handleScroll = () => {
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
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0.001;
    }
  };

  // CHOREOGRAFIA ZBIEŻNA (Convergence)
  // Dolny napis: Startuje z bottom: 100px (y: 0) i jedzie do góry (y: ujemne)
  const line3Y = useTransform(
    scrollValue,
    [0.1, 0.9],
    ["0px", "-58vh"] // Przywrócone do -58vh
  );

  // Animacja wyjściowa: Spokojny zjazd na dół widocznego ekranu (viewportu)
  const exitY = useTransform(
    scrollValue,
    [0.85, 1],
    ["0px", "65vh"]
  );

  const groupScale = useTransform(scrollValue, [0.85, 1], [1, 1]);
  const groupOpacity = useTransform(scrollValue, [0.95, 1], [1, 1]);
  const textOpacity = 1;

  // Specyfikacja .glow-text od użytkownika
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

      {/* WIDEO LAYER */}
      <div className="relative w-full h-[400vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden z-0 bg-black">
          {videoUrl && (
            <ResponsiveAsset
              ref={videoRef}
              src={videoUrl}
              type="video"
              autoPlay={false}
              muted
              playsInline
              priority
              onLoadedMetadata={handleLoadedMetadata}
              className="w-full h-full object-cover opacity-80"
            />
          )}
        </div>
      </div>

      {/* TEKST LAYER */}
      <div className="relative w-full h-[400vh] -mt-[400vh] pointer-events-none z-20">
        <div className="sticky top-0 h-screen w-full">
          <motion.div
            style={{ scale: groupScale, opacity: groupOpacity, y: exitY }}
            className="relative w-full h-full flex flex-col items-center"
          >
            {/* GRUPA GÓRNA (Wiata + na rowery) */}
            <div className="absolute top-[80px] flex flex-col items-center px-4 w-full h-fit">
              <span className="text-[32px] md:text-[40px] font-semibold tracking-tight text-[#2779c2] scale-[1.15] text-center drop-shadow-[0_0_10px_rgba(22,96,177,0.3)]">
                Wiata stalowa
              </span>
              <h1 className="text-[64px] md:text-[110px] font-semibold tracking-tight leading-none text-[#2779c2] drop-shadow-[0_0_60px_rgba(39,121,194,0.4)] text-center font-sans -mt-4">
                na rowery
              </h1>
            </div>

            {/* LINIA DOLNA (Glow-Text) */}
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

      {/* EFEKT "STUDIO FLOOR" - Bardzo miękkie przejście (Easing Gradient) */}
      <div className="absolute bottom-0 left-0 w-full h-[25vh] pointer-events-none z-10 backdrop-blur-[4px]">
        {/* Glow pod produktem (Radialny, żeby nadać głębi - nieco subtelniejszy) */}
        <div 
          className="absolute inset-x-0 bottom-0 h-full opacity-40"
          style={{
            background: 'radial-gradient(circle at 50% 100%, rgba(39, 121, 194, 0.2) 0%, transparent 50%)'
          }}
        />
        {/* Bardzo miękki gradient - jeszcze dłuższą strefą przeźroczystości (likwidacja linii odcięcia) */}
        <div 
          className="absolute inset-x-0 bottom-0 h-full"
          style={{
            background: `linear-gradient(to bottom, 
              rgba(22, 22, 23, 0) 0%, 
              rgba(22, 22, 23, 0) 40%, 
              rgba(22, 22, 23, 0.1) 60%, 
              rgba(22, 22, 23, 0.4) 80%, 
              rgba(22, 22, 23, 0.8) 92%, 
              #161617 100%)`
          }}
        />
      </div>
    </div>
  );
}
