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

export const metadata: Metadata = {
  title: "iLoveYouTube",
  description: "All the free tools you need for YouTube",
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
