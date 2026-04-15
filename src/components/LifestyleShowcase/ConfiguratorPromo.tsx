'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import ResponsiveAsset from '@/components/common/ResponsiveAsset';

const ConfiguratorPromo = () => {
  return (
    <section className="bg-black pb-6 px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* CONFIGURATOR PREVIEW IMAGE */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative w-full aspect-[1024/491] rounded-3xl overflow-hidden border border-white/10 shadow-2xl mb-12"
        >
          <ResponsiveAsset
            src="/assets/images/wiaty-stalowe-na-rowery/Wiata_konfigurator-1024x491.jpg"
            alt="Podgląd konfiguratora wiaty"
            className="object-cover"
          />
        </motion.div>

        {/* DESCRIPTION TEXT */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-zinc-300 text-lg md:text-xl text-center max-w-4xl leading-relaxed mb-12"
        >
          Nasz konfigurator daje możliwość personalizacji produktów, tak aby odpowiadały one najbardziej
          wymagającym klientom. Przy konfiguracji mamy podgląd naszego produktu w czasie rzeczywistym.
        </motion.p>

        {/* CTA BUTTON - Glowing Aura Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative"
        >
          {/* Pulsing glow background */}
          <motion.div
            animate={{
              boxShadow: ["0 0 20px rgba(59, 130, 246, 0.4)", "0 0 40px rgba(59, 130, 246, 0.7)", "0 0 20px rgba(59, 130, 246, 0.4)"],
              scale: [1, 1.02, 1]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full blur-xl bg-blue-600/20"
          />

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(59, 130, 246, 0.8)" }}
            whileTap={{ scale: 0.95 }}
            className="relative flex items-center gap-3 px-10 py-5 rounded-full border border-blue-400/50 bg-blue-600/10 text-white font-bold text-lg hover:bg-blue-600 hover:border-transparent transition-all group overflow-hidden"
          >
            {/* Liquid shine effect on hover */}
            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <ShoppingBag size={22} className="group-hover:scale-110 transition-transform" />
            <span className="relative z-10">Przejdź do sklepu</span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default ConfiguratorPromo;
