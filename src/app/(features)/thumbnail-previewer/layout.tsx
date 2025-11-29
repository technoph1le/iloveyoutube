import { ThumbnailPreviewProvider } from "@/features/thumbnail-previewer/contexts/ThumbnailPreviewContext";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ThumbnailPreviewProvider>{children}</ThumbnailPreviewProvider>;
}
