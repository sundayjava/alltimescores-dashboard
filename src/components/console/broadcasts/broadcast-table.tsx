"use client";

import { Megaphone, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Broadcast } from "@/types/broadcast";
import {
  LevelBadge,
  StatusBadge,
  BroadcastCell,
  CreatedByCell,
  DateCell,
  RowActions,
} from "./broadcast-columns";
import { cn } from "@/lib/utils";

function SkeletonRow() {
  return (
    <tr className="border-b border-border">
      <td className="px-4 py-3">
        <div className="space-y-1.5">
          <div className="h-3.5 w-40 rounded bg-muted animate-pulse" />
          <div className="h-3 w-56 rounded bg-muted animate-pulse" />
        </div>
      </td>
      <td className="px-4 py-3 hidden sm:table-cell">
        <div className="h-5 w-14 rounded-full bg-muted animate-pulse" />
      </td>
      <td className="px-4 py-3 hidden sm:table-cell">
        <div className="h-5 w-16 rounded-full bg-muted animate-pulse" />
      </td>
      <td className="px-4 py-3 hidden md:table-cell">
        <div className="h-4 w-24 rounded bg-muted animate-pulse" />
      </td>
      <td className="px-4 py-3 hidden lg:table-cell">
        <div className="h-4 w-20 rounded bg-muted animate-pulse" />
      </td>
      <td className="px-4 py-3">
        <div className="h-7 w-20 rounded bg-muted animate-pulse ml-auto" />
      </td>
    </tr>
  );
}

function EmptyState() {
  return (
    <tr>
      <td colSpan={6}>
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Megaphone className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium">No broadcasts yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Published broadcasts push live to connected clients instantly.
          </p>
        </div>
      </td>
    </tr>
  );
}

interface BroadcastTableProps {
  broadcasts: Broadcast[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  isLoading: boolean;
  isFetching: boolean;
  onPageChange: (page: number) => void;
  onDeactivate: (broadcast: Broadcast) => void;
  onReactivate: (broadcast: Broadcast) => void;
  onDelete: (broadcast: Broadcast) => void;
}

export function BroadcastTable({
  broadcasts,
  total,
  page,
  limit,
  totalPages,
  isLoading,
  isFetching,
  onPageChange,
  onDeactivate,
  onReactivate,
  onDelete,
}: BroadcastTableProps) {
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border">
        <span className="text-sm font-medium">Broadcast history</span>
        <div className="flex items-center gap-2">
          {isFetching && !isLoading && (
            <span className="text-xs text-muted-foreground animate-pulse shrink-0">
              Updating…
            </span>
          )}
          {total > 0 && (
            <span className="text-xs text-muted-foreground shrink-0">
              {total} {total === 1 ? "broadcast" : "broadcasts"}
            </span>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-3 text-left">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Broadcast
                </span>
              </th>
              <th className="px-4 py-3 text-left hidden sm:table-cell w-24">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Level
                </span>
              </th>
              <th className="px-4 py-3 text-left hidden sm:table-cell w-25">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Status
                </span>
              </th>
              <th className="px-4 py-3 text-left hidden md:table-cell w-35">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Created by
                </span>
              </th>
              <th className="px-4 py-3 text-left hidden lg:table-cell w-30">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Created
                </span>
              </th>
              <th className="px-4 py-3 w-13" aria-label="Actions" />
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : broadcasts.length === 0 ? (
              <EmptyState />
            ) : (
              broadcasts.map((broadcast) => (
                <tr
                  key={broadcast.id}
                  className={cn(
                    "group transition-colors hover:bg-muted/30",
                    isFetching && "opacity-60",
                    !broadcast.active && "opacity-60"
                  )}
                >
                  <td className="px-4 py-3 max-w-90">
                    <BroadcastCell broadcast={broadcast} />
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <LevelBadge level={broadcast.level} />
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <StatusBadge isActive={broadcast.active} />
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <CreatedByCell createdBy={broadcast.createdBy} />
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <DateCell dateStr={broadcast.createdAt} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <RowActions
                      broadcast={broadcast}
                      onDeactivate={onDeactivate}
                      onReactivate={onReactivate}
                      onDelete={onDelete}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <span className="text-xs text-muted-foreground">
            {start}–{end} of {total}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1 || isFetching}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("…");
                acc.push(p);
                return acc;
              }, [])
              .map((p, idx) =>
                p === "…" ? (
                  <span key={`e-${idx}`} className="px-1 text-xs text-muted-foreground">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => onPageChange(p as number)}
                    disabled={isFetching}
                    className={cn(
                      "h-7 w-7 rounded-md text-xs font-medium transition-colors",
                      page === p
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {p}
                  </button>
                )
              )}
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages || isFetching}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
