// YouTube images are loaded through our backend (/api/images) so visitors'
// browsers never connect to Google's servers just by opening a page.
export function proxiedImage(url: string): string;
export function proxiedImage(url: string | null): string | null;
export function proxiedImage(url: string | null) {
  return url ? `/api/images?url=${encodeURIComponent(url)}` : null;
}

// A video's thumbnail from our backend; `download` adds a filename and makes
// the browser save it instead of showing it.
export function thumbnailPath(
  id: string,
  size: string,
  format: "jpg" | "webp",
  download?: { name: string },
) {
  const path = `/api/videos/${id}/thumbnails/${size}.${format}`;
  return download ? `${path}?download=1&name=${encodeURIComponent(download.name)}` : path;
}
