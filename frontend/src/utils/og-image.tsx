import { ImageResponse } from "next/og";
import { siteConfig } from "@/data/site";

export const ogSize = { width: 1200, height: 630 };

const HEART =
  "M12 21.35 10.55 20C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35Z";

// The social preview card shown when a page is shared (Open Graph / X).
export function ogImage(title: string, subtitle: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0f0f0f",
          color: "#f5f5f5",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 44, fontWeight: 800 }}>
          <span>I</span>
          <svg width="52" height="52" viewBox="0 0 24 24">
            <path fill="#ff0000" d={HEART} />
          </svg>
          <span>YOUTUBE</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.1 }}>{title}</div>
          <div style={{ fontSize: 36, color: "#a3a3a3", lineHeight: 1.3 }}>{subtitle}</div>
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#a3a3a3" }}>
          {new URL(siteConfig.url).host} · Free · No sign-up
        </div>
      </div>
    ),
    ogSize,
  );
}

// Square app icon: the red heart on the site background.
export function appIcon(size: number) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f0f0f",
          borderRadius: size / 5,
        }}
      >
        <svg width={size * 0.7} height={size * 0.7} viewBox="0 0 24 24">
          <path fill="#ff0000" d={HEART} />
        </svg>
      </div>
    ),
    { width: size, height: size },
  );
}
