'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';

interface VergeViewerProps {
  src?: string;
  className?: string;
  onLoad?: () => void;
}

export default function VergeViewer({ 
  src = '/apps/verge-model/index.html',
  className = '',
  onLoad
}: VergeViewerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Funkcja mostkująca do komunikacji z Puzzlami Verge3D
  const sendCommandToPuzzles = useCallback((procedureName: string, value: any = null) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      const v3dApp = (iframeRef.current.contentWindow as any).v3dApp;
      if (v3dApp && v3dApp.ExternalInterface) {
        v3dApp.ExternalInterface.run(procedureName, value);
        console.log(`[VergeViewer] Sent command: ${procedureName}`, value);
      } else {
        console.warn(`[VergeViewer] v3dApp or ExternalInterface not ready for procedure: ${procedureName}`);
      }
    }
  }, []);

  const handleLoad = () => {
    // Iframe itself loaded, but we keep spinner until model is ready (sent via postMessage)
    console.log('[VergeViewer] Iframe loaded, waiting for VERGE_READY...');
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'VERGE_READY') {
        setIsLoading(false);
        if (onLoad) onLoad();
        console.log('[VergeViewer] Model ready signal received');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onLoad]);

  // Ekspozycja funkcji na obiekcie window (opcjonalnie dla debugowania)
  useEffect(() => {
    (window as any).vergeViewer = { sendCommandToPuzzles };
    return () => { delete (window as any).vergeViewer; };
  }, [sendCommandToPuzzles]);

  return (
    <div className={`relative w-full h-full overflow-hidden bg-black ${className}`}>

      {/* Verge3D Player Iframe */}
      <iframe
        ref={iframeRef}
        src={src}
        className="w-full h-full border-none shadow-inner transition-opacity duration-700"
        style={{ opacity: isLoading ? 0 : 1 }}
        onLoad={handleLoad}
        title="Verge3D Interactive Viewer"
        allow="fullscreen; xr-spatial-tracking"
      />
    </div>
  );
}
