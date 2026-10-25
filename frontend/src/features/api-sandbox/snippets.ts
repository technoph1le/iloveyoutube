import { API_BASE } from "./endpoints";

export type Language = "curl" | "javascript" | "python";

export const LANGUAGES: { id: Language; label: string }[] = [
  { id: "curl", label: "cURL" },
  { id: "javascript", label: "JavaScript" },
  { id: "python", label: "Python" },
];

// Shared code never contains the visitor's real key.
export const KEY_PLACEHOLDER = "YOUR_API_KEY";

export function requestUrl(resource: string, query: Record<string, string>, key = KEY_PLACEHOLDER) {
  return `${API_BASE}/${resource}?${new URLSearchParams({ ...query, key })}`;
}

export function snippet(language: Language, resource: string, query: Record<string, string>) {
  const params = { ...query, key: KEY_PLACEHOLDER };
  // JSON string literals are valid in both JavaScript and Python.
  const entries = Object.entries(params).map(([k, v]) => [/^[a-z]\w*$/i.test(k) ? k : JSON.stringify(k), JSON.stringify(v)]);

  if (language === "curl") return `curl "${requestUrl(resource, query)}"`;

  if (language === "javascript") {
    return [
      "const params = new URLSearchParams({",
      ...entries.map(([k, v]) => `  ${k}: ${v},`),
      "});",
      "",
      `const res = await fetch(\`${API_BASE}/${resource}?\${params}\`);`,
      "const data = await res.json();",
      "console.log(data);",
    ].join("\n");
  }

  return [
    "import requests",
    "",
    "params = {",
    ...Object.entries(params).map(([k, v]) => `    ${JSON.stringify(k)}: ${JSON.stringify(v)},`),
    "}",
    "",
    `res = requests.get("${API_BASE}/${resource}", params=params)`,
    "print(res.json())",
  ].join("\n");
}

// Plain-language advice for the errors people hit most.
const ERROR_HINTS: Record<string, string> = {
  keyInvalid: "Your API key isn't valid. Copy it again from the Google Cloud console.",
  accessNotConfigured:
    "The YouTube Data API v3 isn't enabled for this key's project. Enable it in the Google Cloud console, then try again in a minute.",
  quotaExceeded:
    "This key has used its 10,000 daily quota units. Quota resets at midnight Pacific Time. Search requests use 100 units each.",
  ipRefererBlocked:
    "This key is restricted to other websites. Allow this site in the key's restrictions, or use an unrestricted key for testing.",
  forbidden: "YouTube doesn't allow this request, for example because the item is private.",
  commentsDisabled: "The video's owner has turned comments off.",
  videoNotFound: "No video with that ID exists, or it's private.",
  channelNotFound: "No channel with that ID exists.",
  playlistNotFound: "No playlist with that ID exists, or it's private.",
  commentNotFound: "No comment with that ID exists.",
};

type ApiError = { error?: { message?: string; errors?: { reason?: string }[]; details?: { reason?: string }[] } };

export function errorHint(data: unknown): string | null {
  const error = (data as ApiError)?.error;
  if (!error) return null;
  const reasons = [...(error.errors ?? []), ...(error.details ?? [])].map((e) => e.reason ?? "");
  if (reasons.includes("API_KEY_INVALID")) return ERROR_HINTS.keyInvalid;
  for (const reason of reasons) if (ERROR_HINTS[reason]) return ERROR_HINTS[reason];
  return null;
}

export function errorMessage(data: unknown): string | null {
  return (data as ApiError)?.error?.message ?? null;
}
