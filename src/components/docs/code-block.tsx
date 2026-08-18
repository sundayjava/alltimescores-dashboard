import { cn } from "@/lib/utils";

export function CodeBlock({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="overflow-x-auto rounded-lg bg-zinc-950 ring-1 ring-white/10">
      <pre
        className={cn(
          "px-4 py-3 font-mono text-[13px] leading-relaxed whitespace-pre text-zinc-200",
          className
        )}
      >
        {children}
      </pre>
    </div>
  );
}
