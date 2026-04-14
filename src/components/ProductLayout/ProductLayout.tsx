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
import { ElementKaruzeli } from '@/components/KaruzelaFunkcji/KaruzelaFunkcji';
import { KolorWiaty } from '@/components/PoznajKolorystyke/PoznajKolorystyke';

// Dynamiczne ładowanie ciężkich komponentów (Performance Optimization)
const ThreeDShowcase = dynamic(() => import('@/components/ThreeDShowcase/ThreeDShowcase'), { ssr: false });
const LifestyleShowcase = dynamic(() => import('@/components/LifestyleShowcase/LifestyleShowcase'), { ssr: false });
const LifestyleDescription = dynamic(() => import('@/components/LifestyleShowcase/LifestyleDescription'), { ssr: false });
const ConfiguratorPromo = dynamic(() => import('@/components/LifestyleShowcase/ConfiguratorPromo'), { ssr: false });

interface ProductLayoutProps {
  node: any;
}

export default function ProductLayout({ node }: ProductLayoutProps) {
  // Mockowe dane
  const mockFunkcje: ElementKaruzeli[] = [
    {
      id: '1',
      tytul: 'Zawias fortepianowy w klapie wiaty',
      pozycjaTekstu: 'prawa-srodek' as const,
      obrazUrl: '/assets/images/wiaty-stalowe-na-rowery/Animacja_klapy_dark-91.jpg'
    },
    {
      id: '2',
      tytul: 'Innowacyjny system otwierania z punktami STOP',
      pozycjaTekstu: 'dol' as const,
      obrazUrl: '/assets/images/wiaty-stalowe-na-rowery/Zamykanie.png',
      pozycjaObrazu: '15vw 0'
    },
    {
      id: '3',
      tytul: 'Szmaciany pochwyt ułatwiający otwieranie oraz zamykanie progu',
      pozycjaTekstu: 'dol' as const,
      obrazUrl: '/assets/images/wiaty-stalowe-na-rowery/Pochwyt_szmaciany-web.png'
    },
    {
      id: '4',
      tytul: 'Zamykanie wiaty za pomocą aluminiowo-stalowych cięgien.',
      pozycjaTekstu: 'prawa-dol' as const,
      obrazUrl: '/assets/images/wiaty-stalowe-na-rowery/Animacja_zamka0030.jpg',
      videoUrl: '/assets/videos/wiaty-stalowe-na-rowery/animacja-ciegna.mp4'
    },
    {
      id: '5',
      tytul: 'Wygodne pakowanie w boxie paletowym',
      pozycjaTekstu: 'prawa-dol' as const,
      obrazUrl: '/assets/images/wiaty-stalowe-na-rowery/Pakowanie-na-palecie-min_test-01-min-1-scaled.jpg',
      rozmiarObrazu: 'contain' as const,
      pozycjaObrazu: '25% 50%'
    }
  ];

  const mockFunkcjeTechniczne: ElementKaruzeli[] = [
    {
      id: 't1',
      tytul: 'Wzmocnione narożniki',
      pozycjaTekstu: 'dol-srodek' as const,
      obrazUrl: '/assets/images/wiaty-stalowe-na-rowery/Animacja_zamka0030.jpg',
      videoUrl: '/assets/videos/wiaty-stalowe-na-rowery/Animacjanaronika-wiatarowerowa-web.webm',
      loop: false
    },
    {
      id: 't2',
      tytul: 'Usztywniające stalowe trójkąty w narożnikach',
      pozycjaTekstu: 'dol-srodek' as const,
      obrazUrl: '/assets/images/wiaty-stalowe-na-rowery/Naroznik-trojkatny-wiata-na-rowery.jpg'
    },
    {
      id: 't3',
      tytul: 'Stalowe wzmocnienia klapy połączone z ceownikami',
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
    { id: '45deg', tytul: 'Ponadczasowa estetyka w każdym kolorze', pozycjaTekstu: 'dol' as const, szerokosc: 'pelna' as const },
    { id: 'top', tytul: 'Dopasuj wiatę do elewacji Twojego domu', pozycjaTekstu: 'prawa-srodek' as const, szerokosc: 'pelna' as const },
    { id: 'bok', tytul: 'Ochrona przed każdymi warunkami', pozycjaTekstu: 'dol' as const, szerokosc: '45' as const },
    { id: 'klapa', tytul: 'Najwyższa jakość powłoki lakierniczej', pozycjaTekstu: 'dol' as const, szerokosc: '55' as const, rozmiarObrazu: 'cover' as const }
  ];

  return (
    <main className="flex flex-col min-h-screen bg-white dark:bg-black w-full">
      <AppleStickyNav title={node.title} />

      <AppleHeroEntrance
        videoUrl="/assets/videos/wiaty-stalowe-na-rowery/Animacja-hero-wiata-na-rowery-dark.av1.hevc.mp4"
      />

      <section className="bg-[#161617] pt-[56px] pb-24 px-6 overflow-hidden relative z-10">
        <div className="max-w-7xl mx-auto text-center px-4 md:px-[100px]">
          <p className="text-[24px] md:text-[32px] font-[500] tracking-normal text-[#54595F] leading-[1.2]">
            Wiata stalowa została zaprojektowana głównie z myślą o przechowywaniu rowerów,
            jednak można w niej składować również narzędzia ogrodowe, wózki dziecięce,
            skutery, hulajnogi i inne akcesoria oraz przedmioty użytkowe.
            Spad dachu klapy skierowany do przodu zapewnia dobre odprowadzenie wody,
            a dzięki wygodnemu pochwytowi otwieranie jest proste.
          </p>
        </div>
      </section>

      <KaruzelaFunkcji elementy={mockFunkcje} />

      <PoznajKolorystyke kolory={koloryDostepne} elementy={elementyKolorystyki} />

      {/* Sekcja 1: Zawias Fortepianowy */}
      <FeatureShowcase
        titleTop="Wytrzymały"
        titleGlow="zawias fortepianowy"
        titleBottom="ze stali."
        videoUrl="/assets/videos/wiaty-stalowe-na-rowery/Animacja_klapy_dark_maskvideo-1.mov"
        videoTranslateX="-50px"
        description="W naszej wiacie na rowery zastosowaliśmy zawias fortepianowy, który podnosi standard codziennego użytkowania. Ten subtelny, a jednocześnie wyjątkowo wytrzymały element zapewnia nie tylko idealną sztywność klapy zamykającej, ale także jej płynną, niemal bezszelestną pracę. Dzięki kompaktowej konstrukcji i dużej powierzchni styku, zawias ten nie tylko gwarantuje niezawodność, ale również trwałość na lata. To rozwiązanie, które docenią wszyscy użytkownicy ceniący sobie precyzję, funkcjonalność i nowoczesny design."
      />

      <div className="relative z-20 mt-[-70vh]">
        {/* Sekcja 2: Metalowy Próg */}
        <FeatureShowcase
          titleTop="Metalowy próg"
          titleGlow="z lekkiego aluminium"
          videoUrl="/assets/videos/wiaty-stalowe-na-rowery/Animacja_progu_dark_reverse.mp4"
          gradientFrom="black"
          fullWidth={true}
          videoTranslateY="-80px"
          contentTranslateY="-120px"
          description="Dolna część wiaty została zaprojektowana z myślą o maksymalnej funkcjonalności i komforcie użytkowania. Stalowy próg z eleganckim materiałowym pochwytem zapewnia solidne zamknięcie, a neodymowe magnesy precyzyjnie utrzymują go w pozycji, zapobiegając przypadkowemu otwarciu. Specjalnie dopasowane zawiasy oraz dodatkowe gięcie elementu tworzą po otwarciu płynnie wyprofilowany podjazd, ułatwiający wprowadzenie roweru. To przemyślane rozwiązanie łączy trwałość z wygodą, odpowiadając na potrzeby wymagających użytkowników."
        />

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
      <AluminumFloor />

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
    </main>
  );
}
