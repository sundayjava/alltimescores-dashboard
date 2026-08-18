import { MethodBadge } from "./method-badge";

export interface RefRow {
  path: string;
  required?: string;
  optional?: string;
  returns: React.ReactNode;
}

export function RefTable({ rows }: { rows: RefRow[] }) {
  return (
    <div className="mb-6 overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-160 border-collapse text-sm">
        <thead>
          <tr>
            <th className="border-b border-border bg-muted/40 px-4 py-2.5 text-left font-mono text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
              Endpoint
            </th>
            <th className="border-b border-border bg-muted/40 px-4 py-2.5 text-left font-mono text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
              Params
            </th>
            <th className="border-b border-border bg-muted/40 px-4 py-2.5 text-left font-mono text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
              Returns
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.path} className="hover:bg-muted/30">
              <td className="border-b border-border/60 px-4 py-3 align-top whitespace-nowrap last:border-b-0">
                <span className="flex items-center gap-2 font-mono text-foreground">
                  <MethodBadge method="GET" />
                  {row.path}
                </span>
              </td>
              <td className="border-b border-border/60 px-4 py-3 align-top font-mono text-[13px] last:border-b-0">
                {row.required ? (
                  <span className="font-medium text-foreground">
                    {row.required}
                  </span>
                ) : null}
                {row.required && row.optional ? (
                  <span className="text-muted-foreground"> · </span>
                ) : null}
                {row.optional ? (
                  <span className="text-muted-foreground">
                    {row.optional}
                  </span>
                ) : null}
              </td>
              <td className="border-b border-border/60 px-4 py-3 align-top text-muted-foreground last:border-b-0">
                {row.returns}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
