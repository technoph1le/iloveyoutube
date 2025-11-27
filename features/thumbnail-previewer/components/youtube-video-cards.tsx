import YouTubeVideoCard from "./youtube-video-card";
import { useContext } from "react";
import { VideoCardType } from "../types";
import { ThumbnailPreviewContext } from "../contexts/ThumbnailPreviewContext";
import useFetch from "@/hooks/useFetch";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

export default function YouTubeVideoCards() {
  const { title, channel, thumbnail, category } = useContext(
    ThumbnailPreviewContext
  );

  const {
    data: videos,
    loading,
    error,
  } = useFetch<VideoCardType[]>(`/api/thumbnails/preview?category=${category}`);

  if (loading) return <Spinner />;
  if (!videos) return null;
  if (error) return toast.error(error);

  return (
    <>
      <YouTubeVideoCard video={{ title, thumbnail, channel }} />
      {videos.map((video) => (
        <YouTubeVideoCard key={video.thumbnail} video={video} />
      ))}
    </>
  );
}
