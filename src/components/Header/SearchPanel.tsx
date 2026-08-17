'use client';

import Fuse from 'fuse.js';
import { motion } from 'framer-motion';
import { useDeferredValue, useMemo, useState } from 'react';
import { Link } from '@/i18n/navigation';

interface SearchPanelProps {
  onClose: () => void;
}

interface SearchItem {
  title: string;
  href: string;
  category: string;
  keywords: string;
}

const SEARCH_ITEMS: SearchItem[] = [
  { title: 'Garaże stalowe', href: '/system-dom/garaze-stalowe', category: 'Garaże', keywords: 'garaż blaszany tynkowany konstrukcja stalowa' },
  { title: 'Garaże Superstrong', href: '/system-dom/garaze-superstrong', category: 'Garaże', keywords: 'garaż mocny modułowy szkieletowy' },
  { title: 'Wiata na rowery', href: '/system-dom/wiata-stalowa-na-rowery', category: 'Wiaty', keywords: 'rower rowerowa schowek garaż rowerowy' },
  { title: 'Wiata na jednoślady', href: '/produkt/wiata-na-jednoslady', category: 'Wiaty', keywords: 'motocykl motor skuter jednoślad' },
  { title: 'Wiata na wózki inwalidzkie', href: '/produkt/wiata-na-wozki-inwalidzkie', category: 'Wiaty', keywords: 'wózek niepełnosprawność dostępność' },
  { title: 'Wiata ogrodowa', href: '/sklep/wiaty-stalowe/wiata-ogrodowa', category: 'Wiaty', keywords: 'ogród domek narzędziowy drewno składzik' },
  { title: 'Bramy uchylne garażowe', href: '/bramy-uchylne', category: 'Bramy', keywords: 'brama uchylna compact classic vent' },
  { title: 'Bramy rozwierne', href: '/system-dom/bramy-garazowe/bramy-rozwierne', category: 'Bramy', keywords: 'brama skrzydłowa blaszana jedno dwuskrzydłowa' },
  { title: 'Bramy rozwierne panelowe', href: '/system-dom/bramy-garazowe/bramy-rozwierne-panelowe', category: 'Bramy', keywords: 'brama panelowa skrzydłowa' },
  { title: 'Bramy segmentowe', href: '/system-dom/bramy-garazowe/bramy-segmentowe', category: 'Bramy', keywords: 'brama segment przemysłowa napęd' },
  { title: 'Altany z zielonym dachem', href: '/osiedle-system/altany-z-zielonym-dachem', category: 'Altany i osłony', keywords: 'altana wiata zielony dach rośliny eko' },
  { title: 'Altany i wiaty śmietnikowe', href: '/osiedle-system/altany-smietnikowe', category: 'Altany i osłony', keywords: 'śmietnik odpady kosze wiata altanka' },
  { title: 'Kompaktowe osłony śmietnikowe', href: '/osiedle-system/kompaktowe-oslony-smietnikowe', category: 'Altany i osłony', keywords: 'nano obudowa kosza odpady osłona' },
  { title: 'Drzwi piwniczne', href: '/osiedle-system/drzwi-piwniczne', category: 'Zabudowy', keywords: 'drzwi stalowe piwnica komórka lokatorska' },
  { title: 'Garaże zbiorcze', href: '/osiedle-system/garaze-zbiorcze', category: 'Zabudowy', keywords: 'boks parking podziemny miejsce postojowe' },
  { title: 'Ścianki działowe – wygrodzenia', href: '/osiedle-system/wygrodzenia-gms', category: 'Zabudowy', keywords: 'komórka lokatorska boks rowerowy piwnica' },
  { title: 'Wygrodzenia przemysłowe', href: '/osiedle-system/wygrodzenia-przemyslowe', category: 'Zabudowy', keywords: 'magazyn hala bezpieczeństwo przemysł ścianka' },
  { title: 'Sklep', href: '/sklep', category: 'Strony', keywords: 'kup konfigurator cena zamówienie' },
  { title: 'Realizacje', href: '/realizacje', category: 'Strony', keywords: 'projekty galeria wykonania zdjęcia' },
  { title: 'O nas', href: '/o-nas', category: 'Firma', keywords: 'firma GMS historia producent' },
  { title: 'Kariera', href: '/kariera', category: 'Firma', keywords: 'praca rekrutacja zatrudnienie' },
  { title: 'Blog | GMS Press', href: '/blog', category: 'Firma', keywords: 'artykuły poradniki aktualności wiedza' },
  { title: 'Dystrybutorzy', href: '/dystrybutorzy', category: 'Firma', keywords: 'sprzedawca dealer partner mapa' },
  { title: 'Strefa Partnera', href: '/strefa-partnera', category: 'Firma', keywords: 'partner logowanie współpraca' },
  { title: 'Kontakt', href: '/kontakt', category: 'Strony', keywords: 'telefon email wycena oferta doradca' },
  { title: 'Do pobrania', href: '/do-pobrania', category: 'Strony', keywords: 'katalog pdf instrukcja dokumenty pliki' },
];

export default function SearchPanel({ onClose }: SearchPanelProps) {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query.trim());
  const fuse = useMemo(() => new Fuse(SEARCH_ITEMS, {
    keys: [{ name: 'title', weight: 0.65 }, { name: 'keywords', weight: 0.25 }, { name: 'category', weight: 0.1 }],
    threshold: 0.34,
    ignoreLocation: true,
  }), []);
  const results = deferredQuery ? fuse.search(deferredQuery, { limit: 9 }).map(({ item }) => item) : SEARCH_ITEMS.slice(0, 6);

  return (
    <motion.div className="search-layer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <motion.section className="search-panel" role="dialog" aria-modal="true" aria-label="Wyszukiwarka" initial={{ opacity: 0, y: -18, scale: 0.985 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -12, scale: 0.99 }} transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}>
        <div className="search-panel__input-row">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></svg>
          <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Czego szukasz?" aria-label="Szukaj stron i produktów" />
          {query && <button type="button" onClick={() => setQuery('')} aria-label="Wyczyść wyszukiwanie">×</button>}
          <button type="button" className="search-panel__close" onClick={onClose} aria-label="Zamknij wyszukiwarkę">ESC</button>
        </div>
        <div className="search-panel__meta"><span>{deferredQuery ? `Wyniki dla „${deferredQuery}”` : 'Najczęściej wybierane'}</span><span>{results.length} {results.length === 1 ? 'wynik' : 'wyników'}</span></div>
        <div className="search-panel__results" aria-live="polite">
          {results.map((item, index) => (
            <Link href={item.href} onClick={onClose} key={item.href}>
              <span className="search-panel__number">{String(index + 1).padStart(2, '0')}</span>
              <span><strong>{item.title}</strong><small>{item.category}</small></span>
              <svg viewBox="0 0 18 18" aria-hidden="true"><path d="M4 9h10M10 5l4 4-4 4" /></svg>
            </Link>
          ))}
          {results.length === 0 && <div className="search-panel__empty"><strong>Brak wyników</strong><p>Spróbuj wpisać np. „garaż”, „wiata” albo „śmietnik”.</p></div>}
        </div>
      </motion.section>
    </motion.div>
  );
}
