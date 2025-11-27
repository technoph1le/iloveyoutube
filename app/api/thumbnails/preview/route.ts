import { THUMBNAIL_PREVIEW_CATEGORIES } from "@/features/thumbnail-previewer/data";
import { OEmbedResponse } from "@/features/thumbnail-previewer/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const category = searchParams.get(
    "category"
  ) as keyof typeof THUMBNAIL_PREVIEW_CATEGORIES;

  if (!category)
    return NextResponse.json({ error: "Missing video ID" }, { status: 400 });

  const fetchVideoMeta = async (videoId: string) => {
    try {
      const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}`;
      const res = await fetch(url);

      if (!res.ok) throw new Error("Failed to fetch video meta");

      const data: OEmbedResponse = await res.json();

      return {
        title: data.title,
        channel: data.author_name,
        thumbnail: data.thumbnail_url,
      };
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const ids = THUMBNAIL_PREVIEW_CATEGORIES[category];
  const results = await Promise.all(ids.map(fetchVideoMeta));

  return NextResponse.json(results.filter(Boolean));
}
