'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import AppleStickyNav from '@/components/AppleStickyNav/AppleStickyNav';
import AppleHeroEntrance from '@/components/AppleHeroEntrance/AppleHeroEntrance';
import KaruzelaFunkcji from '@/components/KaruzelaFunkcji/KaruzelaFunkcji';
import PoznajKolorystyke from '@/components/PoznajKolorystyke/PoznajKolorystyke';
import FeatureShowcase from '@/components/FeatureShowcase/FeatureShowcase';
import ThresholdGrid from '@/components/ThresholdGrid/ThresholdGrid';
import AluminumFloor from '@/components/AluminumFloor/AluminumFloor';
import ProductDimensions from '@/components/ProductDimensions/ProductDimensions';
import Footer from '@/components/Footer/Footer';
import { ElementKaruzeli } from '@/components/KaruzelaFunkcji/KaruzelaFunkcji';
import { KolorWiaty } from '@/components/PoznajKolorystyke/PoznajKolorystyke';

// Dynamiczne ładowanie ciężkich komponentów (Performance Optimization)
const ThreeDShowcase = dynamic(() => import('@/components/ThreeDShowcase/ThreeDShowcase'), { ssr: false });
const LifestyleShowcase = dynamic(() => import('@/components/LifestyleShowcase/LifestyleShowcase'), { ssr: false });
const LifestyleDescription = dynamic(() => import('@/components/LifestyleShowcase/LifestyleDescription'), { ssr: false });
const ConfiguratorPromo = dynamic(() => import('@/components/LifestyleShowcase/ConfiguratorPromo'), { ssr: false });

import { useTranslations } from 'next-intl';

interface ProductLayoutProps {
  node: any;
}

export default function ProductLayout({ node }: ProductLayoutProps) {
  const t = useTranslations('productLayout');

  // Wymuszamy tryb ciemny dla całej strony produktu
  React.useEffect(() => {
    document.documentElement.classList.add('dark');
    return () => document.documentElement.classList.remove('dark');
  }, []);

  // Mockowe dane
  const mockFunkcje: ElementKaruzeli[] = [
    {
      id: '1',
      tytul: t('features.pianoHinge.title'),
      pozycjaTekstu: 'prawa-srodek' as const,
      obrazUrl: '/assets/images/wiaty-stalowe-na-rowery/Animacja_klapy_dark-91.jpg'
    },
    {
      id: '2',
      tytul: t('features.stopPoints.title'),
      pozycjaTekstu: 'dol' as const,
      obrazUrl: '/assets/images/wiaty-stalowe-na-rowery/Zamykanie.png',
      pozycjaObrazu: '15vw 0'
    },
    {
      id: '3',
      tytul: t('features.fabricHandle.title'),
      pozycjaTekstu: 'dol' as const,
      obrazUrl: '/assets/images/wiaty-stalowe-na-rowery/Pochwyt_szmaciany-web.png'
    },
    {
      id: '4',
      tytul: t('features.steelRods.title'),
      pozycjaTekstu: 'prawa-dol' as const,
      obrazUrl: '/assets/images/wiaty-stalowe-na-rowery/Animacja_zamka0030.jpg',
      videoUrl: '/assets/videos/wiaty-stalowe-na-rowery/animacja-ciegna.mp4'
    },
    {
      id: '5',
      tytul: t('features.packing.title'),
      pozycjaTekstu: 'prawa-dol' as const,
      obrazUrl: '/assets/images/wiaty-stalowe-na-rowery/Pakowanie-na-palecie-min_test-01-min-1-scaled.jpg',
      rozmiarObrazu: 'contain' as const,
      pozycjaObrazu: '25% 50%'
    }
  ];

  const mockFunkcjeTechniczne: ElementKaruzeli[] = [
    {
      id: 't1',
      tytul: t('features.reinforcedCorners.title'),
      pozycjaTekstu: 'dol-srodek' as const,
      obrazUrl: '/assets/images/wiaty-stalowe-na-rowery/Animacja_zamka0030.jpg',
      videoUrl: '/assets/videos/wiaty-stalowe-na-rowery/Animacjanaronika-wiatarowerowa-web.webm',
      loop: false
    },
    {
      id: 't2',
      tytul: t('features.steelTriangles.title'),
      pozycjaTekstu: 'dol-srodek' as const,
      obrazUrl: '/assets/images/wiaty-stalowe-na-rowery/Naroznik-trojkatny-wiata-na-rowery.jpg'
    },
    {
      id: 't3',
      tytul: t('features.lidReinforcement.title'),
      pozycjaTekstu: 'dol-srodek' as const,
      obrazUrl: '/assets/images/wiaty-stalowe-na-rowery/Klapa-rednery-wzmocnien-2.jpg'
    }
  ];

  const koloryDostepne: KolorWiaty[] = [
    { id: 'ocynk', nazwa: 'Ocynk', hex: '#A8A9AD', folder: 'ocynk' },
    { id: '3005', nazwa: 'RAL 3005 - Burgundowy', hex: '#58111A', folder: 'RAL3005' },
    { id: '6005', nazwa: 'RAL 6005 - Ciemnozielony', hex: '#002E1E', folder: 'RAL6005' },
    { id: '6020m', nazwa: 'RAL 6020 Mat - Chromowy', hex: '#303D3A', folder: 'RAL6020 mat' },
    { id: '7016', nazwa: 'RAL 7016 - Antracyt', hex: '#383E42', folder: 'RAL7016' },
    { id: '7016m', nazwa: 'RAL 7016 Mat', hex: '#383E42', folder: 'RAL7016 mat' },
    { id: '8004', nazwa: 'RAL 8004 - Ceglasty', hex: '#8E402A', folder: 'RAL8004' },
    { id: '8017', nazwa: 'RAL 8017 - Brązowy', hex: '#45322E', folder: 'RAL8017' },
    { id: '8017m', nazwa: 'RAL 8017 Mat', hex: '#45322E', folder: 'RAL8017 mat' },
    { id: '9006', nazwa: 'RAL 9006 - Srebrny', hex: '#A5A5A5', folder: 'RAL9006' },
    { id: '9010', nazwa: 'RAL 9010 - Biały', hex: '#F4F4F4', folder: 'RAL9010' }
  ];

  const elementyKolorystyki = [
    { id: '45deg', tytul: t('colorSection.aesthetic'), pozycjaTekstu: 'dol' as const, szerokosc: 'pelna' as const },
    { id: 'top', tytul: t('colorSection.match'), pozycjaTekstu: 'prawa-srodek' as const, szerokosc: 'pelna' as const },
    { id: 'bok', tytul: t('colorSection.protection'), pozycjaTekstu: 'dol' as const, szerokosc: '45' as const },
    { id: 'klapa', tytul: t('colorSection.quality'), pozycjaTekstu: 'dol' as const, szerokosc: '55' as const, rozmiarObrazu: 'cover' as const }
  ];

  return (
    <main className="flex flex-col min-h-screen bg-white dark:bg-black w-full">
      <AppleStickyNav title={node.title} />

      <AppleHeroEntrance
        videoUrl="/assets/videos/wiaty-stalowe-na-rowery/Animacja-hero-wiata-na-rowery-dark.frames.av1.hevc.webm"
      />

      <section 
        className="pt-[32px] md:pt-[56px] pb-24 px-6 overflow-hidden relative z-10 -mt-[200px] md:mt-0 mobile-legacy-gradient"
      >
        <div className="max-w-7xl mx-auto text-center px-4 md:px-[100px]">
          <p className="text-[20px] md:text-[32px] font-[500] tracking-normal text-[#86868B] leading-[1.2]">
            {t('intro.text')}
          </p>
        </div>
      </section>

      <KaruzelaFunkcji elementy={mockFunkcje} />

      <PoznajKolorystyke kolory={koloryDostepne} elementy={elementyKolorystyki} />

      {/* Sekcja 1: Zawias Fortepianowy */}
      <FeatureShowcase
        titleTop={t('showcase1.top')}
        titleGlow={t('showcase1.glow')}
        titleBottom={t('showcase1.bottom')}
        videoUrl="/assets/videos/wiaty-stalowe-na-rowery/Animacja_klapy_dark_maskvideo-1.mov"
        videoTranslateX="-50px"
        loop={false}
        description={t('showcase1.description')}
      />

      {/* Sekcja 2: Metalowy Próg */}
      <FeatureShowcase
        titleTop={t('showcase2.top')}
        titleGlow={t('showcase2.glow')}
        videoUrl="/assets/videos/wiaty-stalowe-na-rowery/Animacja_progu_dark_reverse.mp4"
        gradientFrom="black"
        fullWidth={true}
        loop={false}
        videoTranslateY="-70vh"
        contentTranslateY="-70vh"
        videoClassName="mt-[-250px] md:mt-0"
        description={t('showcase2.description')}
      />

      <div className="relative z-20 md:mt-[-70vh] mt-0">
        <ThresholdGrid />

        {/* Techniczna Karuzela - Miękkie przejście i synchronizacja pozycji */}
        <section className="relative pb-32 overflow-hidden pt-0 mt-[-1px] bg-black">
          <KaruzelaFunkcji
            elementy={mockFunkcjeTechniczne}
            showTitle={false}
            bgClass="bg-transparent"
            offsetClass="mt-0"
          />
        </section>
      </div>

      {/* Sekcja: Aluminiowa Podłoga */}
      <div className="relative z-30">
        <AluminumFloor />
      </div>

      {/* Sekcja: 3D Showcase */}
      <ThreeDShowcase />

      {/* Sekcja: Wymiary */}
      <ProductDimensions />

      {/* Sekcja: Lifestyle Showcase */}
      <LifestyleShowcase />

      {/* Opis wszechstronności i nagłówek konfiguratora */}
      <LifestyleDescription />

      {/* Promocja konfiguratora z obrazkiem i przyciskiem */}
      <ConfiguratorPromo />

      <Footer variant="dark" />
    </main>
  );
}
