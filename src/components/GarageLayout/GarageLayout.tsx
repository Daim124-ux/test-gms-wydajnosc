'use client';

import React from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import AppleHeroEntrance from '@/components/AppleHeroEntrance/AppleHeroEntrance';
import KaruzelaFunkcji, { ElementKaruzeli } from '@/components/KaruzelaFunkcji/KaruzelaFunkcji';
import PoznajKolorystyke, { KolorWiaty } from '@/components/PoznajKolorystyke/PoznajKolorystyke';
import AppleCloserLook from '@/components/AppleCloserLook/AppleCloserLook';
import FeatureShowcase from '@/components/FeatureShowcase/FeatureShowcase';
import ThresholdGrid from '@/components/ThresholdGrid/ThresholdGrid';
import AppleCompareSection from '@/components/AppleCompareSection/AppleCompareSection';
import Footer from '@/components/Footer/Footer';
import { Link } from '@/i18n/navigation';
import {
  DoorOpen,
  Home,
  PaintBucket,
  Plus,
  Ruler,
  ShieldCheck,
  Wrench,
} from 'lucide-react';

const ThreeDShowcase = dynamic(() => import('@/components/ThreeDShowcase/ThreeDShowcase'), { ssr: false });
const LifestyleShowcase = dynamic(() => import('@/components/LifestyleShowcase/LifestyleShowcase'), { ssr: false });
const LifestyleDescription = dynamic(() => import('@/components/LifestyleShowcase/LifestyleDescription'), { ssr: false });
const ConfiguratorPromo = dynamic(() => import('@/components/LifestyleShowcase/ConfiguratorPromo'), { ssr: false });

interface GarageLayoutProps {
  node?: {
    title?: string | null;
  };
}

type CloserLookItem = {
  id: string;
  label: string;
  title: string;
  description: string;
  stat: string;
  image: string;
  icon: React.ComponentType<{ className?: string }>;
  swatches?: string[];
};

const garageImage = '/assets/images/garaze-stalowe/Garaz_wizualizacja.jpeg';
const garageLifestyleImage = '/assets/images/garaze-stalowe/Garaz_wizualizacja_testowa.jpg';
const singleDimensionsImage = '/assets/images/garaze-stalowe/garage-dimensions-single.svg';
const dualDimensionsImage = '/assets/images/garaze-stalowe/garage-dimensions-dual.svg';
const ralColorsImage = '/assets/images/garaze-stalowe/garage-ral-colors.svg';
const plasterColorsImage = '/assets/images/garaze-stalowe/garage-plaster-colors.svg';

const closerLookItems: CloserLookItem[] = [
  {
    id: 'sizes',
    label: 'Rozmiary',
    title: 'Jedno- lub dwustanowiskowy, dopasowany do posesji.',
    description:
      'Modułowe długości 5220-5960 mm, szerokości od 2970 mm dla jednego auta i 5940 mm dla wersji podwójnej. Do wyboru wysokość 2240 lub 2420 mm.',
    stat: '1 lub 2 stanowiska',
    image: singleDimensionsImage,
    icon: Ruler,
  },
  {
    id: 'colors',
    label: 'Kolory',
    title: 'RAL, tynk strukturalny i połączenia kolorów.',
    description:
      'Garaż może być wykończony blachą ocynkowaną, malowaną w kolorach RAL albo tynkiem strukturalnym GS Premium. Kolory ścian i dodatków można zestawiać swobodnie.',
    stat: 'RAL + tynk',
    image: ralColorsImage,
    icon: PaintBucket,
    swatches: ['#f4f4f4', '#e8dfcf', '#d7c567', '#a6a8aa', '#384047', '#583119', '#1f4a31'],
  },
  {
    id: 'finish',
    label: 'Wykończenie',
    title: 'GS Standard albo GS Premium z attyką.',
    description:
      'Standard stawia na trwałą blachę ocynkowaną lub fabrycznie malowaną. Premium dodaje elewacyjne wykończenie tynkiem i bardziej architektoniczny charakter.',
    stat: '2 linie wykończeń',
    image: plasterColorsImage,
    icon: Home,
  },
  {
    id: 'gates',
    label: 'Bramy',
    title: 'Wygodny wjazd i opcje pod codzienne użytkowanie.',
    description:
      'Bramy, blendy dachowe, drzwi przejściowe, okna i rynny można dobrać do sposobu korzystania z garażu. To przestrzeń na samochód, sprzęt ogrodowy albo warsztat.',
    stat: 'brama + dodatki',
    image: garageLifestyleImage,
    icon: DoorOpen,
  },
  {
    id: 'durability',
    label: 'Trwałość',
    title: 'Samonośna stalowa konstrukcja i szybki montaż.',
    description:
      'Konstrukcja z blachy ocynkowanej chroni auto przed warunkami atmosferycznymi i pozwala uzyskać gotowy garaż bez ciężkiej technologii murowanej.',
    stat: 'stal ocynkowana',
    image: garageImage,
    icon: ShieldCheck,
  },
  {
    id: 'options',
    label: 'Opcje',
    title: 'Okno, drzwi przejściowe, rynny i powłoka antykondensacyjna.',
    description:
      'Dodatki pomagają zamienić prosty garaż w wygodne zaplecze domu: z naturalnym światłem, osobnym wejściem i lepszą kontrolą wilgoci.',
    stat: '4 kluczowe dodatki',
    image: garageLifestyleImage,
    icon: Wrench,
  },
];

const singleDimensions = [
  ['Długość', '5220, 5405, 5590, 5775, 5960 mm'],
  ['Szerokość', '2970, 3340, 3710, 4080 mm'],
  ['Wysokość', '2240 lub 2420 mm'],
];

const dualDimensions = [
  ['Długość', '5220, 5405, 5590, 5775, 5960 mm'],
  ['Szerokość', '5940 mm'],
  ['Wysokość', '2240 lub 2420 mm'],
];

const mockFunkcjeGaraży: ElementKaruzeli[] = [
  {
    id: 'g1',
    tytul: 'Samonośna konstrukcja z ocynkowanej stali najwyższej jakości',
    pozycjaTekstu: 'dol',
    obrazUrl: garageImage,
  },
  {
    id: 'g2',
    tytul: 'Elewacyjny tynk strukturalny GS Premium oraz powłoki RAL',
    pozycjaTekstu: 'dol',
    obrazUrl: plasterColorsImage,
  },
  {
    id: 'g3',
    tytul: 'Wygodne bramy wjazdowe: uchylne, dwuskrzydłowe i segmentowe',
    pozycjaTekstu: 'dol',
    obrazUrl: garageLifestyleImage,
  },
  {
    id: 'g4',
    tytul: 'Naturalne doświetlenie wnętrza dzięki opcjonalnym oknom PCV',
    pozycjaTekstu: 'prawa-dol',
    obrazUrl: garageLifestyleImage,
  },
  {
    id: 'g5',
    tytul: 'Powłoka antykondensacyjna zapobiegająca skraplaniu wilgoci pod dachem',
    pozycjaTekstu: 'dol-srodek',
    obrazUrl: singleDimensionsImage,
  },
];

const koloryGaraży: KolorWiaty[] = [
  // Powłoki RAL
  { id: 'ocynk', nazwa: 'Ocynk', hex: '#A8A9AD', folder: 'ocynk' },
  { id: '3005', nazwa: 'RAL 3005', hex: '#58111A', folder: 'RAL3005' },
  { id: '6005', nazwa: 'RAL 6005', hex: '#002E1E', folder: 'RAL6005' },
  { id: '6020m', nazwa: 'RAL 6020 Mat', hex: '#303D3A', folder: 'RAL6020 mat' },
  { id: '7016', nazwa: 'RAL 7016', hex: '#383E42', folder: 'RAL7016' },
  { id: '7016m', nazwa: 'RAL 7016 Mat', hex: '#383E42', folder: 'RAL7016 mat' },
  { id: '8004', nazwa: 'RAL 8004', hex: '#8E402A', folder: 'RAL8004' },
  { id: '8017', nazwa: 'RAL 8017', hex: '#45322E', folder: 'RAL8017' },
  { id: '8017m', nazwa: 'RAL 8017 Mat', hex: '#45322E', folder: 'RAL8017 mat' },
  { id: '9006', nazwa: 'RAL 9006', hex: '#A5A5A5', folder: 'RAL9006' },
  { id: '9010', nazwa: 'RAL 9010', hex: '#F4F4F4', folder: 'RAL9010' },

  // Tynki strukturalne z szumem (GS Premium Tynk)
  { id: 'bezowy', nazwa: 'Beżowy', hex: '#E8DFCF', folder: 'tynk', isTynk: true },
  { id: 'bialy_tynk', nazwa: 'Biały', hex: '#F4F4F4', folder: 'tynk', isTynk: true },
  { id: 'ceglasty', nazwa: 'Ceglasty', hex: '#B84A39', folder: 'tynk', isTynk: true },
  { id: 'ciemny_szary', nazwa: 'Ciemny szary', hex: '#4A4D52', folder: 'tynk', isTynk: true },
  { id: 'jasny_szary', nazwa: 'Jasny szary', hex: '#C2C5CC', folder: 'tynk', isTynk: true },
  { id: 'cytrynowy', nazwa: 'Cytrynowy', hex: '#E6D865', folder: 'tynk', isTynk: true },
  { id: 'kukurydza', nazwa: 'Kukurydza', hex: '#E3B854', folder: 'tynk', isTynk: true },
  { id: 'piaskowy', nazwa: 'Piaskowy', hex: '#D8C39D', folder: 'tynk', isTynk: true },
  { id: 'zielony', nazwa: 'Zielony', hex: '#6E7F63', folder: 'tynk', isTynk: true },
];

const elementyKolorystyki = [
  { id: '45deg', tytul: 'Estetyczne wykończenie krawędzi i attyki', pozycjaTekstu: 'dol' as const, szerokosc: 'pelna' as const },
  { id: 'top', tytul: 'Dopasowanie koloru bramy i ścian', pozycjaTekstu: 'prawa-srodek' as const, szerokosc: 'pelna' as const },
  { id: 'bok', tytul: 'Trwała ochrona przed korozją', pozycjaTekstu: 'dol' as const, szerokosc: '45' as const },
  { id: 'klapa', tytul: 'Wysoka jakość wykonania detali', pozycjaTekstu: 'dol' as const, szerokosc: '55' as const, rozmiarObrazu: 'cover' as const },
];

const lifestyleGarageItems = [
  {
    id: 'g-life-1',
    title: 'Garaż Jednostanowiskowy',
    description: 'Idealne rozwiązanie na pojedynczą posesję, zapewniające bezpieczne przechowywanie auta oraz sprzętu ogrodowego.',
    image: garageLifestyleImage,
  },
  {
    id: 'g-life-2',
    title: 'Garaż Dwustanowiskowy GS Dual',
    description: 'Przestronna opcja dla dwóch samochodów z opcjonalnym podziałem wnętrza i wygodną bramą szeroką na 5.94 m.',
    image: garageImage,
  },
  {
    id: 'g-life-3',
    title: 'Wykończenie GS Premium z Tynkiem',
    description: 'Stylowy wygląd elewacyjny z attyką, który spójnie nawiązuje do wykończenia budynku mieszkalnego.',
    image: garageLifestyleImage,
  },
];

import AIContext from '@/components/Chat/AIContext';

export default function GarageLayout({ node }: GarageLayoutProps) {
  const [activeId, setActiveId] = React.useState(closerLookItems[0].id);
  const activeItem = closerLookItems.find((item) => item.id === activeId) || closerLookItems[0];
  const ActiveIcon = activeItem.icon;

  // Wymuszamy tryb jasny (Light mode) dla całej strony garaży stalowych z czysto białym tłem
  React.useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  return (
    <main className="flex flex-col min-h-screen bg-white text-[#1d1d1f] w-full overflow-x-clip">
      <AIContext
        data={{
          productName: 'Garaże Stalowe SuperStrong',
          category: 'Garaże',
          technicalSpecs: {
            'Konstrukcja': 'Profile zamknięte ocynkowane',
            'Szerokość': 'Jednostanowiskowe do 4m, Dwustanowiskowe do 9m',
            'Bramy': 'Uchylne lub segmentowe z napędem Somfy',
            'Wykończenie': 'Attyka obwodowa, ukryty spadek dachu',
          },
          pricing: 'Wycena indywidualna, sprawdź w konfiguratorze',
          additionalInfo: 'Tynk strukturalny baranek, spójny z architekturą domu.'
        }}
      />
      <AppleHeroEntrance
        videoUrl="/assets/videos/garaze-stalowe/Garaz_hero_video.mp4"
        imageUrl={garageLifestyleImage}
        title="Garaże stalowe"
        subtitle="Jedno i dwustanowiskowe garaże z blachy"
        textColor="#1d1d1f"
        glowColor="rgba(255, 255, 255, 0.99)"
        layoutVariant="top-right"
        bottomGradientMode="light"
      />

      {/* Intro text section - czysto białe tło (bg-white) */}
      <section className="relative z-20 -mt-1 bg-white px-6 py-16 md:py-28">
        <div className="max-w-7xl mx-auto text-center px-4 md:px-[100px] space-y-6 md:space-y-8">
          <p className="text-[20px] md:text-[32px] font-[500] tracking-normal text-[#1D1D1F] leading-[1.3]">
            Szukasz niezawodnego schronienia dla swojego samochodu? Nasze garaże wykonane z blachy ocynkowanej to doskonałe rozwiązanie dla Ciebie! Ich solidna konstrukcja zapewnia trwałość oraz odporność na uszkodzenia, a szeroka gama dostępnych kolorów pozwala na dopasowanie garażu do indywidualnych preferencji estetycznych.
          </p>
          <p className="text-[20px] md:text-[32px] font-[500] tracking-normal text-[#1D1D1F] leading-[1.3]">
            Garaże blaszane z GMS System pozwalają na przechowanie auta w bezpiecznych warunkach. Są nie tylko trwałe, ale estetycznie wykonane, a ich konstrukcja pozwala na szybki montaż. Wybierz odpowiadający Ci model i złóż zamówienie już dziś!
          </p>
          <p className="text-[20px] md:text-[32px] font-[500] tracking-normal text-[#1D1D1F] leading-[1.3]">
            Nasze garaże oferowane są w wersjach na jeden lub dwa samochody, a drzwi wjazdowe umożliwiają wygodne i bezpieczne parkowanie pojazdów. Dodatkowo, wiele modeli garaży posiada okna, które zapewniają dodatkowe źródło światła naturalnego wewnątrz budynku.
          </p>
          <p className="text-[20px] md:text-[32px] font-[500] tracking-normal text-[#1D1D1F] leading-[1.3]">
            Z naszymi garażami nie musisz się martwić o warunki atmosferyczne ani bezpieczeństwo Twojego pojazdu - zadbaj o niego w najlepszy możliwy sposób!
          </p>
        </div>
      </section>

      {/* Karuzela funkcji - ujednolicone białe tło (bg-white) */}
      <KaruzelaFunkcji elementy={mockFunkcjeGaraży} bgClass="bg-white" offsetClass="mt-0" glowColor="#6e7f63" glowAccent="#c5d8ba" />

      {/* APPLE COMPARE SECTION */}
      <AppleCompareSection />

      {/* Kolorystyka - ujednolicone tło z tynkami i szumem */}
      <PoznajKolorystyke kolory={koloryGaraży} elementy={elementyKolorystyki} darkTheme={false} />

      {/* APPLE WIDGET "PRZYJRZYJ SIĘ BLIŻEJ" - WIDGET BEZPOŚREDNIO POD SEKCJA KOLORYSTYKA */}
      <AppleCloserLook title="Przyjrzyj się bliżej." />

      {/* Sekcja 1: Najważniejsze informacje - Solidna Konstrukcja (bg-white) */}
      <FeatureShowcase
        titleTop="Solidna konstrukcja"
        titleGlow="Ochrona i Trwałość"
        titleBottom="dla Twojego samochodu"
        glowRgb="110, 127, 99"
        imageUrl={garageImage}
        description="Garaże stalowe GMS System powstają z najwyższej jakości stali i ocynkowanej blachy. Odporność na trudne warunki atmosferyczne, solidny szkielet oraz precyzyjne wykończenie zapewniają niezawodność przez długie lata."
        bgClass="bg-white"
        textColor="text-[#1d1d1f]"
        descColor="text-[#5f6368]"
        gradientFrom="transparent"
      />

      {/* Sekcja 2: Najważniejsze informacje - Bramy i Wyposażenie (bg-white) */}
      <FeatureShowcase
        titleTop="Wyposażenie i bramy"
        titleGlow="Komfort i Wygoda"
        glowRgb="110, 127, 99"
        gradientFrom="transparent"
        fullWidth={true}
        imageUrl={garageLifestyleImage}
        description="Skonfiguruj garaż dostosowany do Twojej posesji. Wybierz bramę uchylną lub segmentową, opcjonalne okna PCV dla naturalnego światła oraz drzwi przejściowe dla szybkiego dostępu."
        bgClass="bg-white"
        textColor="text-[#1d1d1f]"
        descColor="text-[#5f6368]"
      />

      {/* Sekcja Opcje Dodatkowe - Apple Bento Grid */}
      <section className="bg-white px-4 md:px-6 py-12 md:py-24 relative z-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-[40px] md:text-[56px] font-semibold text-[#1d1d1f] tracking-tight mb-4">
              Praktyczne dodatki
            </h2>
            <p className="text-[#5f6368] text-[18px] md:text-[21px] font-medium tracking-tight max-w-2xl mx-auto">
              Dostosuj garaż do swoich potrzeb za pomocą sprawdzonych opcji, które ułatwiają codzienne korzystanie.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Przeszklenie */}
            <div className="relative overflow-hidden rounded-[28px] md:rounded-[40px] md:col-span-1 h-[450px] md:h-[500px] group bg-black">
              <img src="https://picsum.photos/seed/przeszklenie/800/800" alt="Przeszklenie" className="absolute inset-0 w-full h-full object-cover opacity-80 transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
                <h3 className="text-2xl md:text-[32px] font-semibold text-white mb-3 tracking-tight">Przeszklenie</h3>
                <p className="text-white/80 leading-relaxed text-[17px] font-medium max-w-sm">Naturalne światło wewnątrz garażu. Mniejsze zużycie prądu i wyższy komfort każdego dnia, bez konieczności włączania oświetlenia.</p>
              </div>
            </div>
            
            {/* Furtka przejściowa */}
            <div className="relative overflow-hidden rounded-[28px] md:rounded-[40px] md:col-span-1 h-[450px] md:h-[500px] group bg-black">
              <img src="https://picsum.photos/seed/furtka/800/800" alt="Furtka przejściowa" className="absolute inset-0 w-full h-full object-cover opacity-80 transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
                <h3 className="text-2xl md:text-[32px] font-semibold text-white mb-3 tracking-tight">Furtka przejściowa</h3>
                <p className="text-white/80 leading-relaxed text-[17px] font-medium max-w-sm">Błyskawiczny dostęp do środka bez konieczności podnoszenia głównej bramy wjazdowej. Wygoda, gdy chcesz po prostu zabrać rower lub narzędzia.</p>
              </div>
            </div>
            
            {/* Powłoka antykondensacyjna - FULL WIDTH CINEMATIC */}
            <div className="relative overflow-hidden rounded-[28px] md:rounded-[40px] md:col-span-2 h-[450px] md:h-[600px] group bg-[#0a0a0a]">
              <img src="https://picsum.photos/seed/powloka/1600/900" alt="Powłoka antykondensacyjna" className="absolute inset-0 w-full h-full object-cover opacity-50 transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
              <div className="absolute inset-0 p-8 md:p-16 flex flex-col justify-end md:justify-center max-w-3xl">
                <h3 className="text-3xl md:text-[56px] font-semibold text-white mb-4 tracking-tight leading-[1.1]">Powłoka antykondensacyjna</h3>
                <p className="text-white/80 leading-relaxed text-[18px] md:text-[21px] font-medium">Zatrzymuje skraplanie pary wodnej pod dachem. Twój samochód i sprzęty pozostają całkowicie suche, bez względu na zmiany temperatur i wilgotności na zewnątrz.</p>
              </div>
            </div>
            
            {/* Orynnowanie - FULL WIDTH LIGHT */}
            <div className="relative overflow-hidden rounded-[28px] md:rounded-[40px] md:col-span-2 h-[450px] md:h-[500px] group bg-[#f5f5f7]">
              <div className="absolute top-0 right-0 w-full md:w-[60%] h-full">
                <img src="https://picsum.photos/seed/rynny/1000/800" alt="Orynnowanie" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#f5f5f7] via-[#f5f5f7]/95 to-transparent md:to-transparent" />
              <div className="absolute inset-0 p-8 md:p-16 flex flex-col justify-end md:justify-center max-w-xl">
                <h3 className="text-3xl md:text-[46px] font-semibold text-[#1d1d1f] mb-4 tracking-tight leading-[1.1]">Orynnowanie</h3>
                <p className="text-[#5f6368] leading-relaxed text-[18px] md:text-[20px] font-medium">Skuteczne odprowadzanie wody deszczowej chroniące elewację i fundamenty przed uciążliwą wilgocią. Dyskretnie zintegrowane, aby nie zaburzać minimalistycznej bryły garażu.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ThresholdGrid - Dark Moss Green poświata na ujednoliconym białym tle */}
      <div className="relative z-20 md:mt-[-20px] mt-0">
        <ThresholdGrid highlightColor="#6e7f63" bgClass="bg-white" textColor="text-[#1d1d1f]" />
      </div>

      {/* Wymiary - ujednolicone białe tło (bg-white) */}
      <section className="bg-white px-6 py-16 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
          <DimensionPanel
            title="Garaże jednostanowiskowe"
            subtitle="Kompaktowe rozwiązanie na jedną posesję."
            rows={singleDimensions}
            visualSrc={singleDimensionsImage}
          />
          <DimensionPanel
            title="Garaże dwustanowiskowe"
            subtitle="Więcej miejsca na auta, narzędzia lub magazyn."
            rows={dualDimensions}
            visualSrc={dualDimensionsImage}
          />
        </div>
      </section>

      {/* Lifestyle showcase - ujednolicone białe tło (bg-white) */}
      <LifestyleShowcase
        glowRgb="110, 127, 99"
        btnBgClass="bg-[#6e7f63]/30 hover:bg-[#6e7f63]/50"
        items={lifestyleGarageItems}
        mainTitle="Wybierz garaż dopasowany do Ciebie"
        bgClass="bg-white"
        titleColor="text-[#1d1d1f]"
      />

      <LifestyleDescription
        bgClass="bg-white"
        textColor="text-[#5f6368]"
        accentTextColor="text-[#1d1d1f]"
        borderColor="border-black/10"
      />

      <ConfiguratorPromo
        highlightColor="#6e7f63"
        bgClass="bg-white"
        textColor="text-[#5f6368]"
      />

      <Footer variant="light" />
    </main>
  );
}

function DimensionPanel({
  title,
  subtitle,
  rows,
  visualSrc,
}: {
  title: string;
  subtitle: string;
  rows: string[][];
  visualSrc: string;
}) {
  return (
    <article className="rounded-[26px] bg-[#f8f8fa] border border-black/5 p-8 md:p-10">
      <div className="relative mb-8 aspect-[16/10] overflow-hidden rounded-[18px] bg-white border border-black/5">
        <Image
          src={visualSrc}
          alt={`${title} - schemat wymiarów`}
          fill
          sizes="(min-width: 1024px) 600px, 100vw"
          className="object-cover"
          unoptimized
        />
      </div>
      <h2 className="text-[32px] font-semibold leading-tight tracking-normal md:text-[44px] text-[#1d1d1f]">{title}</h2>
      <p className="mt-4 text-lg font-medium text-[#5f6368]">{subtitle}</p>
      <dl className="mt-8 divide-y divide-black/10">
        {rows.map(([label, value]) => (
          <div key={label} className="grid gap-2 py-5 sm:grid-cols-[150px_1fr]">
            <dt className="text-sm font-semibold uppercase tracking-[0.14em] text-[#6e7f63]">{label}</dt>
            <dd className="text-xl font-semibold tracking-normal text-[#1d1d1f]">{value}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
