'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface ResponsiveAssetProps {
  src: string; // Oryginalna ścieżka np. /assets/images/foto.jpg
  alt?: string;
  className?: string;
  priority?: boolean;
  type?: 'image' | 'video';
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
}

export default function ResponsiveAsset({
  src,
  alt = '',
  className = '',
  priority = false,
  type,
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true
}: ResponsiveAssetProps) {
  const [manifest, setManifest] = useState<any>(null);
  const isVideo = type === 'video' || /\.(mp4|mov|webm)$/i.test(src);

  // Wyczyść ścieżkę z leading slash dla lookupu w manifeście
  const cleanSrc = src.startsWith('/') ? src.slice(1) : src;

  useEffect(() => {
    fetch('/_optimized/manifest.json')
      .then(res => res.json())
      .then(data => setManifest(data))
      .catch(() => console.warn('Media manifest not found. Using fallbacks.'));
  }, []);

  if (isVideo) {
    const videoData = manifest?.videos?.[cleanSrc];
    const baseName = src.replace(/\.[^/.]+$/, "");
    
    // Konwencja nazw jeśli manifestu brak
    const mobileWebm = videoData?.variants.mobile.find((v: string) => v.endsWith('.webm')) || `/_optimized/${baseName}_mobile.webm`;
    const mobileMp4 = videoData?.variants.mobile.find((v: string) => v.endsWith('.mp4')) || `/_optimized/${baseName}_mobile.mp4`;
    const desktopWebm = videoData?.variants.desktop.find((v: string) => v.endsWith('.webm')) || `/_optimized/${baseName}_desktop.webm`;
    const desktopMp4 = videoData?.variants.desktop.find((v: string) => v.endsWith('.mp4')) || `/_optimized/${baseName}_desktop.mp4`;

    return (
      <video
        className={className}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        preload={priority ? "auto" : "metadata"}
      >
        {/* Mobile Sources */}
        <source src={mobileWebm} type="video/webm" media="(max-width: 768px)" />
        <source src={mobileMp4} type="video/mp4" media="(max-width: 768px)" />
        
        {/* Desktop Sources */}
        <source src={desktopWebm} type="video/webm" />
        <source src={desktopMp4} type="video/mp4" />
        
        {/* Fallback do oryginału */}
        <source src={src} />
      </video>
    );
  }

  // IMAGE LOGIC
  const imageData = manifest?.images?.[cleanSrc];
  const baseName = src.replace(/\.[^/.]+$/, "");

  // Helpers do budowania srcset
  const getUrl = (size: string, format: string) => 
    imageData?.variants[size].find((v: string) => v.endsWith(format)) || `/_optimized/${baseName}_${size}.${format}`;

  return (
    <picture className={className}>
      {/* AVIF Variants */}
      <source srcSet={getUrl('small', 'avif')} type="image/avif" media="(max-width: 768px)" />
      <source srcSet={getUrl('medium', 'avif')} type="image/avif" media="(max-width: 1440px)" />
      <source srcSet={getUrl('large', 'avif')} type="image/avif" />

      {/* WebP Variants */}
      <source srcSet={getUrl('small', 'webp')} type="image/webp" media="(max-width: 768px)" />
      <source srcSet={getUrl('medium', 'webp')} type="image/webp" media="(max-width: 1440px)" />
      <source srcSet={getUrl('large', 'webp')} type="image/webp" />

      {/* Fallback IMG z Next Image dla optymalizacji LCP i Blur */}
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className={`object-cover ${className}`}
        placeholder={imageData?.blur ? "blur" : "empty"}
        blurDataURL={imageData?.blur}
        sizes="(max-width: 768px) 100vw, (max-width: 1440px) 50vw, 33vw"
      />
    </picture>
  );
}
