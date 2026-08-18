import { cn } from "@/lib/utils";

export function Callout({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "warn";
}) {
  return (
    <div
      className={cn(
        "my-4 rounded-lg border-l-2 px-4 py-3 text-sm",
        tone === "warn"
          ? "border-l-red-500 bg-red-500/5 text-foreground"
          : "border-l-amber-500 bg-amber-500/5 text-foreground"
      )}
    >
      {children}
    </div>
  );
}
