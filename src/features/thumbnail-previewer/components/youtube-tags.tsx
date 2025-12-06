import { Button } from "@/components/ui/button";
import { capitalize } from "@/lib/utils";
import { useContext } from "react";
import { ThumbnailPreviewFormContext } from "../contexts/thumbnail-preview-form-context";
import { THUMBNAIL_PREVIEW_CATEGORIES } from "../data/thumbnail-preview-categories";

export default function YouTubeTags() {
  const { category, setCategory } = useContext(ThumbnailPreviewFormContext);

  return (
    <div className="flex items-center gap-2 overflow-x-auto my-4 py-2">
      {THUMBNAIL_PREVIEW_CATEGORIES.map((cat) => (
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
