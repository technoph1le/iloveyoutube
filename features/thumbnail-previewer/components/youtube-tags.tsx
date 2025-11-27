import { Button } from "@/components/ui/button";
import { capitalize } from "@/lib/utils";
import { useContext } from "react";
import { THUMBNAIL_PREVIEW_CATEGORIES } from "../data";
import { ThumbnailPreviewContext } from "../contexts/ThumbnailPreviewContext";

export default function YouTubeTags() {
  const { category, setCategory } = useContext(ThumbnailPreviewContext);

  return (
    <div className="flex items-center gap-2 overflow-x-auto my-4 py-2">
      {(
        Object.keys(THUMBNAIL_PREVIEW_CATEGORIES) as Array<
          keyof typeof THUMBNAIL_PREVIEW_CATEGORIES
        >
      ).map((cat) => (
        <Button
          key={cat}
          variant={cat === category ? "default" : "secondary"}
          onClick={() => setCategory(cat)}
          className="font-semibold"
        >
          {capitalize(cat)}
        </Button>
      ))}
    </div>
  );
}
