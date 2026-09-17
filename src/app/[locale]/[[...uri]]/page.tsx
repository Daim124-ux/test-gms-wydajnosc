import { notFound } from 'next/navigation';
import Script from 'next/script';
import { getNodeByUri, getAllSlugs } from '@/lib/wp-api';
import ProductLayout from '@/components/ProductLayout/ProductLayout';
import GarageLayout from '@/components/GarageLayout/GarageLayout';
import Footer from '@/components/Footer/Footer';
import HomeHero from '@/components/HomeHero/HomeHero';
import HomeAboutAndStats from '@/components/HomeAboutAndStats/HomeAboutAndStats';
import HomeCategories from '@/components/HomeCategories/HomeCategories';
import HomeConfiguratorPromo from '@/components/HomeConfiguratorPromo/HomeConfiguratorPromo';
import HomeStorePromo from '@/components/HomeStorePromo/HomeStorePromo';
import PoznajKolorystyke from '@/components/PoznajKolorystyke/PoznajKolorystyke';
import HomeB2BAndDocs from '@/components/HomeB2BAndDocs/HomeB2BAndDocs';
import HomeBlogPreview from '@/components/HomeBlogPreview/HomeBlogPreview';
import HomeGallery from '@/components/HomeGallery/HomeGallery';
import HomeCTA from '@/components/HomeCTA/HomeCTA';

const koloryGaraży = [
  { id: 'ocynk', nazwa: 'Ocynk', hex: '#A8A9AD', folder: 'ocynk' },
  { id: '7016', nazwa: 'RAL 7016', hex: '#383E42', folder: 'RAL7016' },
  { id: '9006', nazwa: 'RAL 9006', hex: '#A5A5A5', folder: 'RAL9006' }
];

const elementyKolorystyki = [
  { id: '45deg', tytul: 'Estetyczne wykończenie', pozycjaTekstu: 'dol' as const, szerokosc: 'pelna' as const },
  { id: 'bok', tytul: 'Trwała ochrona przed korozją', pozycjaTekstu: 'dol' as const, szerokosc: 'pelna' as const },
];

interface CatchAllPageProps {
  params: Promise<{
    locale: string;
    uri?: string[];
  }>;
}

export async function generateMetadata({ params }: CatchAllPageProps) {
  const { uri } = await params;
  const uriPath = uri && uri.length > 0 ? uri.join('/') : '/';
  const node = await getNodeByUri(uriPath);

  if (!node || !node.seo) {
    return {
      title: node?.title || 'GMS System',
    };
  }

  const seo = node.seo;

  return {
    title: seo.title,
    description: seo.metaDesc,
    alternates: {
      canonical: seo.canonical || `https://gms-system.com${uriPath === '/' ? '/' : `/${uriPath}/`}`,
    },
    openGraph: {
      title: seo.opengraphTitle || seo.title,
      description: seo.opengraphDescription || seo.metaDesc,
    },
  };
}

export async function generateStaticParams() {
  const allNodes = await getAllSlugs();
  const locales = ['pl', 'en', 'de', 'fr', 'ua', 'sk', 'cs', 'hu', 'da', 'it', 'nl', 'no', 'sv'];

  const paths: { locale: string; uri: string[] }[] = [];

  locales.forEach(locale => {
    // Add home page for each locale
    paths.push({ locale, uri: [] });

    // Add all slugs for each locale
    if (allNodes) {
      allNodes.forEach((node: { uri: string }) => {
        paths.push({
          locale,
          uri: node.uri.split('/').filter(Boolean),
        });
      });
    }
  });

  return paths;
}

export default async function CatchAllPage({ params }: CatchAllPageProps) {
  const { uri, locale } = await params;

  // Składamy uri z powrotem w string, np. "system-dom/wiata-stalowa-na-rowery"
  // Jeśli uri jest puste, szukamy "/" (strony głównej)
  const uriPath = uri && uri.length > 0 ? uri.join('/') : '/';

  const node = await getNodeByUri(uriPath);

  if (!node) {
    notFound();
  }

  // SCHEMA.ORG SCRIPT
  const schemaScript = node.seo?.schema?.raw ? (
    <Script
      id={`schema-${node.id || 'wp'}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: node.seo.schema.raw }}
    />
  ) : null;

  // LOGIKA WYBORU LAYOUTU
  if (uriPath.includes('garaz')) {
    return (
      <>
        {schemaScript}
        <GarageLayout node={node} />
      </>
    );
  }

  if (node.__typename === 'Product' || uriPath.includes('wiata')) {
    return (
      <>
        {schemaScript}
        <ProductLayout node={node} />
      </>
    );
  }

  // Domyślny layout dla zwykłych stron (np. O nas)
  
  // Jeśli to strona główna
  if (uriPath === '/') {
    return (
      <>
        {schemaScript}
        <HomeHero />
        <HomeAboutAndStats />
        <HomeCategories />
        <HomeConfiguratorPromo />
        <HomeStorePromo />
        <PoznajKolorystyke kolory={koloryGaraży} elementy={elementyKolorystyki} darkTheme={true} />
        <HomeB2BAndDocs />
        <HomeBlogPreview />
        <HomeGallery />
        <HomeCTA />
        <Footer variant="dark" />
      </>
    );
  }

  return (
    <>
      {schemaScript}
      <main className="flex flex-col min-h-screen bg-white dark:bg-black w-full py-20 px-4 md:px-0">
        <div className="max-w-4xl mx-auto w-full">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-8">
            {node.title}
          </h1>
          <div
            className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300"
            dangerouslySetInnerHTML={{ __html: node.content || node.description || '' }}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
