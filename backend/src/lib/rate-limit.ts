import type { Request } from "express";

// Fixed-window counters kept in memory. Fine for a single server instance;
// counts reset when the server restarts.
export function createLimiter({ windowMs, max }: { windowMs: number; max: number }) {
  const windows = new Map<string, { start: number; count: number }>();

  return {
    // Counts one use for `key`. Returns how long to wait when over the limit.
    take(key: string): { ok: true } | { ok: false; retryAfterSeconds: number } {
      const now = Date.now();
      let window = windows.get(key);
      if (!window || now - window.start >= windowMs) {
        window = { start: now, count: 0 };
        windows.set(key, window);
      }
      if (window.count >= max) {
        return { ok: false, retryAfterSeconds: Math.ceil((window.start + windowMs - now) / 1000) };
      }
      window.count++;
      // Drop expired windows now and then so the map can't grow unbounded.
      if (windows.size > 10_000) {
        for (const [k, w] of windows) if (now - w.start >= windowMs) windows.delete(k);
      }
      return { ok: true };
    },
  };
}

// The visitor's address as seen by the frontend proxy, which forwards it in
// X-Forwarded-For. Anyone calling this server directly can fake that header,
// so per-visitor limits are best effort; the site-wide limit is the backstop.
export function clientIp(req: Request) {
  const forwarded = req.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || req.socket.remoteAddress || "unknown";
}
