/**
 * Główna funkcja wykonująca zapytania do endpointu GraphQL.
 */
export async function fetchAPI(query: string, { variables }: { variables?: any } = {}) {
  const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://gms-system.com/graphql';
  const headers: Record<string, string> = { 
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  };

  if (process.env.WORDPRESS_AUTH_USER && process.env.WORDPRESS_APP_PASS) {
    const auth = Buffer.from(`${process.env.WORDPRESS_AUTH_USER}:${process.env.WORDPRESS_APP_PASS}`).toString('base64');
    headers['Authorization'] = `Basic ${auth}`;
    console.log('Using Basic Auth for WP API');
  } else {
    console.log('No Auth credentials found for WP API');
  }

  console.log('Fetching from:', API_URL);

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
      next: {
        revalidate: 3600, // ISR: Rewalidacja co 1h dla bazy wiedzy
      },
    });

    const text = await res.text();
    
    try {
      const json = JSON.parse(text);
      if (json.errors) {
        console.error(JSON.stringify(json.errors, null, 2));
        return { _hasError: true, errors: json.errors };
      }
      return json.data;
    } catch (parseError) {
      console.error('Failed to parse WP JSON. Response snippet:', text.slice(0, 500));
      return { _hasError: true, error: parseError };
    }
  } catch (error) {
    console.error('WPGraphQL Fetch Error:', error);
    return { _hasError: true, error };
  }
}

/**
 * Pobiera pojedynczy węzeł na podstawie pełnego URI (np. /system-dom/wiata-na-rowery).
 * Używamy uniwersalnego zapytania nodeByUri, które działa dla stron, postów i produktów.
 */
export async function getNodeByUri(uri: string) {
  const query = `
    query NodeByUri($uri: String!) {
      nodeByUri(uri: $uri) {
        __typename
        ... on Post {
          id
          title
          slug
          uri
          content
          seo {
            title
            metaDesc
            canonical
            opengraphTitle
            opengraphDescription
            schema {
              raw
            }
          }
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
        }
        ... on Page {
          id
          title
          slug
          uri
          content
          seo {
            title
            metaDesc
            canonical
            opengraphTitle
            opengraphDescription
            schema {
              raw
            }
          }
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
        }
      }
    }
  `;

  const data = await fetchAPI(query, {
    variables: {
      uri: uri === '/' ? '/' : `/${uri.replace(/^\/|\/$/g, '')}/`,
    },
  });

  if (data?._hasError || !data?.nodeByUri) {
    console.log(`Node not found for URI: ${uri}. Serving MOCK data for testing.`);
    
    // Mock dla strony głównej
    if (uri === '/' || uri === '') {
      return {
        __typename: 'Page',
        title: 'GMS System - Witaj',
        slug: 'home',
        uri: '/',
        content: '<p>Witaj na nowej stronie GMS System. Tu znajdziesz najlepsze rozwiązania dla domu i osiedla.</p>',
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

    // Mockowy fallback dla prezentacji wiaty
    if (uri.includes('wiata')) {
      return {
        __typename: 'Product',
        title: 'Wiata stalowa na rowery',
        slug: 'wiata-stalowa-na-rowery',
        uri: '/system-dom/wiata-stalowa-na-rowery/',
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

    // Generyczny mock dla innych stron (np. o-nas)
    return {
      __typename: 'Page',
      title: uri.charAt(0).toUpperCase() + uri.slice(1).replace(/-/g, ' '),
      slug: uri,
      uri: `/${uri}/`,
      content: `<p>To jest przykładowa treść dla strony: ${uri}.</p>`,
      seo: {
        title: `${uri.charAt(0).toUpperCase() + uri.slice(1).replace(/-/g, ' ')} | GMS System`,
        metaDesc: `Opis dla ${uri}`,
        canonical: `https://gms-system.com/${uri}/`,
        opengraphTitle: uri,
        opengraphDescription: `Opis dla ${uri}`,
        schema: { raw: '' }
      }
    };
  }

  return data.nodeByUri;
}

/**
 * Zwraca listę slugów lub URI dla poszczególnych rodzajów postów (SSG).
 */
export async function getAllSlugs(postType = 'POST') {
  const query = `
    query AllNodes {
      posts(first: 100) {
        nodes {
          slug
          uri
        }
      }
      pages(first: 100) {
        nodes {
          slug
          uri
        }
      }
    }
  `;

  const data = await fetchAPI(query);
  
  if (data?._hasError) {
     return [ { slug: 'test-slug', uri: '/test-slug/' } ];
  }

  // Łączymy wyniki z różnych typów treści
  const allNodes = [
    ...(data?.posts?.nodes || []),
    ...(data?.pages?.nodes || [])
  ];

  return allNodes;
}
