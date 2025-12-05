interface Props {
  videoId: string;
  isAutoplay: boolean;
  isLoop: boolean;
  isMute: boolean;
  hasControls: boolean;
  isResponsive: boolean;
  startTime: string;
  endTime: string;
}

export function getEmbedCode({
  videoId,
  isAutoplay,
  isLoop,
  isMute,
  hasControls,
  isResponsive,
  startTime,
  endTime,
}: Props) {
  const iframeSrc =
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

  const code = `<iframe
  width="560"
  height="315"
  src="${iframeSrc}"
  title="YouTube video player"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  referrerpolicy="strict-origin-when-cross-origin"
  allowfullscreen
></iframe>`;

  const iframeCode = isResponsive
    ? `<div style="position:relative;width:100%;aspect-ratio:16/9;">
  <iframe
    width="100%"
    height="100%"
    src="${iframeSrc}"
    title="YouTube video player"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerpolicy="strict-origin-when-cross-origin"
    allowfullscreen
  ></iframe>
</div>`
    : code;

  return { iframeSrc, iframeCode };
}
