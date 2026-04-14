const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://twoja-domena.pl/graphql';

/**
 * Główna funkcja wykonująca zapytania do endpointu GraphQL.
 */
export async function fetchAPI(query: string, { variables }: { variables?: any } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
      next: {
        revalidate: 60, // ISR: Rewalidacja co 60 sekund. Zmień według potrzeb (np. na tagi dla on-demand revalidation)
      },
    });

    const json = await res.json();
    if (json.errors) {
      console.error(JSON.stringify(json.errors, null, 2));
      // throw new Error('Failed to fetch API: ' + json.errors[0]?.message);
      return { _hasError: true, errors: json.errors };
    }

    return json.data;
  } catch (error) {
    console.error('WPGraphQL Fetch Error:', error);
    // throw error;
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
        content: '<p>Witaj na nowej stronie GMS System. Tu znajdziesz najlepsze rozwiązania dla domu i osiedla.</p>'
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
        }
      };
    }

    // Generyczny mock dla innych stron (np. o-nas)
    return {
      __typename: 'Page',
      title: uri.charAt(0).toUpperCase() + uri.slice(1).replace(/-/g, ' '),
      slug: uri,
      uri: `/${uri}/`,
      content: `<p>To jest przykładowa treść dla strony: ${uri}.</p>`
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
