'use client';

import React from 'react';
import { motion } from 'framer-motion';

const LifestyleDescription = () => {
  return (
    <section className="bg-black pt-2 pb-5 px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="space-y-8 text-zinc-400 text-lg md:text-xl leading-relaxed font-medium">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Mimo że nasza wiata została zaprojektowana głównie z myślą o przechowywaniu rowerów, jej wszechstronność sprawia, 
            że jest idealnym rozwiązaniem również dla wielu innych potrzeb. Oprócz rowerów, <strong className="text-white font-bold text-zinc-200">z łatwością pomieści narzędzia 
            ogrodowe, takie jak łopaty, grabie czy sekatory, oraz niewielkie akcesoria ogrodowe, takie jak doniczki, nasiona czy 
            nawozy. Dzięki</strong> przestronnym wymiarom — 1950 mm szerokości, 900 mm głębokości i 1290 mm wysokości — wiata może 
            również służyć jako praktyczny schowek na przydomowe akcesoria, takie jak kosiarki, węże ogrodowe itp.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Idealnie nadaje się również do przechowywania zabawek dziecięcych, w tym samochodzików elektrycznych czy na 
            pedały, zabawek do piaskownicy oraz zestawów do zabawy w ogrodzie. Dodatkowo, <strong className="text-white font-bold text-zinc-200">wiata może pomieścić akcesoria 
            wędkarskie, takie jak wędki, kołowrotki czy torby wędkarskie, a także sezonowe dekoracje ogrodowe</strong>, takie jak latarenki 
            i lampki solarne czy drobne meble ogrodowe. Jeśli korzystasz z ogrodu do relaksu, znajdziesz tu również miejsce na 
            akcesoria do grillowania.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-white font-bold text-zinc-200"
          >
            Dzięki swojej funkcjonalności i przestronności, nasza wiata oferuje wygodne rozwiązanie do przechowywania szerokiej 
            gamy przedmiotów, które mogą być przydatne v codziennym życiu, maksymalnie wykorzystując dostępną 
            przestrzeń.
          </motion.p>
        </div>

        {/* SECTION HEADING: SKONFIGURUJ SWOJĄ WIATĘ */}
        <div className="mt-16 mb-0 pt-16 border-t border-white/5 text-left">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-[56px] font-normal text-zinc-400 tracking-tighter"
          >
            Skonfiguruj swoją wiatę
          </motion.h2>
        </div>
      </div>
    </section>
  );
};

export default LifestyleDescription;
