'use client';

import Image from 'next/image';
import { useRef } from 'react';
import {
  ArrowRight,
  Bike,
  Boxes,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  DoorOpen,
  Headphones,
  Leaf,
  PanelsTopLeft,
  Ruler,
  ShieldCheck,
  Trash2,
  Warehouse,
  Wrench,
} from 'lucide-react';
import { Link } from '@/i18n/navigation';
import styles from './Store.module.css';

const categories = [
  { name: 'Garaże', href: '/system-dom/garaze-stalowe', icon: Warehouse },
  { name: 'SuperStrong', href: '/system-dom/garaze-superstrong', icon: ShieldCheck },
  { name: 'Wiaty rowerowe', href: '/system-dom/wiata-stalowa-na-rowery', icon: Bike },
  { name: 'Wiaty stalowe', href: '/system-dom/wiaty-stalowe', icon: PanelsTopLeft },
  { name: 'Bramy', href: '/system-dom/bramy-garazowe', icon: DoorOpen },
  { name: 'Zielone dachy', href: '/osiedle-system/altany-z-zielonym-dachem', icon: Leaf },
  { name: 'Altany śmietnikowe', href: '/osiedle-system/altany-smietnikowe', icon: Trash2 },
  { name: 'Zabudowy', href: '/osiedle-system/wygrodzenia-gms', icon: Boxes },
];

const featuredProducts = [
  {
    eyebrow: 'Garaże',
    name: 'Garaż stalowy',
    tagline: 'Klasyka, która nie starzeje się.',
    note: 'Zaprojektuj go pod swój dom.',
    href: '/system-dom/garaze-stalowe',
    image: '/assets/images/store/garage-steel.jpg',
    variant: 'graphite',
  },
  {
    eyebrow: 'Altany i osłony',
    name: 'Zielony dach',
    tagline: 'Więcej natury. Mniej kompromisów.',
    note: 'Nowoczesna forma dla wspólnej przestrzeni.',
    href: '/osiedle-system/altany-z-zielonym-dachem',
    image: '/assets/images/store/green-roof.jpg',
    variant: 'sage',
  },
  {
    eyebrow: 'Wiaty stalowe',
    name: 'Wiata na rowery',
    tagline: 'Bezpieczne miejsce dla każdego roweru.',
    note: 'Modułowa, trwała, gotowa na więcej.',
    href: '/system-dom/wiata-stalowa-na-rowery',
    image: '/assets/images/store/steel-shelter.webp',
    variant: 'silver',
  },
  {
    eyebrow: 'Bramy garażowe',
    name: 'Compact Panel C',
    tagline: 'Płynny ruch. Precyzyjne wykończenie.',
    note: 'Bramy uchylne prosto od producenta.',
    href: '/bramy-uchylne',
    image: '/assets/images/store/compact-panel.webp',
    variant: 'warm',
  },
  {
    eyebrow: 'Kompaktowe osłony',
    name: 'NANO',
    tagline: 'Mały format. Wielka różnica.',
    note: 'Porządek wpisany w architekturę.',
    href: '/osiedle-system/kompaktowe-oslony-smietnikowe',
    image: '/assets/images/store/nano-enclosure.jpg',
    variant: 'blue',
  },
];

const collections = [
  {
    label: 'Dla domu',
    title: 'Garaże i bramy',
    description: 'Od lekkiego garażu stalowego po zaawansowaną bramę segmentową.',
    links: [
      ['Garaże stalowe', '/system-dom/garaze-stalowe'],
      ['Garaże SuperStrong', '/system-dom/garaze-superstrong'],
      ['Bramy uchylne', '/bramy-uchylne'],
      ['Bramy segmentowe', '/system-dom/bramy-garazowe/bramy-segmentowe'],
    ],
  },
  {
    label: 'Do przechowywania',
    title: 'Wiaty i schowki',
    description: 'Dla rowerów, jednośladów, ogrodu i wszystkiego, co chcesz chronić.',
    links: [
      ['Wiata na rowery', '/system-dom/wiata-stalowa-na-rowery'],
      ['Wiata na jednoślady', '/produkt/wiata-na-jednoslady'],
      ['Wiata ogrodowa', '/sklep/wiaty-stalowe/wiata-ogrodowa'],
      ['Wiata na wózki', '/produkt/wiata-na-wozki-inwalidzkie'],
    ],
  },
  {
    label: 'Dla osiedli i firm',
    title: 'Altany i zabudowy',
    description: 'Uporządkowane otoczenie budynku, parkingu i przestrzeni przemysłowej.',
    links: [
      ['Altany z zielonym dachem', '/osiedle-system/altany-z-zielonym-dachem'],
      ['Altany śmietnikowe', '/osiedle-system/altany-smietnikowe'],
      ['Garaże zbiorcze', '/osiedle-system/garaze-zbiorcze'],
      ['Wygrodzenia', '/osiedle-system/wygrodzenia-gms'],
    ],
  },
] as const;

export default function StorePage() {
  const productsRef = useRef<HTMLDivElement>(null);

  const scrollProducts = (direction: 'left' | 'right') => {
    productsRef.current?.scrollBy({
      left: direction === 'left' ? -440 : 440,
      behavior: 'smooth',
    });
  };

  return (
    <main className={styles.store}>
      <nav className={styles.categoryRail} aria-label="Kategorie produktów">
        <div className={styles.categoryRailInner}>
          {categories.map(({ name, href, icon: Icon }) => (
            <Link href={href} className={styles.categoryItem} key={href}>
              <span><Icon aria-hidden="true" /></span>
              <strong>{name}</strong>
            </Link>
          ))}
        </div>
      </nav>

      <header className={styles.intro}>
        <h1>Sklep. <span>Wybierz stalowe rozwiązanie na lata.</span></h1>
        <div className={styles.introHelp}>
          <span className={styles.avatar}><Headphones aria-hidden="true" /></span>
          <p>Potrzebujesz pomocy?<Link href="/kontakt">Zapytaj specjalistę <ArrowRight aria-hidden="true" /></Link></p>
        </div>
      </header>

      <section className={styles.hero}>
        <Image src="/assets/images/store/gms-store-hero.webp" alt="Rodzina stalowych rozwiązań GMS: garaż, wiata rowerowa i osłona" fill priority sizes="(max-width: 760px) 100vw, 1400px" />
        <div className={styles.heroContent}>
          <span>Jedna jakość. Wiele możliwości.</span>
          <h2>Stal dopasowana<br />do Twojej przestrzeni.</h2>
          <p>Projektujemy, konfigurujemy i produkujemy w Polsce.</p>
          <div className={styles.heroActions}>
            <Link href="/system-dom/garaze-stalowe" className={styles.primaryButton}>Zobacz produkty</Link>
            <Link href="/kontakt" className={styles.textButton}>Porozmawiaj z doradcą <ArrowRight aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <section className={styles.productsSection} aria-labelledby="featured-title">
        <div className={styles.sectionHeading}>
          <h2 id="featured-title">Wyróżnione. <span>Dobry początek wyboru.</span></h2>
          <div className={styles.carouselControls}>
            <button type="button" onClick={() => scrollProducts('left')} aria-label="Poprzednie produkty"><ChevronLeft /></button>
            <button type="button" onClick={() => scrollProducts('right')} aria-label="Następne produkty"><ChevronRight /></button>
          </div>
        </div>
        <div className={styles.productScroller} ref={productsRef}>
          {featuredProducts.map((product) => (
            <Link href={product.href} className={`${styles.productCard} ${styles[product.variant]}`} key={product.href}>
              <div className={styles.productCopy}>
                <span>{product.eyebrow}</span>
                <h3>{product.name}</h3>
                <p>{product.tagline}</p>
                <small>{product.note}</small>
              </div>
              <div className={styles.productImage}>
                <Image src={product.image} alt={product.name} fill sizes="(max-width: 640px) 82vw, 410px" />
              </div>
              <span className={styles.cardArrow} aria-hidden="true"><ArrowRight /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.benefits} aria-label="Korzyści zakupów w GMS">
        <article><Ruler aria-hidden="true" /><div><strong>Na Twój wymiar</strong><span>Konfiguracja dopasowana do miejsca.</span></div></article>
        <article><ShieldCheck aria-hidden="true" /><div><strong>Prosto od producenta</strong><span>Kontrola jakości od projektu do montażu.</span></div></article>
        <article><Wrench aria-hidden="true" /><div><strong>Montaż i wsparcie</strong><span>Pomoc specjalisty na każdym etapie.</span></div></article>
      </section>

      <section className={styles.collections} aria-labelledby="collections-title">
        <div className={styles.sectionHeading}>
          <h2 id="collections-title">Cała oferta. <span>Bez szukania po systemach.</span></h2>
        </div>
        <div className={styles.collectionGrid}>
          {collections.map((collection, index) => (
            <article className={styles.collectionCard} key={collection.title}>
              <span>0{index + 1} / {collection.label}</span>
              <h3>{collection.title}</h3>
              <p>{collection.description}</p>
              <div>
                {collection.links.map(([label, href]) => (
                  <Link href={href} key={href}>{label}<ChevronRight aria-hidden="true" /></Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.help} aria-labelledby="help-title">
        <div className={styles.sectionHeading}><h2 id="help-title">Pomoc. <span>Od pomysłu do montażu.</span></h2></div>
        <div className={styles.helpGrid}>
          <Link href="/kontakt" className={styles.helpCard}><Headphones aria-hidden="true" /><span>Specjalista</span><h3>Wybierz produkt z pomocą doradcy GMS.</h3><p>Napisz lub zadzwoń. Pomożemy porównać rozwiązania.</p><ArrowRight aria-hidden="true" /></Link>
          <Link href="/konfigurator-demo" className={styles.helpCard}><PanelsTopLeft aria-hidden="true" /><span>Konfigurator</span><h3>Zobacz swój produkt, zanim go zamówisz.</h3><p>Dobierz wymiary, kolor i wyposażenie w interaktywnym 3D.</p><ArrowRight aria-hidden="true" /></Link>
          <Link href="/do-pobrania" className={styles.helpCard}><CircleHelp aria-hidden="true" /><span>Materiały</span><h3>Katalogi, instrukcje i dokumentacja w jednym miejscu.</h3><p>Pobierz informacje potrzebne do projektu i montażu.</p><ArrowRight aria-hidden="true" /></Link>
        </div>
      </section>
    </main>
  );
}
