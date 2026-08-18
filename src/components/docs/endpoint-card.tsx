import { cn } from "@/lib/utils";
import { AuthBadge, HttpMethod, MethodBadge } from "./method-badge";

const BORDER_BY_METHOD: Record<HttpMethod, string> = {
  GET: "border-l-blue-500",
  POST: "border-l-green-500",
  PATCH: "border-l-amber-500",
  DELETE: "border-l-red-500",
};

export function EndpointCard({
  method,
  path,
  auth,
  children,
}: {
  method: HttpMethod;
  path: string;
  auth?: "session" | "apikey" | "public";
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "mb-4 rounded-xl border-l-2 bg-card p-5 ring-1 ring-foreground/10",
        BORDER_BY_METHOD[method]
      )}
    >
      <div className="mb-3 flex flex-wrap items-center gap-2.5">
        <MethodBadge method={method} />
        <span className="font-mono text-sm text-foreground">{path}</span>
        {auth ? (
          <span className="ml-auto">
            <AuthBadge kind={auth} />
          </span>
        ) : null}
      </div>
      <div className="space-y-3 text-sm text-muted-foreground [&_code]:text-foreground">
        {children}
      </div>
    </div>
  );
}

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 mb-2 font-mono text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
      {children}
    </p>
  );
}

export function FieldsTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: React.ReactNode[][];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                className="border-b border-border py-2 pr-3 text-left font-mono text-[10px] font-medium tracking-wide text-muted-foreground uppercase"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="border-b border-border/60 py-2 pr-3 align-top text-muted-foreground last:border-b-0"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
