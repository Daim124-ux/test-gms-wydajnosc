import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GMS System | Wiaty Premium",
  description: "Zaawansowane stalowe wiaty systemowe na rowery",
};

import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n/request';
import Header from "@/components/Header/Header";
import ChatWidget from "@/components/Chat/ChatWidget";
import Script from "next/script";
import "./globals.css";

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Weryfikacja czy język jest na liście obsługiwanych
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Pobieramy tłumaczenia dla klienta
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${poppins.variable} font-sans h-full antialiased`}>
      <head>
        <Script 
          type="module" 
          src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js" 
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Header />
          {children}
          <ChatWidget />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
