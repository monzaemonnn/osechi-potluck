import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { Providers } from "@/components/Providers";

const siteUrl = "https://osechi-potluck.netlify.app";

export const metadata: Metadata = {
  title: "Osechi Potluck 2026",
  description: "Join our Sharehouse New Year's Potluck! Sign up to bring a dish from your country to our interactive 3D Osechi box. Party starts January 1st.",
  keywords: ["osechi", "potluck", "new year", "sharehouse", "japanese food", "party"],
  authors: [{ name: "DMS Sharehouse" }],
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Osechi Potluck 2026 - Sharehouse New Year's Party",
    description: "Sign up to bring a dish from your country! Interactive 3D Osechi box with AI-powered suggestions and recipes.",
    url: siteUrl,
    siteName: "Osechi Potluck",
    images: [
      {
        url: `${siteUrl}/textures/lid_texture_horse.jpg`,
        width: 1200,
        height: 630,
        alt: "Osechi Potluck - Japanese New Year Lacquerware Box",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Osechi Potluck 2026",
    description: "Join our Sharehouse New Year's Potluck! Sign up to bring a dish.",
    images: [`${siteUrl}/textures/lid_texture_horse.jpg`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
