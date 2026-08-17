'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone, View } from 'lucide-react';

interface ARModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ARModal({ isOpen, onClose }: ARModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#020203]/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-sm bg-[#0a0a0c] border border-white/10 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col items-center text-center overflow-hidden"
          >
            {/* Glossy top highlight */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-[#8A8F98] hover:text-white transition-colors"
            >
              <X size={16} />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6 text-indigo-400">
              <View size={32} strokeWidth={1.5} />
            </div>

            <h3 className="text-2xl font-semibold text-white tracking-tight mb-2">Zobacz u siebie</h3>
            <p className="text-[#8A8F98] text-sm mb-8">
              Zeskanuj poniższy kod QR aparatem swojego telefonu, aby umieścić model wiaty rowerowej w swojej przestrzeni wykorzystując technologię AR.
            </p>

            {/* Mockup QR Code */}
            <div className="p-4 bg-white rounded-2xl shadow-inner mb-6 relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-md" />
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://gms-system.com" 
                alt="QR Code for AR" 
                className="w-40 h-40 relative z-10"
              />
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-[#8A8F98] bg-white/5 px-4 py-2 rounded-full">
              <Smartphone size={14} />
              <span>Działa na iOS oraz wybranych urządzeniach Android</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
