import createMiddleware from 'next-intl/middleware';
import { updateSession } from '@/utils/supabase/middleware';
import { NextResponse, type NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
  locales: ['pl', 'en', 'de', 'fr', 'ua', 'sk', 'cs', 'hu', 'da', 'it', 'nl', 'no', 'sv'],
  defaultLocale: 'pl',
  localePrefix: 'as-needed'
});

export async function proxy(request: NextRequest) {
  // 1. next-intl generuje routing językowy i tworzy obiekt Response
  const response = intlMiddleware(request);

  // 2. Przekazujemy ten sam obiekt Response przez Supabase, aby zachować ciasteczka sesji
  return await updateSession(request, response);
}

export const config = {
  // Matcher musi łapać wszystkie ścieżki, które mają być tłumaczone
  matcher: [
    '/', 
    '/(pl|en|de|fr|ua|sk|cs|hu|da|it|nl|no|sv)/:path*',
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};
