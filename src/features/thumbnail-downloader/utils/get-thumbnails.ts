export const DEFAULT_VIDEO_ID = "H8bQYBtF4bQ";
export const DEFAULT_THUMBNAILS = getThumbnails(DEFAULT_VIDEO_ID);

export function getThumbnails(videoId: string) {
  const BASE = `https://img.youtube.com/vi/${videoId}`;

  return {
    maxres: {
      width: 1280,
      height: 720,
      label: "Full HD (1280×720)",
      url: `${BASE}/maxresdefault.jpg`,
    },
    standard: {
      width: 640,
      height: 480,
      label: "Standard (640×480)",
      url: `${BASE}/sddefault.jpg`,
    },
    high: {
      width: 480,
      height: 360,
      label: "High (480×360)",
      url: `${BASE}/hqdefault.jpg`,
    },
    medium: {
      width: 320,
      height: 180,
      label: "Medium (320×180)",
      url: `${BASE}/mqdefault.jpg`,
    },
    default: {
      width: 120,
      height: 90,
      label: "Default (120×90)",
      url: `${BASE}/default.jpg`,
    },
  };
}
