import type { Metadata, Viewport } from "next";
import { Figtree } from "next/font/google";
import { siteConfig } from "@/config/site";
import { siteGraph } from "@/lib/structured-data";
import { JsonLd } from "@/components/json-ld";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MetaPixel } from "@/components/meta-pixel";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

// One typeface for everything, from the Mamo mockups.
const body = Figtree({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const defaultTitle = `${siteConfig.name}: ${siteConfig.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: defaultTitle,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "tech help for seniors",
    "tech support for elderly parents",
    "voice AI assistant for older adults",
    "help parents with tech",
    "family tech support waitlist",
    "Mamo",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "technology",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: siteConfig.name,
    title: defaultTitle,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: siteConfig.description,
    ...(siteConfig.twitterHandle
      ? { site: siteConfig.twitterHandle, creator: siteConfig.twitterHandle }
      : {}),
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#113c42",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  // data-scroll-behavior lets Next jump to the top of a new page
  // without the smooth-scroll animation. In-page links stay smooth.
  return (
    <html
      lang="en"
      className={`${body.variable} h-full`}
      data-scroll-behavior="smooth"
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-teal focus:px-5 focus:py-3 focus:text-xl focus:font-bold focus:text-white"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <JsonLd data={siteGraph()} />
        <MetaPixel />
        <Analytics />
      </body>
    </html>
  );
}
