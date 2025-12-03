"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { SOCIAL_LINKS } from "@/data/social-links";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../ui/navigation-menu";
import Link from "next/link";

export default function Footer() {
  const stats = useQuery(api.stats.get);
  const thumbnailCount = new Intl.NumberFormat("en-US").format(
    stats?.thumbnails || 0
  );

  return (
    <footer className="border-t">
      <div className="wrapper py-8 space-y-4">
        <p className="text-center max-w-[70ch] mx-auto text-lg">
          We&apos;ve already processed <b>12,345,678 videos</b>, downloaded{" "}
          <b>987 TB</b> of data, and help to download{" "}
          <b>{thumbnailCount} thumbnails</b> — all completely free!
        </p>

        <NavigationMenu className="w-fit mx-auto">
          <NavigationMenuList className="flex-wrap gap-4">
            {SOCIAL_LINKS.map(({ label, url, icon: Icon }) => (
              <NavigationMenuItem key={label}>
                <NavigationMenuLink asChild>
                  <Link href={url} target="_blank" rel="noopener noreferrer">
                    <Icon className="size-5" />
                    <span className="sr-only">{label}</span>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </footer>
  );
}
