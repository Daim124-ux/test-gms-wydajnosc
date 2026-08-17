'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from '@/i18n/navigation';

interface MegaMenuProps {
  onClose: () => void;
  onEnter: () => void;
}

interface ProductLink {
  href: string;
  label: string;
  image: string;
}

interface ProductFamily {
  id: string;
  eyebrow: string;
  title: string;
  links: ProductLink[];
}

export default function MegaMenu({ onClose, onEnter }: MegaMenuProps) {
  const t = useTranslations('navigation.megaMenu');
  const locale = useLocale();
  const isPolish = locale === 'pl';
  const previewTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [preview, setPreview] = useState<{ image: string; label: string; family: string; x: number; y: number } | null>(null);

  useEffect(() => () => {
    if (previewTimer.current) clearTimeout(previewTimer.current);
  }, []);

  const families: ProductFamily[] = [
    {
      id: 'garages', eyebrow: '01', title: isPolish ? 'Garaże' : t('tabs.garages'),
      links: [
        { href: '/system-dom/garaze-stalowe', label: t('tabs.garages'), image: 'https://gms-system.com/wp-content/uploads/2023/09/garaze_stalowe.jpg' },
        { href: '/system-dom/garaze-superstrong', label: t('tabs.superstrong'), image: 'https://gms-system.com/wp-content/uploads/2022/09/Montaz-do-ziemi.avif' },
      ],
    },
    {
      id: 'shelters', eyebrow: '02', title: t('tabs.steelShelters'),
      links: [
        { href: '/system-dom/wiata-stalowa-na-rowery', label: t('tabs.bikeShelter'), image: '/assets/images/wiaty-stalowe-na-rowery/Wiata-na-rowery-GMS-System.jpg' },
        { href: '/produkt/wiata-na-jednoslady', label: isPolish ? 'Wiata na jednoślady' : 'Motorcycle shelter', image: '/assets/images/wiaty-stalowe-na-rowery/Wiata-na-meble-ogrodowe.jpg' },
        { href: '/produkt/wiata-na-wozki-inwalidzkie', label: isPolish ? 'Wiata na wózki inwalidzkie' : 'Wheelchair shelter', image: 'https://gms-system.com/wp-content/uploads/2022/04/Wiaty-inwalidzkie-scena.webp' },
        { href: '/sklep/wiaty-stalowe/wiata-ogrodowa', label: isPolish ? 'Wiata ogrodowa' : 'Garden shelter', image: 'https://gms-system.com/wp-content/uploads/2022/04/Obrazek-produktu-wiata-ogrodowa-lewe.webp' },
      ],
    },
    {
      id: 'gates', eyebrow: '03', title: t('tabs.gates'),
      links: [
        { href: '/bramy-uchylne', label: t('gatesTitles.tilt'), image: 'https://gms-system.com/wp-content/uploads/2022/08/Compact_panel_c_baner.avif' },
        { href: '/system-dom/bramy-garazowe/bramy-rozwierne', label: t('gatesTitles.hinged'), image: 'https://gms-system.com/wp-content/uploads/2022/08/Bramy_segmentowe_miniaturka_wide-scaled.avif' },
        { href: '/system-dom/bramy-garazowe/bramy-rozwierne-panelowe', label: t('gatesTitles.hingedPanel'), image: 'https://gms-system.com/wp-content/uploads/2022/08/Compact_panel_c_baner.avif' },
        { href: '/system-dom/bramy-garazowe/bramy-segmentowe', label: t('gatesTitles.sectional'), image: 'https://gms-system.com/wp-content/uploads/2022/08/Segmentowa_przemyslowa_front.avif' },
      ],
    },
    {
      id: 'shelter-buildings', eyebrow: '04', title: isPolish ? 'Altany i osłony' : 'Shelters & enclosures',
      links: [
        { href: '/osiedle-system/altany-z-zielonym-dachem', label: t('tabs.greenShelters'), image: 'https://gms-system.com/wp-content/uploads/2023/09/Alatna-z-zielonym-dachem_menu.jpg' },
        { href: '/osiedle-system/altany-smietnikowe', label: t('tabs.trashShelters'), image: 'https://gms-system.com/wp-content/uploads/2022/06/altana-smietnikowa.webp' },
        { href: '/osiedle-system/kompaktowe-oslony-smietnikowe', label: t('tabs.compactShelters'), image: 'https://gms-system.com/wp-content/uploads/2023/09/Oslony_smietnikowe.jpg' },
      ],
    },
    {
      id: 'enclosures', eyebrow: '05', title: isPolish ? 'Zabudowy i wygrodzenia' : 'Partitions & enclosures',
      links: [
        { href: '/osiedle-system/drzwi-piwniczne', label: t('titles.drzwi'), image: 'https://gms-system.com/wp-content/uploads/2022/07/Odbojnik_drzwi_piwniczne.avif' },
        { href: '/osiedle-system/garaze-zbiorcze', label: t('titles.garaze_zbiorcze'), image: 'https://gms-system.com/wp-content/uploads/2023/09/garaze_stalowe.jpg' },
        { href: '/osiedle-system/wygrodzenia-gms', label: isPolish ? 'Ścianki działowe – wygrodzenia' : t('titles.scianki'), image: 'https://gms-system.com/wp-content/uploads/2023/09/Oslony_smietnikowe.jpg' },
        { href: '/osiedle-system/wygrodzenia-przemyslowe', label: t('titles.wygrodzenia'), image: 'https://gms-system.com/wp-content/uploads/2023/09/garaze_stalowe.jpg' },
      ],
    },
  ];

  const startPreview = (product: ProductLink, family: string, target: HTMLAnchorElement) => {
    if (previewTimer.current) clearTimeout(previewTimer.current);
    setPreview(null);
    const rect = target.getBoundingClientRect();
    const width = 238;
    const x = Math.min(rect.right + 12, window.innerWidth - width - 16);
    const y = Math.max(90, Math.min(rect.top - 34, window.innerHeight - 190));
    previewTimer.current = setTimeout(() => setPreview({ image: product.image, label: product.label, family, x, y }), 500);
  };

  const stopPreview = () => {
    if (previewTimer.current) clearTimeout(previewTimer.current);
    previewTimer.current = null;
    setPreview(null);
  };

  return (
    <motion.section className="product-menu" aria-label={isPolish ? 'Katalog produktów' : 'Product catalogue'} initial={{ opacity: 0, y: -10, scale: 0.99 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.99 }} transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }} onMouseEnter={onEnter} onMouseLeave={() => { stopPreview(); onClose(); }}>
      <div className="product-menu__intro">
        <div><span>{isPolish ? 'Pełna oferta' : 'Full range'}</span><h2>{isPolish ? 'Znajdź produkt' : 'Find a product'}</h2></div>
        <p>{isPolish ? '17 rozwiązań. Bez zgadywania, bez zbędnych kroków.' : '17 solutions. No guessing, no unnecessary steps.'}</p>
      </div>

      <div className="product-menu__grid">
        {families.map((family) => (
          <article className={`product-family product-family--${family.id}`} key={family.id}>
            <header><span>{family.eyebrow}</span><h3>{family.title}</h3></header>
            <div className="product-family__links">
              {family.links.map((product) => (
                <Link href={product.href} key={product.href} onClick={onClose} onMouseEnter={(event) => startPreview(product, family.title, event.currentTarget)} onMouseLeave={stopPreview}>
                  <span>{product.label}</span><svg viewBox="0 0 18 18" aria-hidden="true"><path d="M4 9h10M10 5l4 4-4 4" /></svg>
                </Link>
              ))}
            </div>
          </article>
        ))}
      </div>

      <footer className="product-menu__footer">
        <p><span aria-hidden="true" />{isPolish ? 'Nie wiesz, które rozwiązanie wybrać?' : 'Not sure which solution to choose?'}</p>
        <Link href="/kontakt" onClick={onClose}>{isPolish ? 'Porozmawiaj z doradcą' : 'Talk to an adviser'} <span aria-hidden="true">↗</span></Link>
      </footer>

      {preview && createPortal(
        <motion.aside className="product-preview" style={{ left: preview.x, top: preview.y }} initial={{ opacity: 0, scale: 0.94, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.2 }} aria-hidden="true">
          <div className="product-preview__image"><Image src={preview.image} alt="" fill sizes="238px" /></div>
          <div><span>{preview.family}</span><strong>{preview.label}</strong></div>
        </motion.aside>,
        document.body,
      )}
    </motion.section>
  );
}
