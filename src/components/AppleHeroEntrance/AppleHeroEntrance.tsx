'use client';

import React, { useRef, useEffect } from 'react';
import { motion, useTransform, useMotionValue } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface AppleHeroEntranceProps {
  videoUrl?: string;
  imageUrl?: string;
  title?: string;
  subtitle?: string;
  textColor?: string;
  glowColor?: string;
  layoutVariant?: 'center-split' | 'top-right';
  bottomGradientMode?: 'dark' | 'light' | 'none';
}

export default function AppleHeroEntrance({ videoUrl, imageUrl, title, subtitle, textColor, glowColor, layoutVariant = 'center-split', bottomGradientMode = 'dark' }: AppleHeroEntranceProps) {
  const t = useTranslations('hero');
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollValue = useMotionValue(0);

  const activeTitle = title || t('title');
  const activeSubtitle = subtitle || t('subtitle');
  const activeTextColor = textColor || '#2779c2';
  const activeGlowColor = glowColor || 'rgba(22, 96, 177, 0.99)';

  const resolveS3Url = (url?: string) => {
    if (!url) return undefined;
    if (url.startsWith('http')) return url;
    
    // Na Vercelu (w produkcji) pliki multimedialne pobieramy z szybkiego CDN CloudFront
    const CLOUDFRONT_URL = 'https://d1moyf5ccth9x8.cloudfront.net';
    const cleanSrc = url.startsWith('/') ? url.slice(1) : url;

    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      return url;
    }

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

        // Filmik kończy odtwarzanie przy 85% dystansu przewijania, pozostając sticky na końcowej klatce
        const videoProgress = Math.min(1, progress / 0.85);

        let duration = video.duration;
        if (!duration || !isFinite(duration) || duration <= 0) {
          if (video.seekable && video.seekable.length > 0) {
            duration = video.seekable.end(0);
          }
        }
        if (!duration || !isFinite(duration) || duration <= 0) {
          duration = 3.966;
        }

        const targetTime = videoProgress * duration;
        if (Math.abs(video.currentTime - targetTime) > 0.01) {
          video.currentTime = targetTime;
        }
        scrollValue.set(progress);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    const video = videoRef.current;
    if (video) {
      if (video.readyState >= 1 && window.innerWidth >= 768) {
        video.pause();
        handleScroll();
      }
      video.addEventListener('loadedmetadata', handleScroll);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (video) video.removeEventListener('loadedmetadata', handleScroll);
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
      0 -35px 50px ${activeGlowColor}, 
      0 -10px 30px ${activeGlowColor}, 
      0 -5px 20px ${activeGlowColor},  
      0 10px 30px ${activeGlowColor.replace('0.99', '0.8')},   
      0 30px 50px ${activeGlowColor.replace('0.99', '0.7')},   
      0 50px 70px ${activeGlowColor.replace('0.99', '0.6')},
      0 70px 90px ${activeGlowColor.replace('0.99', '0.5')},
      0 90px 120px ${activeGlowColor.replace('0.99', '0.4')}
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
            className="w-full h-full flex items-center justify-center"
          >
            {resolvedVideoUrl ? (
              <video
                src={resolvedVideoUrl}
                autoPlay
                loop={false}
                muted
                playsInline
                className="w-[210vw] max-w-none h-auto aspect-video opacity-80"
              />
            ) : imageUrl ? (
              <img
                src={imageUrl}
                className="w-full h-full object-cover opacity-80"
                alt="Hero background image"
              />
            ) : null}
          </motion.div>
        </div>

        <div className="relative z-30 h-full w-full flex flex-col items-center pt-[15vh] px-6 pointer-events-none -translate-y-[60px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.9, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <span className="text-[28px] font-semibold tracking-tight text-center inner-shine-text" style={{ animationDelay: '2.9s', color: activeTextColor }}>
              {activeTitle.split(' ').slice(0, 2).join(' ')}
            </span>
            <h1 className="text-[52px] font-semibold tracking-tight leading-none text-center font-sans mt-[250px] inner-shine-text" style={{ animationDelay: '2.9s', color: activeTextColor }}>
              {activeTitle.split(' ').slice(2).join(' ')}
            </h1>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-[40vh] pointer-events-none z-10 
          bg-gradient-to-t from-[#161617] via-[#161617]/95 via-[#161617]/40 to-transparent" />
      </div>

      {/* ================================================================= */}
      {/* 🖥️ WERSJA DESKTOP (Restored from Master)                          */}
      {/* ================================================================= */}
      {/* ================================================================= */}
      {/* 🖥️ WERSJA DESKTOP (Single Sticky Container)                      */}
      {/* ================================================================= */}
      <div className="hidden md:block">
        <div className="relative w-full h-[400vh]">
          <div className="sticky top-0 h-screen w-full overflow-hidden z-0 bg-black">
            {resolvedVideoUrl ? (
              <video
                ref={videoRef}
                src={resolvedVideoUrl}
                muted playsInline preload="auto"
                onLoadedMetadata={handleLoadedMetadata}
                className="w-full h-full object-cover opacity-80"
              />
            ) : imageUrl ? (
              <img
                src={imageUrl}
                className="w-full h-full object-cover opacity-80"
                alt="Hero background image"
              />
            ) : null}

            {/* Text & Content Overlay */}
            <div className="absolute inset-0 pointer-events-none z-20">
              <motion.div
                style={{ scale: groupScale, opacity: groupOpacity, y: exitY }}
                className={`relative w-full h-full flex ${layoutVariant === 'top-right' ? 'justify-end items-start pt-[6vh] pr-[4vw] md:pr-[6vw]' : 'flex-col items-center'}`}
              >
                {layoutVariant === 'top-right' ? (
                  <div className="flex flex-col items-end px-4 w-full md:w-auto h-fit mt-4 md:mt-8">
                    <h1 
                      className="text-[48px] md:text-[110px] font-semibold tracking-tight leading-[1.05] text-right font-sans"
                      style={{ color: activeTextColor, textShadow: `0 2px 20px ${activeGlowColor.replace('0.99', '0.6')}, 0 4px 40px rgba(0,0,0,0.4)` }}
                    >
                      {activeTitle}
                    </h1>
                    <span 
                      className="mt-2 md:mt-4 text-[20px] md:text-[32px] font-[600] tracking-tight text-right max-w-xl leading-snug"
                      style={{ color: activeTextColor, textShadow: `0 2px 10px ${activeGlowColor.replace('0.99', '0.4')}, 0 2px 20px rgba(0,0,0,0.4)` }}
                    >
                      {activeSubtitle}
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="absolute top-[80px] flex flex-col items-center px-4 w-full h-fit">
                      <span 
                        className="text-[32px] md:text-[40px] font-semibold tracking-tight scale-[1.15] text-center"
                        style={{ color: activeTextColor, textShadow: `0 0 10px ${activeGlowColor.replace('0.99', '0.3')}` }}
                      >
                        {activeTitle.split(' ').slice(0, 2).join(' ')}
                      </span>
                      <h1 
                        className="text-[64px] md:text-[110px] font-semibold tracking-tight leading-none text-center font-sans -mt-4"
                        style={{ color: activeTextColor, textShadow: `0 0 60px ${activeGlowColor.replace('0.99', '0.4')}` }}
                      >
                        {activeTitle.split(' ').slice(2).join(' ')}
                      </h1>
                    </div>

                    <motion.div
                      style={{ y: line3Y }}
                      className="absolute bottom-[100px] flex justify-center px-4 w-full h-fit items-center"
                    >
                      <span
                        style={{ color: activeTextColor, ...glowTextStyle }}
                        className="relative z-10 text-[32px] font-[600] tracking-[2px] text-center whitespace-nowrap"
                      >
                        {activeSubtitle}
                      </span>
                    </motion.div>
                  </>
                )}
              </motion.div>
            </div>

            {/* Bottom Gradient */}
            {bottomGradientMode !== 'none' && (
              <div className={`absolute bottom-0 left-0 w-full h-[25vh] pointer-events-none z-10 ${bottomGradientMode === 'light' ? '' : 'backdrop-blur-[4px]'}`}>
                <div className="absolute inset-x-0 bottom-0 h-full opacity-40" style={{ background: `radial-gradient(circle at 50% 100%, ${bottomGradientMode === 'light' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(39, 121, 194, 0.2)'} 0%, transparent 50%)` }} />
                <div className="absolute inset-x-0 bottom-0 h-full" style={{ background: bottomGradientMode === 'light' 
                  ? `linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0.3) 60%, rgba(255, 255, 255, 0.7) 80%, rgba(255, 255, 255, 0.95) 92%, #ffffff 100%)`
                  : `linear-gradient(to bottom, rgba(22, 22, 23, 0) 0%, rgba(22, 22, 23, 0) 40%, rgba(22, 22, 23, 0.1) 60%, rgba(22, 22, 23, 0.4) 80%, rgba(22, 22, 23, 0.8) 92%, #161617 100%)` 
                }} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
