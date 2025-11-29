"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function Footer() {
  const stats = useQuery(api.stats.get);
  const thumbnailCount = new Intl.NumberFormat("en-US").format(
    stats?.thumbnails || 0
  );

  return (
    <footer className="border-t">
      <div className="wrapper py-8">
        <p className="text-center max-w-[70ch] mx-auto text-lg">
          {/* We&apos;ve already processed <b>12,345,678 videos</b>, downloaded{" "}
          <b>987 TB</b> of data, and help to download{" "}
          <b>{thumbnailCount} thumbnails</b> — all completely free! */}
          We&apos;ve already helped to download{" "}
          <b>{thumbnailCount} thumbnails</b> — all completely free!
        </p>
      </div>
    </footer>
  );
}
