import { Metadata } from "next";
import { FEATURES } from "@/data/features";

const data = FEATURES.thumbnailDownloader;

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
