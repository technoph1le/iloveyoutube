export function extractYouTubeId(input: string) {
  try {
    const url = new URL(input);

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
    return input;
  }
}
