import React from 'react';
import Image from 'next/image';

interface ProductHeroProps {
  title: string;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
}

export default function ProductHero({ title, description, imageUrl, imageAlt }: ProductHeroProps) {
  return (
    <section className="relative w-full overflow-hidden bg-white dark:bg-[#161617] pt-20 pb-16 lg:pt-32 lg:pb-24">
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-gray-50 to-white dark:from-black/20 dark:to-[#161617] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        
        {/* Lewa strona - Teksty */}
        <div className="flex-1 w-full flex flex-col items-start text-left">
          <span className="inline-block px-3 py-1 mb-6 text-sm font-semibold text-[#1660b1] bg-[#1660b1]/10 rounded-full dark:text-[#ffcc33] dark:bg-[#ffcc33]/10">
            Nowość
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
            {title}
          </h1>
          
          {description && (
            <div 
              className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-10 prose dark:prose-invert"
              // Renderujemy HTML wysłany bezpośrednio z edytora WP Gutenberg
              dangerouslySetInnerHTML={{ __html: description }} 
            />
          )}

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button className="px-8 py-4 bg-[#1660b1] hover:bg-[#114b8a] text-white font-medium rounded-lg transition-colors shadow-lg shadow-[#1660b1]/30">
              Zapytaj o wycenę
            </button>
            <button className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 font-medium rounded-lg transition-colors">
              Pobierz katalog (PDF)
            </button>
          </div>
        </div>

        {/* Prawa strona - Zdjęcie produktu */}
        <div className="flex-1 w-full relative">
          <div className="aspect-[4/3] relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/5 dark:ring-white/10">
            {imageUrl ? (
              <Image 
                src={imageUrl} 
                alt={imageAlt || 'Zdjęcie produktu'} 
                fill 
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority // Preload głównego zdjęcia hero ze względów LCP
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-800">
                <span className="text-gray-400 dark:text-gray-500">Brak zdjęcia</span>
              </div>
            )}
          </div>
        </div>
        
      </div>
    </section>
  );
}
