import { cn } from "@/lib/utils";

function SectionHeader({
  className,
  ...props
}: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="section-header"
      className={cn("space-y-2 text-center", className)}
      {...props}
    />
  );
}

function SectionTitle({ className, ...props }: React.ComponentProps<"h1">) {
  return (
    <h1
      data-slot="section-title"
      className={cn("text-2xl md:text-4xl font-bold", className)}
      {...props}
    />
  );
}

function SectionSubtitle({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="section-subtitle"
      className={cn("text-muted-foreground max-w-[90ch] mx-auto", className)}
      {...props}
    />
  );
}

export { SectionHeader, SectionTitle, SectionSubtitle };
