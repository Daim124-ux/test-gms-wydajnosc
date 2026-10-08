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
    // Explicit static imports for Next.js bundler
    const [
      common, navigation, footer, chat,
      wiata, garaze
    ] = await Promise.all([
      import(`../../messages/${locale}/global/common.json`),
      import(`../../messages/${locale}/global/navigation.json`),
      import(`../../messages/${locale}/global/footer.json`),
      import(`../../messages/${locale}/global/chat.json`),
      import(`../../messages/${locale}/pages/system-dom/wiata-rowerowa.json`),
      import(`../../messages/${locale}/pages/system-dom/garaze-stalowe.json`).catch(() => ({ default: {} }))
    ]);

    return {
      locale,
      messages: {
        global: {
          common: common.default,
          navigation: navigation.default,
          footer: footer.default,
          chat: chat.default
        },
        pages: {
          'system-dom': {
            'wiata-rowerowa': wiata.default,
            'garaze-stalowe': garaze.default
          }
        }
      }
    };
  } catch (error) {
    console.error('Error loading translations:', error);
    notFound();
  }
});
