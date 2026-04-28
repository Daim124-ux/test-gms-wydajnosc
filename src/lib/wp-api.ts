/**
 * Mockowa implementacja API WordPressa. 
 * Wszystkie połączenia z WP zostały usunięte na prośbę użytkownika.
 */

export async function getNodeByUri(uri: string) {
  // Usuwamy slashe na początku i końcu
  const cleanUri = uri.replace(/^\/|\/$/g, '');
  const segments = cleanUri.split('/');
  const lastSlug = segments[segments.length - 1] || 'home';

  console.log(`[MOCK API] Serving data for URI: ${uri}`);
  
  // Strona główna
  if (!cleanUri || cleanUri === '' || lastSlug === 'home') {
    return {
      __typename: 'Page',
      id: 'home-mock',
      title: 'GMS System - Witaj',
      slug: 'home',
      uri: '/',
      content: '<p>Witaj na nowej stronie GMS System. Tu znajdziesz najlepsze rozwiązania dla domu i osiedla.</p>',
      description: '',
      seo: {
        title: 'GMS System - Innowacyjne rozwiązania na lata',
        metaDesc: 'Witaj na stronie GMS System.',
        canonical: 'https://gms-system.com/',
        opengraphTitle: 'GMS System',
        opengraphDescription: 'Witaj na stronie GMS System.',
        schema: { raw: '' }
      }
    };
  }

  // Specyficzny mock dla wiaty rowerowej
  if (uri.includes('wiata')) {
    return {
      __typename: 'Product',
      id: 'wiata-mock',
      title: 'Wiata stalowa na rowery',
      slug: 'wiata-stalowa-na-rowery',
      uri: '/system-dom/wiata-stalowa-na-rowery/',
      content: '',
      description: '<p>Luksus i wytrzymałość stopione w jedno potężne, stalowe rozwiązanie.</p>',
      image: {
        sourceUrl: 'https://placehold.co/1920x1080/png/white?text=Wiata+GMS',
        altText: 'Mock Wiata'
      },
      seo: {
        title: 'Wiata stalowa na rowery | GMS System',
        metaDesc: 'Odkryj wiaty stalowe od GMS System.',
        canonical: 'https://gms-system.com/system-dom/wiata-stalowa-na-rowery/',
        opengraphTitle: 'Wiata stalowa na rowery | GMS System',
        opengraphDescription: 'Odkryj wiaty stalowe od GMS System.',
        schema: { raw: '' }
      }
    };
  }

  // Generyczny mock dla pozostałych stron
  return {
    __typename: 'Page',
    id: `mock-${lastSlug}`,
    title: lastSlug.charAt(0).toUpperCase() + lastSlug.slice(1).replace(/-/g, ' '),
    slug: lastSlug,
    uri: `/${cleanUri}/`,
    content: `<p>To jest przykładowa treść dla strony: ${uri}.</p>`,
    description: '',
    seo: {
      title: `${lastSlug.charAt(0).toUpperCase() + lastSlug.slice(1).replace(/-/g, ' ')} | GMS System`,
      metaDesc: `Opis dla ${uri}`,
      canonical: `https://gms-system.com/${uri}/`,
      opengraphTitle: lastSlug,
      opengraphDescription: `Opis dla ${uri}`,
      schema: { raw: '' }
    }
  };
}

/**
 * Zwraca listę slugów dla SSG. 
 * W wersji bez WordPressa zwracamy tylko najważniejsze trasy testowe.
 */
export async function getAllSlugs() {
  return [
    { slug: 'home', uri: '/' },
    { slug: 'wiata-stalowa-na-rowery', uri: '/system-dom/wiata-stalowa-na-rowery/' },
    { slug: 'o-nas', uri: '/o-nas/' },
    { slug: 'kontakt', uri: '/kontakt/' }
  ];
}
