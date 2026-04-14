'use client';

import React from 'react';
import Image from 'next/image';

interface SmartMediaProps {
  src: string;
  alt?: string;
  className?: string;
  type?: 'image' | 'video';
  priority?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  width?: number;
  height?: number;
  fill?: boolean;
}

export default function SmartMedia({
  src,
  alt = '',
  className = '',
  type,
  priority = false,
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  width,
  height,
  fill = false
}: SmartMediaProps) {
  const isVideo = type === 'video' || src.endsWith('.mp4') || src.endsWith('.mov') || src.endsWith('.webm');
  
  if (isVideo) {
    const baseSrc = src.replace(/\.(mp4|mov|webm)$/, '');
    return (
      <video
        className={className}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        preload="auto"
      >
        <source src={`${baseSrc}.webm`} type="video/webm" />
        <source src={`${baseSrc}.mp4`} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  }

  // Handle Images
  const isResponsive = fill;
  const baseImgSrc = src.replace(/\.(jpg|jpeg|png)$/, '');
  const isOptimizable = /\.(jpg|jpeg|png)$/.test(src);

  if (isOptimizable) {
    return (
      <picture className={className}>
        <source srcSet={`${baseImgSrc}.avif`} type="image/avif" />
        <source srcSet={`${baseImgSrc}.webp`} type="image/webp" />
        <Image
          src={src}
          alt={alt}
          width={!fill ? width : undefined}
          height={!fill ? height : undefined}
          fill={fill}
          priority={priority}
          className={className}
          loading={priority ? 'eager' : 'lazy'}
        />
      </picture>
    );
  }

  // Fallback for SVGs or already optimized files
  return (
    <Image
      src={src}
      alt={alt}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      fill={fill}
      priority={priority}
      className={className}
    />
  );
}
