import type { Metadata } from "next";
import { Playfair_Display, Inter, Hind_Siliguri } from "next/font/google";
import { AppProviders } from "@/providers/app-providers";
import { AnalyticsScripts } from "@/components/analytics/analytics-scripts";
import { PageViewTracker } from "@/components/analytics/page-view-tracker";
import { siteConfig } from "@/config/site";
import "./globals.css";

const fontDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display-family",
  display: "swap",
});

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans-family",
  display: "swap",
});

const fontBangla = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bangla-family",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${fontDisplay.variable} ${fontSans.variable} ${fontBangla.variable} font-sans`}>
        <AnalyticsScripts />
        <PageViewTracker />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
