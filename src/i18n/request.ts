import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['pl', 'en', 'de', 'fr', 'ua', 'sk', 'cs', 'hu', 'da', 'it', 'nl', 'no', 'sv'];
export const defaultLocale = 'pl';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !locales.includes(locale as any)) {
    locale = defaultLocale;
  }

  try {
    return {
      locale,
      messages: (await import(`../../messages/${locale}.json`)).default
    };
  } catch (error) {
    notFound();
  }
});
