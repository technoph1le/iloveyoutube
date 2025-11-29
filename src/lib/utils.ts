import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(string: string) {
  return string[0].toUpperCase() + string.slice(1);
}

export function slugify(string: string, separator = "-") {
  return string
    .toString() // Cast to string (optional)
    .toLowerCase() // Convert the string to lowercase letters
    .trim() // Remove whitespace from both sides of a string (optional)
    .replace(/\s+/g, separator) // Replace spaces with {separator}
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\_/g, separator) // Replace _ with {separator}
    .replace(/\-\-+/g, separator) // Replace multiple - with single {separator}
    .replace(/\-$/g, ""); // Remove trailing -
}

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
