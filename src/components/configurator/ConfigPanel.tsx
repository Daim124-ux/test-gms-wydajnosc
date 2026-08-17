'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Check, ShoppingCart, Settings2, ShieldCheck, Box } from 'lucide-react';
import { CONFIG_COLORS, ADDITIONAL_OPTIONS, ConfigState } from '@/lib/configurator';

interface ConfigPanelProps {
  state: ConfigState;
  onChange: (state: ConfigState) => void;
  totalPrice: number;
}

const springConfig = {
  type: "spring" as const,
  mass: 1,
  damping: 20,
  stiffness: 150
};

export function ConfigPanel({ state, onChange, totalPrice }: ConfigPanelProps) {
  const handleColorChange = (colorId: string) => {
    onChange({ ...state, color: colorId });
  };

  const handleOptionToggle = (optionId: string) => {
    onChange({
      ...state,
      additionalOptions: {
        ...state.additionalOptions,
        [optionId]: !state.additionalOptions[optionId],
      },
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={springConfig}
      className="flex flex-col h-full overflow-y-auto overflow-x-hidden rounded-2xl 
                 bg-[#0a0a0c]/60 backdrop-blur-2xl border border-white/10 
                 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] 
                 text-[#EDEDEF] p-6 sm:p-8"
      style={{
        scrollbarWidth: 'none', // Firefox
        msOverflowStyle: 'none' // IE 10+
      }}
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-light tracking-tight text-white flex items-center gap-2">
            Sunrise <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Nitrum</span>
          </h2>
          <p className="text-[#8A8F98] text-sm mt-1">Konfigurator wiaty rowerowej premium</p>
        </div>
      </div>

      {/* ROZMIAR WIATY (Bento Box style) */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Box size={18} className="text-indigo-400" />
          <h3 className="text-sm font-medium uppercase tracking-wider text-[#8A8F98]">Wymiary Zewnętrzne</h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Szer.', value: '1950', unit: 'mm' },
            { label: 'Wys.', value: '1230', unit: 'mm' },
            { label: 'Dł.', value: '900', unit: 'mm' },
          ].map((dim, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors"
            >
              <span className="text-[10px] text-[#8A8F98] uppercase tracking-wider mb-1">{dim.label}</span>
              <span className="text-xl font-light text-white">{dim.value}<span className="text-xs text-[#8A8F98] ml-1">{dim.unit}</span></span>
            </div>
          ))}
        </div>
      </div>

      {/* KOLOR WIATY */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Settings2 size={18} className="text-indigo-400" />
          <h3 className="text-sm font-medium uppercase tracking-wider text-[#8A8F98]">Wykończenie & Kolor</h3>
        </div>
        
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
          {CONFIG_COLORS.map((color) => {
            const isSelected = state.color === color.id;
            return (
              <motion.button
                key={color.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleColorChange(color.id)}
                className="relative group focus:outline-none flex flex-col items-center gap-2"
              >
                <div
                  className={`w-12 h-12 rounded-full shadow-inner relative flex items-center justify-center`}
                  style={{ 
                    backgroundColor: color.hex,
                    boxShadow: `inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.5), ${isSelected ? '0 0 15px ' + color.hex + '80' : 'none'}`
                  }}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="color-selection-ring"
                      className="absolute -inset-1.5 rounded-full border-2 border-indigo-400"
                      transition={springConfig}
                    />
                  )}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                      >
                        <Check size={18} strokeWidth={3} className={color.hex === '#f1efe7' || color.hex === '#d9e0e3' ? 'text-gray-900' : 'text-white'} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="text-center w-full">
                  <span className={`block text-[10px] font-medium truncate w-full ${isSelected ? 'text-white' : 'text-[#8A8F98] group-hover:text-white transition-colors'}`}>
                    {color.name}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* OPCJE DODATKOWE */}
      <div className="mb-10 flex-grow">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck size={18} className="text-indigo-400" />
          <h3 className="text-sm font-medium uppercase tracking-wider text-[#8A8F98]">Akcesoria</h3>
        </div>
        <div className="space-y-3">
          {ADDITIONAL_OPTIONS.map((option) => {
            const isSelected = state.additionalOptions[option.id] || false;
            return (
              <motion.button
                key={option.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleOptionToggle(option.id)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                  isSelected 
                    ? 'border-indigo-500/50 bg-indigo-500/10' 
                    : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-indigo-500 text-white' : 'border border-white/20 bg-black/20'
                    }`}
                  >
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                          <Check size={14} strokeWidth={3} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <span className={`font-medium text-sm ${isSelected ? 'text-white' : 'text-[#EDEDEF]'}`}>{option.name}</span>
                </div>
                <span className="text-sm font-medium text-[#8A8F98]">
                  +{option.price.toLocaleString('pl-PL')} zł
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* PODSUMOWANIE / KOSZYK */}
      <div className="mt-auto pt-6 border-t border-white/10 relative">
        <div className="flex flex-col mb-6">
          <span className="text-[#8A8F98] text-sm font-medium uppercase tracking-wider mb-1">Cena Konfiguracji</span>
          <motion.span 
            key={totalPrice}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-light text-white tracking-tight"
          >
            {totalPrice.toLocaleString('pl-PL')} <span className="text-2xl text-[#8A8F98]">zł</span>
          </motion.span>
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-4 px-6 rounded-xl flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-shadow relative overflow-hidden group"
        >
          {/* Animated glow effect inside button */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          <ShoppingCart size={18} />
          <span>Dodaj do koszyka</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
