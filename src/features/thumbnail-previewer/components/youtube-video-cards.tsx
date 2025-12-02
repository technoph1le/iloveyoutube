import YouTubeVideoCard from "./youtube-video-card";
import { useContext } from "react";
import { VideoCardType, YouTubeVideoCardProps } from "../types";
import { ThumbnailPreviewContext } from "../contexts/ThumbnailPreviewContext";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

export default function YouTubeVideoCards({
  orientation = "vertical",
  variant = "desktop",
  withoutAvatar = false,
  withoutChannel = false,
  withoutDescription = false,
  withoutTags = false,
}: YouTubeVideoCardProps) {
  const { title, channel, thumbnail, category } = useContext(
    ThumbnailPreviewContext
  );

  const {
    data: videos,
    loading,
    error,
  } = useFetch<VideoCardType[]>(`/api/thumbnails/preview?category=${category}`);

  if (loading) return <Spinner />;
  if (error) {
    toast.error(error);
    return null;
  }

  if (!videos) return null;

  return (
    <>
      <YouTubeVideoCard
        video={{ title, thumbnail, channel }}
        orientation={orientation}
        variant={variant}
        withoutAvatar={withoutAvatar}
        withoutChannel={withoutChannel}
        withoutDescription={withoutDescription}
        withoutTags={withoutTags}
      />
      {videos.map((video) => (
        <YouTubeVideoCard
          key={video.thumbnail}
          video={video}
          orientation={orientation}
          variant={variant}
          withoutAvatar={withoutAvatar}
          withoutChannel={withoutChannel}
          withoutDescription={withoutDescription}
          withoutTags={withoutTags}
        />
      ))}
    </>
  );
}
