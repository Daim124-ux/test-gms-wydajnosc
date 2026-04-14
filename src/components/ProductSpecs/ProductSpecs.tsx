import React from 'react';

interface SpecItem {
  label: string;
  value: string;
}

interface ProductSpecsProps {
  specs?: SpecItem[];
}

export default function ProductSpecs({ specs }: ProductSpecsProps) {
  if (!specs || specs.length === 0) {
    return (
      <div className="p-8 text-center bg-gray-50 dark:bg-zinc-800/50 rounded-xl border border-gray-100 dark:border-zinc-700/50">
        <p className="text-gray-500 dark:text-gray-400">Brak szczegółowych danych technicznych.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden text-sm sm:text-base">
      <div className="divide-y divide-gray-100 dark:divide-white/10">
        {specs.map((spec, index) => (
          <div 
            key={index} 
            className={`
              flex flex-col sm:flex-row hover:bg-gray-50 dark:hover:bg-white/5 transition-colors
              ${index % 2 === 0 ? 'bg-transparent' : 'bg-gray-50/50 dark:bg-[#161617]/50'}
            `}
          >
            {/* Etykieta (klucz) */}
            <div className="py-4 px-6 sm:w-1/3 md:w-1/4 font-semibold text-gray-900 dark:text-gray-200 border-b sm:border-b-0 sm:border-r border-gray-100 dark:border-white/10">
              {spec.label}
            </div>
            
            {/* Wartość */}
            <div className="py-4 px-6 sm:w-2/3 md:w-3/4 text-gray-700 dark:text-gray-300">
              {/* Jeśli zawiera HTML z edytora WP, można użyć dangerouslySetInnerHTML, na start renderujemy tekst */}
              {spec.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
