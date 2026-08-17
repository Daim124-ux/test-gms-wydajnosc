'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

export default function Scene() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="w-full h-full relative flex items-center justify-center">
      {/* Script is necessary for model-viewer Web Component */}
      <Script 
        type="module" 
        src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js"
        strategy="lazyOnload"
      />
      
      {/* @ts-ignore - model-viewer is a custom web component */}
      <model-viewer
        src="/assets/makieta_3d/wiata_makieta_ar.glb"
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        auto-rotate
        rotation-per-second="10deg"
        shadow-intensity="1"
        shadow-softness="0.5"
        environment-image="neutral"
        exposure="1"
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'transparent',
          outline: 'none'
        }}
        interaction-prompt="none"
        camera-orbit="45deg 75deg auto"
      >
        <div slot="progress-bar" className="w-full h-1 bg-gray-200 absolute top-0 left-0">
          <div className="h-full bg-blue-600 transition-all duration-300" />
        </div>
      {/* @ts-ignore */}
      </model-viewer>
    </div>
  );
}
