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
  onLoadedMetadata?: (e: React.SyntheticEvent<HTMLVideoElement, Event>) => void;
}

const ResponsiveAsset = React.forwardRef<HTMLVideoElement | HTMLImageElement, ResponsiveAssetProps>((
  {
    src,
    alt = '',
    className = '',
    priority = false,
    type,
    autoPlay = false,
    loop = true,
    muted = true,
    playsInline = true,
    onLoadedMetadata
  },
  ref
) => {
  const [manifest, setManifest] = useState<any>(null);
  const isVideo = type === 'video' || /\.(mp4|mov|webm)$/i.test(src);

  const CLOUDFRONT_URL = 'https://d1moyf5ccth9x8.cloudfront.net';
  const cleanSrc = src.startsWith('/') ? src.slice(1) : src;

  useEffect(() => {
    fetch('/_optimized/manifest.json')
      .then(res => res.json())
      .then(data => setManifest(data))
      .catch(() => console.warn('Media manifest not found. Using fallbacks.'));
  }, []);

  if (isVideo) {
    const videoData = manifest?.videos?.[cleanSrc];
    const baseName = cleanSrc.replace(/\.[^/.]+$/, "");
    
    // Sprawdź czy to plik pominięty w optymalizacji (np. frames)
    const isSkipped = cleanSrc.toLowerCase().includes('frames') || cleanSrc.toLowerCase().includes('hero') || cleanSrc.toLowerCase().includes('raw');
    const mobileWebm = videoData?.variants.mobile.find((v: string) => v.endsWith('.webm')) || 
      (isSkipped ? `${CLOUDFRONT_URL}/_optimized/${cleanSrc}` : `${CLOUDFRONT_URL}/_optimized/${baseName}_mobile.webm`);
      
    const mobileMp4 = videoData?.variants.mobile.find((v: string) => v.endsWith('.mp4')) || 
      (isSkipped ? `${CLOUDFRONT_URL}/_optimized/${cleanSrc}` : `${CLOUDFRONT_URL}/_optimized/${baseName}_mobile.mp4`);
      
    const desktopWebm = videoData?.variants.desktop.find((v: string) => v.endsWith('.webm')) || 
      (isSkipped ? `${CLOUDFRONT_URL}/_optimized/${cleanSrc}` : `${CLOUDFRONT_URL}/_optimized/${baseName}_desktop.webm`);
      
    const desktopMp4 = videoData?.variants.desktop.find((v: string) => v.endsWith('.mp4')) || 
      (isSkipped ? `${CLOUDFRONT_URL}/_optimized/${cleanSrc}` : `${CLOUDFRONT_URL}/_optimized/${baseName}_desktop.mp4`);

    return (
      <video
        ref={ref as React.RefObject<HTMLVideoElement>}
        className={className}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        preload={priority ? "auto" : "metadata"}
        onLoadedMetadata={(e) => {
          if (!autoPlay) {
            e.currentTarget.pause();
          }
          if (onLoadedMetadata) onLoadedMetadata(e);
        }}
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
  const baseName = cleanSrc.replace(/\.[^/.]+$/, "");

  // Helpers do budowania srcset - fallback do CloudFront
  const getUrl = (size: string, format: string) => 
    imageData?.variants[size].find((v: string) => v.endsWith(format)) || `${CLOUDFRONT_URL}/_optimized/${baseName}_${size}.${format}`;

  const isContain = className.includes('object-contain');

  // Fallback URL w razie braku danych w manifeście
  const fallbackS3Url = imageData?.original || `${CLOUDFRONT_URL}/_optimized/originals/${cleanSrc}`;

  return (
    <picture className={`block w-full h-full ${className}`}>
      {/* AVIF Variants */}
      <source srcSet={getUrl('small', 'avif')} type="image/avif" media="(max-width: 768px)" />
      <source srcSet={getUrl('medium', 'avif')} type="image/avif" media="(max-width: 1440px)" />
      <source srcSet={getUrl('large', 'avif')} type="image/avif" />

      {/* WebP Variants */}
      <source srcSet={getUrl('small', 'webp')} type="image/webp" media="(max-width: 768px)" />
      <source srcSet={getUrl('medium', 'webp')} type="image/webp" media="(max-width: 1440px)" />
      <source srcSet={getUrl('large', 'webp')} type="image/webp" />

      {/* Fallback IMG z Next Image (z S3 zamiast local) */}
      <Image
        src={fallbackS3Url}
        alt={alt}
        fill
        priority={priority}
        className={`w-full h-full ${isContain ? 'object-contain' : 'object-cover'}`}
        placeholder="empty"
        sizes="(max-width: 768px) 100vw, (max-width: 1440px) 50vw, 33vw"
      />
    </picture>
  );
});

ResponsiveAsset.displayName = 'ResponsiveAsset';

export default ResponsiveAsset;
