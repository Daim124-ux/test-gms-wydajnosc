'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ScanFace, Palette, PlayCircle, Maximize, Minimize, X } from 'lucide-react';

interface FloatingDockProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onOpenAR: () => void;
  onStartAnimation: () => void;
  onCycleColors: () => void;
}

function MagneticButton({ children, onClick, tooltip }: { children: React.ReactNode, onClick: () => void, tooltip: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY } = e;
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      x.set((clientX - centerX) * 0.3); // Magnetic pull strength
      y.set((clientY - centerY) * 0.3);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <div className="relative group">
      {/* Tooltip */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50 whitespace-nowrap">
        <div className="bg-[#0a0a0c]/80 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full border border-white/10 shadow-xl">
          {tooltip}
        </div>
      </div>
      
      <motion.button
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        style={{ x: springX, y: springY }}
        whileTap={{ scale: 0.9 }}
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors duration-300 ${
          isHovered ? 'bg-white/15 border-white/30' : 'bg-white/5 border-white/10'
        } border backdrop-blur-xl shadow-lg relative overflow-hidden`}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/0 via-white/5 to-white/0" />
        <div className="relative z-10 text-white/90 group-hover:text-white transition-colors duration-300">
          {children}
        </div>
      </motion.button>
    </div>
  );
}

export function FloatingDock({ isFullscreen, onToggleFullscreen, onOpenAR, onStartAnimation, onCycleColors }: FloatingDockProps) {
  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", damping: 20, stiffness: 100, delay: 0.5 }}
      className="absolute bottom-6 left-8 md:left-12 z-40 flex items-center gap-4"
    >
      <div className="flex items-center gap-3 p-2 rounded-full bg-[#050506]/40 backdrop-blur-3xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.8)]">
        <MagneticButton onClick={onOpenAR} tooltip="Zobacz u siebie (AR)">
          <ScanFace strokeWidth={1.5} size={22} />
        </MagneticButton>
        <MagneticButton onClick={onCycleColors} tooltip="Prezentacja kolorów">
          <Palette strokeWidth={1.5} size={22} />
        </MagneticButton>
        <MagneticButton onClick={onStartAnimation} tooltip="Odtwórz animację">
          <PlayCircle strokeWidth={1.5} size={22} />
        </MagneticButton>
        
        <div className="w-[1px] h-8 bg-white/10 mx-1" />
        
        <MagneticButton onClick={onToggleFullscreen} tooltip={isFullscreen ? "Zamknij pełny ekran" : "Pełny ekran"}>
          {isFullscreen ? <Minimize strokeWidth={1.5} size={22} /> : <Maximize strokeWidth={1.5} size={22} />}
        </MagneticButton>
      </div>
    </motion.div>
  );
}
