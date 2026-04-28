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

import ChatWidget from "@/components/Chat/ChatWidget";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pl"
      className={`${poppins.variable} font-sans h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
