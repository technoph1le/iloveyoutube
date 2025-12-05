import { Metadata } from "next";
import { PAGES } from "@/data/pages";

const data = PAGES.pricing;

export const metadata: Metadata = {
  title: `${data.title} | iLoveYouTube`,
  description: data.description,
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
