import { EmbedPreviewContextProvider } from "@/features/youtube-embed-preview/contexts/embed-preview-context";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <EmbedPreviewContextProvider>{children}</EmbedPreviewContextProvider>;
}
