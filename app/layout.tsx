import type { Metadata } from "next";
import { Inter, Playfair_Display, Noto_Sans_Bengali } from "next/font/google";

import "./globals.css";
import { AppProviders } from "@/providers/app-providers";

const fontDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
});

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontBangla = Noto_Sans_Bengali({
  subsets: ["bengali"],
  variable: "--font-bangla",
});

export const metadata: Metadata = {
  title: "Men's Lifestyle",
  description: "Modern men's lifestyle and fashion store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${fontDisplay.variable} ${fontSans.variable} ${fontBangla.variable} font-sans`}
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}