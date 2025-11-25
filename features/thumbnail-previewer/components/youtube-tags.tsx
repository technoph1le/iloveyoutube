import { Button } from "@/components/ui/button";
import { THUMBNAIL_PREVIEW_CATEGORIES } from "@/lib/constants";
import { capitalize } from "@/lib/utils";
import { Dispatch, SetStateAction } from "react";

interface Props {
  activeCategory: keyof typeof THUMBNAIL_PREVIEW_CATEGORIES;
  setActiveCategory: Dispatch<
    SetStateAction<keyof typeof THUMBNAIL_PREVIEW_CATEGORIES>
  >;
}

export default function YouTubeTags({
  activeCategory,
  setActiveCategory,
}: Props) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto my-4 py-2">
      {(
        Object.keys(THUMBNAIL_PREVIEW_CATEGORIES) as Array<
          keyof typeof THUMBNAIL_PREVIEW_CATEGORIES
        >
      ).map((category) => (
        <Button
          key={category}
          variant={category === activeCategory ? "default" : "secondary"}
          onClick={() => setActiveCategory(category)}
          className="font-semibold"
        >
          {capitalize(category)}
        </Button>
      ))}
    </div>
  );
}
