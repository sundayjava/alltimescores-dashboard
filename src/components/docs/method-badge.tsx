import { cn } from "@/lib/utils";

const METHOD_STYLES = {
  GET: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  POST: "bg-green-500/10 text-green-600 dark:text-green-400",
  PATCH: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  DELETE: "bg-red-500/10 text-red-600 dark:text-red-400",
} as const;

export type HttpMethod = keyof typeof METHOD_STYLES;

export function MethodBadge({ method }: { method: HttpMethod }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-1.5 py-0.5 font-mono text-[11px] font-semibold tracking-wide",
        METHOD_STYLES[method]
      )}
    >
      {method}
    </span>
  );
}

export function AuthBadge({
  kind,
}: {
  kind: "session" | "apikey" | "public";
}) {
  const styles = {
    session: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    apikey: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    public: "bg-green-500/10 text-green-600 dark:text-green-400",
  } as const;

  const label = {
    session: "session",
    apikey: "api key",
    public: "public",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wide uppercase",
        styles[kind]
      )}
    >
      {label[kind]}
    </span>
  );
}
