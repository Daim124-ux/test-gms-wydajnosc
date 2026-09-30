'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle2, X, MapPin, User, ChevronDown } from 'lucide-react';
import { MAP_SVG } from './mapString';

interface MapDot {
  id: string;
  name: string;
  top: string;
  left: string;
}

import { useLocale } from 'next-intl';

// Mapa z ID z Illustratora (bez numerów zduplikowanych warstw) na kody ISO 3166-1 alpha-2
const COUNTRY_CODE_MAP: Record<string, string> = {
  'Saudi_Arabia': 'SA', 'Serbia': 'RS', 'Italy': 'IT', 'Greece': 'GR',
  'Iceland': 'IS', 'Portugal': 'PT', 'Spain': 'ES', 'Ukraine': 'UA',
  'Algeria': 'DZ', 'Morocco': 'MA', 'Tunisia': 'TN', 'Iraq': 'IQ',
  'Jordan': 'JO', 'Syria': 'SY', 'Russia': 'RU', 'Cyprus': 'CY',
  'Israel': 'IL', 'Lebanon': 'LB', 'Georgia': 'GE', 'Belarus': 'BY',
  'Poland': 'PL', 'Lithuania': 'LT', 'Denmark': 'DK', 'Norway': 'NO',
  'Sweden': 'SE', 'Finland': 'FI', 'Germany': 'DE', 'Netherlands': 'NL',
  'Czechia': 'CZ', 'Latvia': 'LV', 'Estonia': 'EE', 'Slovakia': 'SK',
  'Hungary': 'HU', 'Moldova': 'MD', 'Bulgaria': 'BG', 'France': 'FR',
  'Switzerland': 'CH', 'Croatia': 'HR', 'Romania': 'RO', 'Austria': 'AT',
  'Slovenia': 'SI', 'Bosnia_and_Herzegovina': 'BA', 'Montenegro': 'ME',
  'Albania': 'AL', 'North_Macedonia': 'MK', 'Kosovo': 'XK', 'Ireland': 'IE',
  'Monaco': 'MC', 'Andorra': 'AD', 'Iran': 'IR', 'Azerbaijan': 'AZ',
  'Kazakhstan': 'KZ', 'Luxembourg': 'LU', 'Liechtenstein': 'LI',
  'Belgium': 'BE', 'Armenia': 'AM'
};

// Kraje UK nie posiadają oddzielnych kodów alpha-2 wspieranych szeroko przez Intl.DisplayNames
const UK_COUNTRIES: Record<string, Record<string, string>> = {
  'England': { pl: 'Anglia', en: 'England', de: 'England', fr: 'Angleterre', it: 'Inghilterra', es: 'Inglaterra', cs: 'Anglie', sk: 'Anglicko', ua: 'Англія' },
  'Scotland': { pl: 'Szkocja', en: 'Scotland', de: 'Schottland', fr: 'Écosse', it: 'Scozia', es: 'Escocia', cs: 'Skotsko', sk: 'Škótsko', ua: 'Шотландія' },
  'Wales': { pl: 'Walia', en: 'Wales', de: 'Wales', fr: 'Pays de Galles', it: 'Galles', es: 'Gales', cs: 'Wales', sk: 'Wales', ua: 'Уельс' },
  'Northern_Ireland': { pl: 'Irlandia Północna', en: 'Northern Ireland', de: 'Nordirland', fr: 'Irlande du Nord', it: 'Irlanda del Nord', es: 'Irlanda del Norte', cs: 'Severní Irsko', sk: 'Severné Írsko', ua: 'Північна Ірландія' }
};

const UK_FLAGS_CDN: Record<string, string> = {
  'England': 'gb-eng',
  'Scotland': 'gb-sct',
  'Wales': 'gb-wls',
  'Northern_Ireland': 'gb-nir'
};

const getFlagUrl = (countryId: string) => {
  if (UK_FLAGS_CDN[countryId]) return `https://flagcdn.com/w40/${UK_FLAGS_CDN[countryId]}.png`;
  const isoCode = COUNTRY_CODE_MAP[countryId];
  if (!isoCode) return '';
  return `https://flagcdn.com/w40/${isoCode.toLowerCase()}.png`;
};

export default function HomeWhereToBuy() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [locations, setLocations] = useState<MapDot[]>([]);
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const mobileListRef = useRef<HTMLDivElement>(null);
  const [waveComplete, setWaveComplete] = useState(false);

  useEffect(() => {
    if (activeId && mobileListRef.current) {
      const container = mobileListRef.current;
      const el = container.querySelector(`#country-list-${activeId}`) as HTMLElement;
      if (el) {
        const containerCenter = container.offsetWidth / 2;
        const elCenter = el.offsetLeft + (el.offsetWidth / 2);
        container.scrollTo({
          left: elCenter - containerCenter,
          behavior: 'smooth'
        });
      }
    }
  }, [activeId]);

  const locale = useLocale();
  const countryNames = new Intl.DisplayNames([locale], { type: 'region' });

  useEffect(() => {
    if (!svgContainerRef.current) return;
    
    const svgEl = svgContainerRef.current.querySelector('svg');
    if (!svgEl) return;
    
    svgEl.classList.add('w-full', 'h-full', 'absolute', 'inset-0');
    svgEl.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    
    const elements = svgEl.querySelectorAll('[id]');
    
    const countryPaths: { id: string, prettyName: string, cx: number, cy: number, element: SVGGraphicsElement }[] = [];
    
    elements.forEach(el => {
      const id = el.id;
      
      // Strict whitelist: ID must be only letters/underscores, optionally ending in -number or _number
      // This automatically rejects 'g3084', 'path123', etc.
      if (!id || !/^[a-zA-Z_]+(?:-\d+|_\d+)?$/.test(id)) return;
      
      // Also ignore specific generic graphic tool names that are just letters
      if (/^(path|layer|svg|defs|namedview|page|map|legend|warstwa_2)$/i.test(id)) return;
      if (id.toLowerCase().endsWith('_group')) return; // Ignore Scotland_group etc.
      
      // Formatowanie nazwy jako klucza unikalnego (np. Poland-2 -> Poland)
      const baseName = id.replace(/(-\d+|_\d+)$/, '');
      const prettyName = baseName
        .replace(/_/g, ' ')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .trim()
        .replace(/\b\w/g, l => l.toUpperCase());

      // Zawsze aplikuj style wypełnienia do wszystkich elementów państwa
      if (typeof (el as SVGGraphicsElement).getBBox === 'function') {
        const bbox = (el as SVGGraphicsElement).getBBox();
        if (bbox.width > 0 && bbox.height > 0) {
          const htmlEl = el as HTMLElement;
          htmlEl.style.fill = 'transparent';
          htmlEl.style.setProperty('stroke', 'rgb(107, 114, 128)', 'important');
          htmlEl.style.setProperty('stroke-width', '2px', 'important');
          htmlEl.style.transition = 'all 0.3s ease';
          
          const centerX = bbox.x + bbox.width / 2;
          const centerY = bbox.y + bbox.height / 2;
          
          countryPaths.push({
            id: baseName,
            prettyName,
            cx: centerX,
            cy: centerY,
            element: el as SVGGraphicsElement
          });
        }
      }
    });

    // Pobierz kropki (z Warstwy 2 lub ogólnie wszystkie okręgi i elipsy)
    const manualDots = svgEl.querySelectorAll('circle, ellipse');
    const finalDots: MapDot[] = [];
    const viewBox = svgEl.getAttribute('viewBox')?.split(' ').map(Number);
    const vbWidth = viewBox?.[2] || 1530;
    const vbHeight = viewBox?.[3] || 1066;

    manualDots.forEach(dot => {
      // Jeśli kropka ma transform="translate(x, y)", to getAttribute('cx') może być 0
      // ale u Ciebie mają definitywnie cx i cy
      const cx = parseFloat(dot.getAttribute('cx') || '0');
      const cy = parseFloat(dot.getAttribute('cy') || '0');
      
      // Dodatkowe bezpieczeństwo - ukrycie bezpośrednio z JS
      (dot as HTMLElement).style.setProperty('display', 'none', 'important');
      (dot as HTMLElement).style.setProperty('opacity', '0', 'important');

      let closestCountry = null;
      let minDistance = Infinity;

      try {
        const point = new DOMPoint(cx, cy);
        for (const country of countryPaths) {
          if ((country.element as any).isPointInFill && (country.element as any).isPointInFill(point)) {
            closestCountry = country;
            break;
          }
        }
      } catch (e) {
      }

      if (!closestCountry) {
        for (const country of countryPaths) {
          const dist = Math.sqrt(Math.pow(country.cx - cx, 2) + Math.pow(country.cy - cy, 2));
          if (dist < minDistance) {
            minDistance = dist;
            closestCountry = country;
          }
        }
      }

      if (closestCountry) {
        let localizedName = closestCountry.prettyName;
        try {
          const baseId = closestCountry.id.replace(/-\d+$/, '').replace(/_\d+$/, '');
          const regionNames = new Intl.DisplayNames([locale], { type: 'region' });
          
          if (UK_COUNTRIES[baseId]) {
            localizedName = UK_COUNTRIES[baseId][locale] || UK_COUNTRIES[baseId]['en'];
          } else if (COUNTRY_CODE_MAP[baseId]) {
            localizedName = regionNames.of(COUNTRY_CODE_MAP[baseId]) || closestCountry.prettyName;
          }
        } catch (e) {
          console.warn("Translation failed for", closestCountry.id);
        }

        finalDots.push({
          id: closestCountry.id,
          name: localizedName,
          left: `${(cx / vbWidth) * 100}%`,
          top: `${(cy / vbHeight) * 100}%`
        });
      }
    });

    const uniqueDots = Array.from(new Map(finalDots.map(d => [d.name, d])).values());
    setLocations(uniqueDots);
  }, []);

  const activeLocation = locations.find(loc => loc.id === activeId);

  useEffect(() => {
    if (activeId && activeLocation) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setIsDropdownOpen(false);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeId, activeLocation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setTimeout(() => setSubmitted(true), 500);
    }
  };

  const closeForm = () => {
    setActiveId(null);
    setSubmitted(false);
    setEmail('');
  };

  return (
    <section className="relative w-full py-32 bg-[#050505] overflow-hidden flex flex-col items-center border-t border-white/5">
      {/* Tło - globalny blask */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#ffcc33]/5 blur-[200px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 flex flex-col items-center">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold tracking-widest text-[#ffcc33] uppercase mb-6"
        >
          Sieć dystrybucji
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-semibold tracking-tighter text-white text-center max-w-3xl mb-16"
        >
          Gdzie kupić? <br />
          <span className="text-gray-500">Skontaktuj się z naszym dystrybutorem.</span>
        </motion.h2>

        {/* Kontener Mapy (Wspólny) */}
        <div 
          className="relative w-full max-w-[1200px] mx-auto overflow-hidden px-2 md:px-0 mt-4 md:mt-0 [mask-image:radial-gradient(50%_50%_at_50%_50%,black_50%,transparent_100%)]"
        >
          <div className="relative w-full h-auto" style={{ aspectRatio: '1148.08 / 799.57' }}>
            {/* Animowana Fala Skanowania pod mapą - Zatrzymuje się na środku */}
            <motion.div
              initial={{ left: '-50%', opacity: 0 }}
              whileInView={{ left: '50%', x: '-50%', opacity: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 2.0, ease: 'easeOut' }}
              className="absolute inset-y-0 w-2/3 md:w-1/2 bg-gradient-to-r from-transparent via-[#ffcc33]/30 to-transparent blur-[100px] z-0 pointer-events-none"
            />

            {/* SVG Map Container */}
            <div 
              ref={svgContainerRef} 
              className="relative z-10 w-full [&_svg]:!w-full [&_svg]:!h-auto [&_path]:!stroke-gray-600 [&_path]:!stroke-[2px] [&_path]:!fill-transparent [&_circle]:!hidden [&_ellipse]:!hidden"
              dangerouslySetInnerHTML={{ 
                __html: MAP_SVG
                  .replace('width="1148.08"', 'width="100%"')
                  .replace('height="799.57"', '') 
              }}
            />

            {/* Kropki - pojawiają się z opóźnieniem */}
            {locations.map((loc, index) => (
              <motion.div
                key={loc.id}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1.5 + (index * 0.05), type: 'spring', stiffness: 200 }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
                style={{ top: loc.top, left: loc.left }}
              >
                {/* Tooltip przy najeździe (tylko DESKTOP) */}
                <AnimatePresence>
                  {(hoveredId === loc.id || activeId === loc.id) && (
                    <motion.div
                      initial={{ opacity: 0, y: 5, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.9 }}
                      className="hidden md:block absolute bottom-full mb-3 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-[#050505]/95 backdrop-blur-xl border border-[#ffcc33]/50 rounded-lg shadow-[0_0_20px_rgba(255,107,0,0.3)] pointer-events-none whitespace-nowrap z-30"
                    >
                      <span className="text-[#ffcc33] text-sm font-bold tracking-wide">{loc.name}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Kropka z pulsowaniem */}
                <button
                  onMouseEnter={() => {
                    setHoveredId(loc.id);
                    const el = svgContainerRef.current?.querySelector(`#${loc.id}`) as HTMLElement;
                    if (el) {
                      el.style.fill = 'rgba(255, 107, 0, 0.4)';
                      el.style.setProperty('stroke', '#ffcc33', 'important');
                      el.style.setProperty('stroke-width', '1px', 'important');
                    }
                  }}
                  onMouseLeave={() => {
                    setHoveredId(null);
                    const el = svgContainerRef.current?.querySelector(`#${loc.id}`) as HTMLElement;
                    if (el) {
                      el.style.fill = 'transparent';
                      el.style.setProperty('stroke', 'rgb(107, 114, 128)', 'important');
                      el.style.setProperty('stroke-width', '2px', 'important');
                    }
                  }}
                  onClick={() => setActiveId(loc.id)}
                  className={`relative flex items-center justify-center transition-all duration-300 group cursor-pointer ${
                    activeId === loc.id ? 'w-6 h-6 md:w-8 md:h-8' : 'w-4 h-4 md:w-6 md:h-6 hover:scale-125'
                  }`}
                >
                  {/* Zewnętrzna poświata kropki */}
                  <div className="absolute inset-0 rounded-full bg-[#ffcc33]/20 blur-[2px] md:blur-sm" />
                  
                  {/* Wewnętrzny rdzeń */}
                  <div className={`relative z-10 rounded-full transition-colors duration-300 shadow-[0_0_10px_rgba(255,107,0,0.8)] ${
                    activeId === loc.id ? 'w-2.5 h-2.5 md:w-3.5 md:h-3.5 bg-[#ffcc33]' : 'w-1.5 h-1.5 md:w-2.5 md:h-2.5 bg-[#ffcc33] group-hover:bg-[#ffcc33]'
                  }`} />
                  
                  {/* Pierścień pulsujący */}
                  <div className="absolute inset-0 rounded-full border border-[#ffcc33]/60 bg-[#ffcc33]/30 animate-ping" style={{ animationDuration: '2s' }} />
                </button>
              </motion.div>
            ))}

            {/* Removed inline desktop form */}
          </div>
        </div>

        {/* Lista państw pod mapą (MOBILE) */}
        <div className="block md:hidden w-full max-w-[1200px] mx-auto">
          <div 
            ref={mobileListRef}
            className="flex w-full overflow-x-auto snap-x snap-mandatory gap-3 py-4 mt-2 px-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {locations.map((loc) => {
              const isActive = activeId === loc.id;
              return (
                <button
                  key={loc.id}
                  id={`country-list-${loc.id}`}
                  onClick={() => setActiveId(loc.id)}
                  className={`shrink-0 snap-center px-5 py-2.5 rounded-full border transition-all duration-300 text-sm font-semibold whitespace-nowrap ${
                    isActive 
                      ? 'bg-[#ffcc33] text-black border-[#ffcc33] shadow-[0_0_15px_rgba(255,204,51,0.4)]' 
                      : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {loc.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* POPUP Modal (Zamiast osadzonych formularzy) */}
      <AnimatePresence>
        {activeId && activeLocation && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Tło przyciemniające (Backdrop) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeForm}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            
            {/* Właściwy Popup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-10"
            >
              <div className="p-6 md:p-8">
                <button 
                  onClick={closeForm}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-[#ffcc33]/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-[#ffcc33]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-white leading-tight">Dystrybutor</h3>
                    <p className="text-gray-400 text-sm mt-0.5">Skontaktuj się z wybranym regionem</p>
                  </div>
                </div>

                {!submitted ? (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    
                    {/* Wybór Państwa */}
                    <div className="flex flex-col gap-1.5 relative">
                      <label className="text-xs text-gray-400 font-medium uppercase tracking-wider pl-1">Wybrane państwo</label>
                      <button 
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-full flex items-center justify-between bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-4 text-white text-base hover:bg-white/10 transition-all text-left focus:outline-none focus:border-[#ffcc33]/50"
                      >
                        <span className="flex items-center gap-3">
                          {getFlagUrl(activeLocation.id) && (
                            <img src={getFlagUrl(activeLocation.id)} alt={activeLocation.name} className="w-5 rounded-[2px]" />
                          )}
                          {activeLocation.name}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {isDropdownOpen && (
                          <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-[100%] left-0 w-full mt-2 bg-[#111] border border-white/10 rounded-xl p-3 shadow-xl z-20"
                          >
                            <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto [scrollbar-width:thin] pr-1">
                              {locations.map(loc => (
                                <button
                                  key={loc.id}
                                  type="button"
                                  onClick={() => {
                                    setActiveId(loc.id);
                                    setIsDropdownOpen(false);
                                  }}
                                  className={`flex items-center gap-2 py-2 px-3 text-sm rounded-lg text-left transition-colors ${activeId === loc.id ? 'bg-[#ffcc33] text-black font-semibold' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}
                                >
                                  <span className="flex items-center justify-center shrink-0 w-6">
                                    {getFlagUrl(loc.id) && (
                                      <img src={getFlagUrl(loc.id)} alt={loc.name} className="w-5 rounded-[2px] shadow-sm" />
                                    )}
                                  </span>
                                  <span className="truncate">{loc.name}</span>
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Imię */}
                    <div className="flex flex-col gap-1.5 mt-2">
                      <label className="text-xs text-gray-400 font-medium uppercase tracking-wider pl-1">Imię (opcjonalnie)</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Twoje imię"
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#ffcc33]/50 focus:bg-white/10 transition-all"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-gray-400 font-medium uppercase tracking-wider pl-1">E-mail (wymagany)</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Twój adres e-mail"
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#ffcc33]/50 focus:bg-white/10 transition-all"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#ffcc33] text-black font-bold py-3.5 rounded-xl hover:bg-white transition-colors mt-4 text-sm tracking-wide shadow-[0_0_20px_rgba(255,204,51,0.2)] hover:shadow-[0_0_25px_rgba(255,204,51,0.4)]"
                    >
                      Wyślij prośbę o kontakt
                    </button>
                    
                    <p className="text-gray-500 text-xs text-center mt-2 px-4">
                      Zostaw nam swój kontakt, a my przekażemy go partnerowi, który się do Ciebie odezwie.
                    </p>
                  </form>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-8 text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-8 h-8 text-green-500" />
                    </div>
                    <h4 className="text-xl font-semibold text-white mb-2">Wysłano pomyślnie!</h4>
                    <p className="text-gray-400 text-base max-w-[250px]">
                      Dziękujemy, {name ? <span className="text-white">{name}</span> : ''}{name ? ', p' : 'P'}rzekazaliśmy Twoje zgłoszenie do dystrybutora w: <strong className="text-[#ffcc33]">{activeLocation.name}</strong>.
                    </p>
                    <button
                      onClick={closeForm}
                      className="mt-8 w-full bg-white/10 text-white font-semibold py-3 rounded-xl hover:bg-white/20 transition-colors text-sm"
                    >
                      Zamknij
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
