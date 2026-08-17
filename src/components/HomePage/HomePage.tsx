'use client';

import { motion, type Variants } from 'framer-motion';
import {
  ArrowRight,
  Bike,
  Boxes,
  Building2,
  CheckCircle2,
  DoorOpen,
  Home,
  Leaf,
  PanelsTopLeft,
  ShieldCheck,
  Trash2,
  Warehouse,
  ChevronRight
} from 'lucide-react';
import { Link } from '@/i18n/navigation';
import Footer from '@/components/Footer/Footer';
import Scene from './Scene';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const stagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const systemCards = [
  {
    eyebrow: 'Dla domu',
    title: 'Garaże i bramy',
    description: 'Od lekkiego garażu stalowego po zaawansowaną bramę segmentową.',
    icon: Home,
    href: '/system-dom/garaze-stalowe',
    links: ['Garaże stalowe', 'Garaże SuperStrong', 'Bramy uchylne', 'Bramy segmentowe'],
  },
  {
    eyebrow: 'Przechowywanie',
    title: 'Wiaty i schowki',
    description: 'Dla rowerów, jednośladów, ogrodu i wszystkiego, co chcesz chronić.',
    icon: Bike,
    href: '/system-dom/wiata-stalowa-na-rowery',
    links: ['Wiata na rowery', 'Wiata na jednoślady', 'Wiata ogrodowa', 'Wiata na wózki'],
  },
  {
    eyebrow: 'Inwestycje',
    title: 'Altany i zabudowy',
    description: 'Uporządkowane otoczenie budynku, parkingu i przestrzeni przemysłowej.',
    icon: Building2,
    href: '/osiedle-system/altany-smietnikowe',
    links: ['Altany z zielonym dachem', 'Altany śmietnikowe', 'Garaże zbiorcze', 'Wygrodzenia'],
  },
] as const;

const productTiles = [
  { name: 'Garaże', href: '/system-dom/garaze-stalowe', icon: Warehouse },
  { name: 'SuperStrong', href: '/system-dom/garaze-superstrong', icon: ShieldCheck },
  { name: 'Wiaty rowerowe', href: '/system-dom/wiata-stalowa-na-rowery', icon: Bike },
  { name: 'Wiaty stalowe', href: '/system-dom/wiaty-stalowe', icon: PanelsTopLeft },
  { name: 'Bramy', href: '/system-dom/bramy-garazowe', icon: DoorOpen },
  { name: 'Zielone dachy', href: '/osiedle-system/altany-z-zielonym-dachem', icon: Leaf },
  { name: 'Altany śmietnikowe', href: '/osiedle-system/altany-smietnikowe', icon: Trash2 },
  { name: 'Zabudowy', href: '/osiedle-system/wygrodzenia-gms', icon: Boxes },
] as const;

const proofPoints = [
  'Producent Garaży Blaszanych, Bram Garażowych, Altan i Wiat Śmietnikowych',
  '17 rozwiązań. Bez zgadywania, bez zbędnych kroków.',
  'Skonfiguruj w sklepie',
  'Porozmawiaj z doradcą',
] as const;

export default function HomePage() {
  return (
    <>
      <main className="relative isolate bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-900 overflow-hidden">
        
        {/* HERO SECTION */}
        <section className="relative min-h-[100svh] pt-32 pb-16 px-6 lg:px-12 flex items-center border-b border-gray-100">
          <div className="mx-auto grid max-w-[1536px] w-full items-center gap-16 lg:grid-cols-2">
            
            <motion.div initial="hidden" animate="visible" variants={stagger} className="relative z-10 max-w-2xl">
              <motion.div variants={fadeUp} className="mb-6 inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-1.5 text-xs font-semibold tracking-wide text-gray-600">
                Odkryj nową jakość
              </motion.div>
              
              <motion.h1 variants={fadeUp} className="text-balance text-[clamp(3rem,6vw,5.5rem)] font-bold leading-[1.05] tracking-tight text-black">
                Stalowa <br />
                Architektura <br />
                <span className="text-blue-600">Jutra.</span>
              </motion.h1>
              
              <motion.p variants={fadeUp} className="mt-8 text-pretty text-lg leading-relaxed text-gray-500">
                GMS System łączy jakość i nowoczesny design. Skonfiguruj swój produkt szybciej, bez zgadywania i chaosu katalogowego. Od garaży po wiaty śmietnikowe.
              </motion.p>
              
              <motion.div variants={fadeUp} className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link href="/sklep" className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-black px-8 text-sm font-semibold text-white transition-all hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-gray-200">
                  Skonfiguruj produkt <ArrowRight size={16} />
                </Link>
                <Link href="/kontakt" className="inline-flex h-14 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-8 text-sm font-semibold text-black transition-all hover:bg-gray-50 hover:border-gray-300">
                  Kontakt z doradcą
                </Link>
              </motion.div>
            </motion.div>

            {/* 3D SCENE CONTAINER */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.2 }} className="relative h-[600px] w-full lg:h-[750px] bg-gray-50 rounded-[40px] overflow-hidden">
              <Scene />
              
              {/* Overlay labels */}
              <div className="absolute top-6 left-6 rounded-xl bg-white/80 px-4 py-2 text-xs font-semibold text-gray-800 backdrop-blur-md shadow-sm border border-white">
                Interaktywny model 3D
              </div>
              <div className="absolute bottom-6 right-6 rounded-2xl bg-white p-5 shadow-xl border border-gray-100 max-w-[200px]">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Rozwiązania</p>
                <p className="mt-1 text-3xl font-black text-black">17+</p>
                <p className="text-sm font-medium text-gray-500 leading-tight mt-1">Dostępnych w jednym systemie</p>
              </div>
            </motion.div>
            
          </div>
        </section>

        {/* SYSTEM CARDS SECTION */}
        <motion.section variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-10%' }} className="px-6 py-24 lg:px-12 lg:py-32 bg-gray-50/50">
          <div className="mx-auto max-w-[1536px]">
            <motion.div variants={fadeUp} className="max-w-2xl mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-black sm:text-5xl">Znajdź rozwiązanie</h2>
              <p className="mt-4 text-gray-500 text-lg">Prosty i czytelny podział na kategorie, bez błądzenia po stronie.</p>
            </motion.div>
            
            <div className="grid gap-6 lg:grid-cols-3">
              {systemCards.map(({ eyebrow, title, description, icon: Icon, href, links }) => (
                <motion.article key={title} variants={fadeUp} className="group relative flex flex-col rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-md hover:ring-gray-200">
                  <div className="mb-8 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600">{eyebrow}</span>
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-600 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600">
                      <Icon size={24} />
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-black">{title}</h3>
                  <p className="mt-3 mb-8 flex-grow text-gray-500">{description}</p>
                  
                  <div className="mb-8 flex flex-wrap gap-2">
                    {links.map((item) => (
                      <span key={item} className="rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600">
                        {item}
                      </span>
                    ))}
                  </div>
                  
                  <Link href={href} className="inline-flex items-center gap-2 text-sm font-bold text-black transition-colors hover:text-blue-600">
                    Zobacz szczegóły <ChevronRight size={16} />
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </motion.section>

        {/* PRODUCT TILES SECTION */}
        <motion.section variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-10%' }} className="px-6 py-24 lg:px-12 lg:py-32">
          <div className="mx-auto max-w-[1536px]">
            <motion.div variants={fadeUp} className="mb-12 max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight text-black sm:text-5xl">Przeglądaj produkty</h2>
            </motion.div>
            
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {productTiles.map(({ name, href, icon: Icon }) => (
                <motion.div key={name} variants={fadeUp}>
                  <Link href={href} className="group flex flex-col justify-between rounded-[24px] bg-gray-50 p-6 transition-all hover:bg-black hover:text-white min-h-[200px]">
                    <Icon size={28} className="text-gray-400 transition-colors group-hover:text-white" />
                    <div>
                      <strong className="block text-xl font-bold">{name}</strong>
                      <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-gray-500 transition-colors group-hover:text-gray-300">
                        Sprawdź <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* PROOF POINTS SECTION */}
        <motion.section variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-10%' }} className="px-6 py-24 lg:px-12 lg:py-32 bg-black text-white">
          <div className="mx-auto grid max-w-[1536px] gap-12 lg:grid-cols-2 items-center">
            
            <motion.div variants={fadeUp}>
              <h2 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">GMS System</h2>
              <p className="mt-6 text-xl leading-relaxed text-gray-400">
                Prowadzimy klienta do decyzji. Tłumaczymy system: gdzie produkt pasuje, co rozwiązuje i jaki ma być następny krok.
              </p>
            </motion.div>
            
            <div className="grid gap-6 sm:grid-cols-2">
              {proofPoints.map((point) => (
                <motion.article key={point} variants={fadeUp} className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6">
                  <CheckCircle2 className="text-blue-500 mb-4" size={24} />
                  <p className="font-semibold text-gray-200">{point}</p>
                </motion.article>
              ))}
            </div>
            
          </div>
        </motion.section>
      </main>

      <Footer />
    </>
  );
}
