interface Props {
  videoId: string;
  isAutoplay: boolean;
  isLoop: boolean;
  isMute: boolean;
  hasControls: boolean;
  startTime: string;
  endTime: string;
}

export function getEmbedCode({
  videoId,
  isAutoplay,
  isLoop,
  isMute,
  hasControls,
  startTime,
  endTime,
}: Props) {
  const src =
    `https://www.youtube.com/embed/${videoId}?` +
    new URLSearchParams({
      autoplay: isAutoplay ? "1" : "0",
      loop: isLoop ? "1" : "0",
      mute: isMute ? "1" : "0",
      controls: hasControls ? "1" : "0",
      start: startTime?.toString() ?? "",
      end: endTime?.toString() ?? "",
      rel: "0",
      modestbranding: "1",
      playsinline: "1",
      enablejsapi: "1",
      ...(isLoop ? { playlist: videoId } : {}),
    });

  return src;
}
