"use client";

import { Moon, Sun } from "lucide-react";
import { THEME_COOKIE } from "@/utils/theme";

export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    document.cookie = `${THEME_COOKIE}=${next}; path=/; max-age=31536000; SameSite=Lax`;
  }

  // Both icons render; CSS picks one from data-theme, so SSR and client agree.
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch between light and dark theme"
      className="inline-flex size-11 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-muted"
    >
      <Moon className="size-5 dark:block hidden" />
      <Sun className="size-5 dark:hidden block" />
    </button>
  );
}
