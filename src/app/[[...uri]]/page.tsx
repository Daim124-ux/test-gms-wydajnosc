import { notFound } from 'next/navigation';
import Script from 'next/script';
import { getNodeByUri, getAllSlugs } from '@/lib/wp-api';
import ProductLayout from '@/components/ProductLayout/ProductLayout';
import Footer from '@/components/Footer/Footer';

interface CatchAllPageProps {
  params: Promise<{
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

  if (!allNodes) {
    return [];
  }

  // Dodajemy pusty segment dla strony głównej
  const params = allNodes.map((node: { uri: string }) => ({
    uri: node.uri.split('/').filter(Boolean),
  }));

  return [...params, { uri: [] }];
}

export default async function CatchAllPage({ params }: CatchAllPageProps) {
  const { uri } = await params;

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
  if (node.__typename === 'Product' || uriPath.includes('wiata') || uriPath.includes('garaz')) {
    return (
      <>
        {schemaScript}
        <ProductLayout node={node} />
      </>
    );
  }

  // Domyślny layout dla zwykłych stron (np. O nas)
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
