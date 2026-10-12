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
  onLoadedData?: (e: React.SyntheticEvent<HTMLVideoElement, Event>) => void;
  onCanPlay?: (e: React.SyntheticEvent<HTMLVideoElement, Event>) => void;
  poster?: string;
}

// Singleton cache manifestu w pamięci klienta (pobierany tylko RAZ dla całej sesji aplikacji)
let cachedManifest: any = null;
let manifestPromise: Promise<any> | null = null;
const manifestListeners = new Set<(manifest: any) => void>();

function fetchGlobalManifest(): Promise<any> {
  if (typeof window === 'undefined') return Promise.resolve(null);
  if (cachedManifest) {
    return Promise.resolve(cachedManifest);
  }
  if (!manifestPromise) {
    manifestPromise = fetch('/_optimized/manifest.json')
      .then(async (res) => {
        if (!res.ok) return null;
        const text = await res.text();
        if (!text || !text.trim()) return null;
        try {
          const raw = JSON.parse(text);
          // Konwersja kluczy na małe litery w celu wyeliminowania problemów z wielkością liter Windows vs Vercel (Linux)
          const normalized = { images: {} as any, videos: {} as any };
          if (raw.images) {
            for (const [key, value] of Object.entries(raw.images)) {
              normalized.images[key.toLowerCase()] = value;
            }
          }
          if (raw.videos) {
            for (const [key, value] of Object.entries(raw.videos)) {
              normalized.videos[key.toLowerCase()] = value;
            }
          }
          cachedManifest = normalized;
          manifestListeners.forEach((listener) => listener(normalized));
          manifestListeners.clear();
          return normalized;
        } catch {
          return null;
        }
      })
      .catch((err) => {
        console.warn('Media manifest not found. Using fallbacks.', err);
        manifestListeners.clear();
        return null;
      });
  }
  return manifestPromise;
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
    onLoadedMetadata,
    onLoadedData,
    onCanPlay,
    poster
  },
  ref
) => {
  const [manifest, setManifest] = useState<any>(() => cachedManifest);
  const activeManifest = manifest || cachedManifest;
  const isVideo = type === 'video' || /\.(mp4|mov|webm)$/i.test(src);

  const CLOUDFRONT_URL = 'https://d1moyf5ccth9x8.cloudfront.net';
  const cleanSrc = src.startsWith('/') ? src.slice(1) : src;

  useEffect(() => {
    if (cachedManifest) {
      if (!manifest) {
        setManifest(cachedManifest);
      }
      return;
    }

    manifestListeners.add(setManifest);
    fetchGlobalManifest();

    return () => {
      manifestListeners.delete(setManifest);
    };
  }, [manifest]);

  const searchSrc = cleanSrc.toLowerCase();

  if (isVideo) {
    const videoData = activeManifest?.videos?.[searchSrc];
    const baseName = cleanSrc.replace(/\.[^/.]+$/, "");
    
    // Sprawdź czy to plik pominięty w optymalizacji (np. frames)
    const isSkipped = cleanSrc.toLowerCase().includes('frames') || cleanSrc.toLowerCase().includes('pages.system-dom.wiata-rowerowa.hero') || cleanSrc.toLowerCase().includes('raw');
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
        {...{ fetchPriority: priority ? "high" : "auto" }}
        poster={poster}
        onLoadedMetadata={(e) => {
          if (!autoPlay) {
            e.currentTarget.pause();
          }
          if (onLoadedMetadata) onLoadedMetadata(e);
        }}
        onLoadedData={onLoadedData}
        onCanPlay={onCanPlay}
      >
        {/* Mobile Sources */}
        <source src={encodeURI(mobileWebm)} type="video/webm" media="(max-width: 768px)" />
        <source src={encodeURI(mobileMp4)} type="video/mp4" media="(max-width: 768px)" />
        
        {/* Desktop Sources */}
        <source src={encodeURI(desktopWebm)} type="video/webm" />
        <source src={encodeURI(desktopMp4)} type="video/mp4" />
        
        {/* Fallback do oryginału */}
        <source src={encodeURI(src)} />
      </video>
    );
  }

  // IMAGE LOGIC
  const imageData = activeManifest?.images?.[searchSrc];
  const baseName = cleanSrc.replace(/\.[^/.]+$/, "");

  // Helpers do budowania srcset - fallback do CloudFront
  const getUrl = (size: string, format: string) => {
    const url = imageData?.variants[size].find((v: string) => v.endsWith(format)) || `${CLOUDFRONT_URL}/_optimized/${baseName}_${size}.${format}`;
    return encodeURI(url);
  };

  const isContain = className.includes('object-contain');

  // Fallback URL w razie braku danych w manifeście
  const fallbackS3Url = encodeURI(imageData?.original || `${CLOUDFRONT_URL}/_optimized/originals/${cleanSrc}`);

  return (
    <picture className={`block w-full h-full ${className}`}>
      {/* AVIF Variants */}
      <source srcSet={getUrl('small', 'avif')} type="image/avif" media="(max-width: 768px)" />
      <source srcSet={getUrl('large', 'avif')} type="image/avif" />

      {/* WebP Variants */}
      <source srcSet={getUrl('small', 'webp')} type="image/webp" media="(max-width: 768px)" />
      <source srcSet={getUrl('large', 'webp')} type="image/webp" />

      {/* Fallback IMG z Next Image (z S3 zamiast local) */}
      <Image
        src={fallbackS3Url}
        alt={alt}
        fill
        priority={priority}
        quality={95}
        className={`w-full h-full ${className} ${isContain ? 'object-contain' : 'object-cover'}`}
        placeholder="empty"
        sizes="100vw"
      />
    </picture>
  );
});

ResponsiveAsset.displayName = 'ResponsiveAsset';

export default React.memo(ResponsiveAsset);
