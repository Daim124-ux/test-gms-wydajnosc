'use client';

import React, { useEffect, useState } from 'react';
import VergeViewer from '@/components/ThreeDShowcase/VergeViewer';

// Custom declaration for model-viewer to keep TS happy
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

export default function ThreeDTest() {
  return (
    <section className="w-full bg-zinc-900 py-20 flex flex-col items-center justify-center border-t border-white/5">
      <div className="text-center mb-10">
        <h2 className="text-white text-2xl font-bold mb-2">Test bezpośredniego wyświetlania 3D</h2>
        <p className="text-zinc-500">Sekcja testowa do weryfikacji widoczności modelu</p>
      </div>

      <div className="w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden border border-white/10 relative shadow-2xl mb-8">
        <VergeViewer src="/apps/verge-model/index.html" />
      </div>

      {/* INTERACTION TEST BUTTONS - EXACT MATCH OF OLD PROJECT STRUCTURE */}
      <div className="flex flex-wrap gap-4 justify-center">
        <div
          id="ha-tab-title-9971"
          className="ha-tab_title ha-tab_title--desktop cursor-pointer px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all border border-white/10 hover:border-white/30 backdrop-blur-md"
          data-tab="1"
          role="tab"
        >
          <span className="ha-tab__title-text">Front</span>
        </div>
        <div
          id="ha-tab-title-9972"
          className="ha-tab_title ha-tab_title--desktop cursor-pointer px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all border border-white/10 hover:border-white/30 backdrop-blur-md"
          data-tab="2"
          role="tab"
        >
          <span className="ha-tab__title-text">Zawias</span>
        </div>
        <div
          id="ha-tab-title-9973"
          className="ha-tab_title ha-tab_title--desktop cursor-pointer px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all border border-white/10 hover:border-white/30 backdrop-blur-md"
          data-tab="3"
          role="tab"
        >
          <span className="ha-tab__title-text">Naroża</span>
        </div>
        <div
          id="ha-tab-title-9974"
          className="ha-tab_title ha-tab_title--desktop cursor-pointer px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all border border-white/10 hover:border-white/30 backdrop-blur-md"
          data-tab="4"
          role="tab"
        >
          <span className="ha-tab__title-text">Zamykanie</span>
        </div>
        <div
          id="ha-tab-title-9975"
          className="ha-tab_title ha-tab_title--desktop cursor-pointer px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all border border-white/10 hover:border-white/30 backdrop-blur-md"
          data-tab="5"
          role="tab"
        >
          <span className="ha-tab__title-text">System</span>
        </div>
        <div
          id="ha-tab-title-9976"
          className="ha-tab_title ha-tab_title--desktop cursor-pointer px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all border border-white/10 hover:border-white/30 backdrop-blur-md"
          data-tab="6"
          role="tab"
        >
          <span className="ha-tab__title-text">Uchwyt</span>
        </div>
      </div>
    </section>
  );
}
