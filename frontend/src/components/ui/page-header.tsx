import type { ReactNode } from "react";

export function PageHeader({ title, description }: { title: string; description?: ReactNode }) {
  return (
    <header className="text-center">
      <h1 className="text-4xl font-bold sm:text-5xl">{title}</h1>
      {description && <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">{description}</p>}
    </header>
  );
}
