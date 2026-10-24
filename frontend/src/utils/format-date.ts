// "2026-10-24" -> "24 October 2026" (day-month order reads clearly worldwide).
export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { dateStyle: "long", timeZone: "UTC" });
