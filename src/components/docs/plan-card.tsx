import { cn } from "@/lib/utils";

export function PlanCard({
  name,
  price,
  limit,
  highlight,
}: {
  name: string;
  price: string;
  limit: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-4 ring-1 ring-foreground/10",
        highlight && "border-accent/40"
      )}
    >
      <p className="mb-1 font-mono text-xs font-semibold tracking-wide text-foreground">
        {name}
      </p>
      <p className="mb-3 text-xs text-muted-foreground">{price}</p>
      <p className="font-mono text-lg text-accent tabular-nums">{limit}</p>
      <p className="text-xs text-muted-foreground">requests / day</p>
    </div>
  );
}
