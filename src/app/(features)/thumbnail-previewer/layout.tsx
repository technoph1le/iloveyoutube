import { ThumbnailPreviewDataProvider } from "@/features/thumbnail-previewer/contexts/thumbnail-preview-data-context";
import { ThumbnailPreviewFormProvider } from "@/features/thumbnail-previewer/contexts/thumbnail-preview-form-context";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThumbnailPreviewDataProvider>
      <ThumbnailPreviewFormProvider>{children}</ThumbnailPreviewFormProvider>;
    </ThumbnailPreviewDataProvider>
  );
}
