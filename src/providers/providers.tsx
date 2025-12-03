"use client";

import { ConvexClerkProvider } from "./convex-clerk-provider";
import { ThemeProvider } from "./theme-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ConvexClerkProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </ConvexClerkProvider>
    </>
  );
}
