'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ResponsiveAsset from '@/components/common/ResponsiveAsset';

export interface ElementKaruzeli {
  id: string;
  tytul: string;
  opis?: string;
  obrazUrl?: string;
  videoUrl?: string;
  loop?: boolean;
  pozycjaTekstu?: 'gora' | 'srodek' | 'dol' | 'prawa-srodek' | 'prawa-dol' | 'dol-srodek';
  pozycjaObrazu?: string;
  rozmiarObrazu?: 'cover' | 'contain';
}

interface KaruzelaFunkcjiProps {
  elementy: ElementKaruzeli[];
  showTitle?: boolean;
  bgClass?: string;
  offsetClass?: string;
}

export default function KaruzelaFunkcji({
  elementy,
  showTitle = true,
  bgClass = 'bg-[#161617]',
  offsetClass = '-mt-[110px]'
}: KaruzelaFunkcjiProps) {
  const kontenerScrollRef = useRef<HTMLDivElement>(null);
  const [aktywnyId, setAktywnyId] = useState<string>(elementy[0]?.id || '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAktywnyId(entry.target.getAttribute('data-id') || '');
          }
        });
      },
      {
        root: kontenerScrollRef.current,
        threshold: 0.6,
      }
    );

    const karty = kontenerScrollRef.current?.querySelectorAll('.karta-karuzeli');
    karty?.forEach((karta) => observer.observe(karta));

    return () => {
      karty?.forEach((karta) => observer.unobserve(karta));
    };
  }, [elementy]);

  const przewinWLewo = () => {
    if (kontenerScrollRef.current) {
      kontenerScrollRef.current.scrollBy({ left: -450, behavior: 'smooth' });
    }
  };

  const przewinWPrawo = () => {
    if (kontenerScrollRef.current) {
      kontenerScrollRef.current.scrollBy({ left: 450, behavior: 'smooth' });
    }
  };

  return (
    <section className={`w-full ${bgClass} py-24 sm:py-32 overflow-hidden relative ${offsetClass}`}>
      {/* NAGŁÓWEK SEKCI - W kontenerze 1280px */}
      {showTitle && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <h2 className="text-[40px] md:text-[56px] font-[600] tracking-tight text-[#86868B] leading-tight">
            Najważniejsze informacje.
          </h2>
        </div>
      )}

      {/* KONTENER SLIDERA - Bleed (wyjście do krawędzi) */}
      <div className="relative w-full -my-8">
        <div
          ref={kontenerScrollRef}
          className="flex gap-3 lg:gap-4 overflow-x-auto snap-x snap-mandatory hide-scrollbar w-full scroll-pl-4 sm:scroll-pl-6 lg:scroll-pl-8 xl:scroll-pl-[calc((100vw_-_1280px)_/_2_+_32px)] py-8"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* LEWY SPACER - Wypycha pierwszy element, by zrównał się z gridem 1280px (nagłówkiem) na start */}
          <div className="shrink-0 pointer-events-none w-0 sm:w-2 lg:w-4 xl:w-[calc((100vw_-_1280px)_/_2_+_8px)]" />

          {elementy.map((element) => (
            <div
              key={element.id}
              data-id={element.id}
              className={`snap-start snap-always shrink-0 w-[85vw] md:w-[60vw] h-[50vh] md:h-[70vh] relative rounded-[20px] karta-karuzeli animowana-ramka ${aktywnyId === element.id ? 'aktywna' : ''}`}
            >
              <div className={`w-full h-full relative rounded-[20px] overflow-hidden group bg-black transition-all duration-500 border ${aktywnyId === element.id ? 'border-white/5' : 'border-[#86868B]'}`}>
                {/* OBRAZ / TŁO / VIDEO */}
                {element.videoUrl && aktywnyId === element.id ? (
                  <ResponsiveAsset
                    src={element.videoUrl}
                    type="video"
                    autoPlay
                    muted
                    loop={element.loop !== false}
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover brightness-[1.15]"
                  />
                ) : element.obrazUrl ? (
                  <ResponsiveAsset
                    src={element.obrazUrl}
                    type="image"
                    alt={element.tytul}
                    className={`absolute inset-0 w-full h-full brightness-[1.15] ${
                      element.rozmiarObrazu === 'contain' ? 'object-contain' : 'object-cover'
                    }`}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
                    <span className="text-zinc-700 font-bold text-6xl opacity-20">GMS</span>
                  </div>
                )}

                {/* OVERLAY CIEMNIEJSZY DLA CZYTELNOŚCI */}
                <div className="absolute inset-0 bg-black/20" />

                {/* TEKST NA KARCIE */}
                <div className={`absolute inset-0 p-8 md:p-12 flex flex-col pointer-events-none
                  ${element.pozycjaTekstu === 'prawa-srodek' ? 'justify-center items-end text-right' :
                    element.pozycjaTekstu === 'prawa-dol' ? 'justify-end items-end text-right' :
                      element.pozycjaTekstu === 'dol' ? 'justify-end items-start text-left' :
                        element.pozycjaTekstu === 'dol-srodek' ? 'justify-end items-center text-center' :
                          'justify-start items-start text-left'}`}
                >
                  <h3 className={`text-[28px] font-semibold text-white tracking-tight leading-[1.14em] drop-shadow-lg max-w-[280px] md:max-w-[520px] ${element.pozycjaTekstu === 'dol-srodek' ? 'mx-auto' : ''}`}>
                    {element.tytul}
                  </h3>
                </div>
              </div>
            </div>
          ))}

          {/* PRAWY SPACER - Zabezpiecza margines dla ostatniego elementu */}
          <div className="shrink-0 pointer-events-none w-0 sm:w-2 lg:w-4 xl:w-[calc((100vw_-_1280px)_/_2_+_8px)]" />
        </div>

        {/* NAWIGACJA (STRZAŁKI) - Dół prawy */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-[-20px] flex justify-end gap-[5px] pb-8 -translate-x-[60px]">
          <button
            onClick={przewinWLewo}
            className="w-10 h-10 rounded-full bg-zinc-800/80 border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all active:scale-95"
            aria-label="Poprzedni"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={przewinWPrawo}
            className="w-10 h-10 rounded-full bg-zinc-800/80 border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all active:scale-95"
            aria-label="Następny"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
