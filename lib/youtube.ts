/**
 * Extracts YouTube video ID from the video URL.
 * @example
 * https://www.youtube.com/watch?v=BhRi7fJzPgk => BhRi7fJzPgk
 */
export function extractYouTubeId(videoURL: string) {
  try {
    const url = new URL(videoURL);

    // Standard URL: ?v=ID
    if (url.searchParams.get("v")) {
      return url.searchParams.get("v")!;
    }

    // youtu.be/ID
    if (url.hostname === "youtu.be") {
      return url.pathname.slice(1);
    }

    // youtube.com/embed/ID
    if (url.pathname.startsWith("/embed/")) {
      return url.pathname.split("/")[2];
    }

    // youtube.com/shorts/ID
    if (url.pathname.startsWith("/shorts/")) {
      return url.pathname.split("/")[2];
    }

    return null;
  } catch {
    // plain ID already
    return videoURL;
  }
}
