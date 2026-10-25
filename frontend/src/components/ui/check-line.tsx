import { CircleAlert, CircleCheck, TriangleAlert } from "lucide-react";

export type Check = { level: "ok" | "warn" | "error"; text: string };

export function CheckLine({ check }: { check: Check }) {
  const Icon = check.level === "ok" ? CircleCheck : check.level === "warn" ? TriangleAlert : CircleAlert;
  const color = check.level === "ok" ? "text-green-500" : check.level === "warn" ? "text-amber-500" : "text-brand";
  return (
    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Icon className={`size-3.5 shrink-0 ${color}`} />
      {check.text}
    </span>
  );
}
