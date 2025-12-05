import type { Metadata } from "next";
import { Source_Sans_3, Roboto_Slab, Roboto } from "next/font/google";
import "./globals.css";
import Header from "@/components/layouts/header";
import Footer from "@/components/layouts/footer";
import { Toaster } from "@/components/ui/sonner";
import { ConvexClerkProvider } from "@/providers/convex-clerk-provider";
import { ThemeProvider } from "@/providers/theme-provider";

const sourceSans3 = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

const roboto = Roboto({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-youtube",
});

export const siteBaseUrl = "https://iloveyoutube.vercel.app";

export const metadata: Metadata = {
  title: "iLoveYouTube | Free online YouTube tools",
  description: "Free online tools for YouTube creators and users.",
  metadataBase: new URL(siteBaseUrl),
  keywords: [
    "youtube tools",
    "youtube downloader",
    "thumbnail downloader",
    "embed generator",
    "youtube to mp3",
  ],
  openGraph: {
    title: "iLoveYouTube | Free online YouTube tools",
    description: "Free online tools for YouTube creators and users.",
    url: siteBaseUrl,
    type: "website",
    siteName: "iLoveYouTube",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "iLoveYouTube | Free online YouTube tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "iLoveYouTube | Free online YouTube tools",
    description: "Free online tools for YouTube creators and users.",
    images: ["/og-default.png"],
  },
  alternates: {
    canonical: siteBaseUrl,
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
    googleBot: "index, follow",
  },
  applicationName: "iLoveYouTube | Free online YouTube tools",
  appleWebApp: {
    title: "iLoveYouTube | Free online YouTube tools",
    statusBarStyle: "default",
    capable: true,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: "/apple-touch-icon.png",
  },

  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${sourceSans3.variable} ${robotoSlab.variable} ${roboto.variable} antialiased`}
        >
          <ThemeProvider>
            <Toaster />
            <Header />
            <main>{children}</main>
            <Footer />
          </ThemeProvider>
        </body>
      </html>
    </ConvexClerkProvider>
  );
}
