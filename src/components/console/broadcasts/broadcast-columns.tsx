"use client";

import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { format } from "date-fns";
import { MoreHorizontal, EyeOff, Eye, Trash2, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Broadcast, BroadcastLevel } from "@/types/broadcast";
import { cn } from "@/lib/utils";

// ─── Level badge ──────────────────────────────────────────────────────────────
const LEVEL_STYLES: Record<BroadcastLevel, string> = {
  INFO: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  WARNING: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  CRITICAL: "bg-red-500/10 text-red-600 dark:text-red-400",
};

export function LevelBadge({ level }: { level: BroadcastLevel }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize",
        LEVEL_STYLES[level]
      )}
    >
      {level.toLowerCase()}
    </span>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────
export function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        isActive
          ? "bg-green-500/10 text-green-600 dark:text-green-400"
          : "bg-muted text-muted-foreground"
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          isActive ? "bg-green-500" : "bg-muted-foreground"
        )}
      />
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

// ─── Broadcast cell ───────────────────────────────────────────────────────────
export function BroadcastCell({ broadcast }: { broadcast: Broadcast }) {
  return (
    <div className="min-w-0">
      <p className="text-sm font-medium text-foreground truncate">
        {broadcast.title}
      </p>
      <p className="text-xs text-muted-foreground truncate">
        {broadcast.message}
      </p>
      {broadcast.link && (
        <a
          href={broadcast.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-0.5 inline-flex items-center gap-1 text-xs text-primary hover:underline"
        >
          <LinkIcon className="h-3 w-3" />
          {broadcast.linkLabel || broadcast.link}
        </a>
      )}
    </div>
  );
}

// ─── Created by cell ──────────────────────────────────────────────────────────
export function CreatedByCell({ createdBy }: { createdBy: Broadcast["createdBy"] }) {
  return (
    <span className="text-sm text-muted-foreground truncate">
      {createdBy.firstName} {createdBy.lastName}
    </span>
  );
}

// ─── Date cell ────────────────────────────────────────────────────────────────
export function DateCell({ dateStr }: { dateStr: string }) {
  return (
    <span className="text-sm text-muted-foreground tabular-nums">
      {format(new Date(dateStr), "dd MMM yyyy")}
    </span>
  );
}

// ─── Row actions ──────────────────────────────────────────────────────────────
interface RowActionsProps {
  broadcast: Broadcast;
  onDeactivate: (broadcast: Broadcast) => void;
  onReactivate: (broadcast: Broadcast) => void;
  onDelete: (broadcast: Broadcast) => void;
}

export function RowActions({
  broadcast,
  onDeactivate,
  onReactivate,
  onDelete,
}: RowActionsProps) {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleOpen = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const menuWidth = 150;
      const menuHeight = 80;
      const spaceBelow = window.innerHeight - rect.bottom;
      const top =
        spaceBelow < menuHeight + 8
          ? rect.top - menuHeight - 4
          : rect.bottom + 4;
      setMenuPos({ top, left: rect.right - menuWidth });
    }
    setOpen((v) => !v);
  };

  return (
    <div>
      <Button
        ref={buttonRef}
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={handleOpen}
        aria-label="Open actions"
      >
        <MoreHorizontal className="h-4 w-4" />
      </Button>

      {open &&
        createPortal(
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <div
              className="fixed z-50 min-w-37.5 rounded-lg border border-border bg-popover p-1 shadow-md animate-in fade-in-0 zoom-in-95 duration-100"
              style={{ top: menuPos.top, left: menuPos.left }}
            >
              {broadcast.active ? (
                <button
                  onClick={() => { onDeactivate(broadcast); setOpen(false); }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-popover-foreground hover:bg-muted transition-colors"
                >
                  <EyeOff className="h-3.5 w-3.5" />
                  Deactivate
                </button>
              ) : (
                <button
                  onClick={() => { onReactivate(broadcast); setOpen(false); }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-popover-foreground hover:bg-muted transition-colors"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Reactivate
                </button>
              )}
              <button
                onClick={() => { onDelete(broadcast); setOpen(false); }}
                className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          </>,
          document.body
        )}
    </div>
  );
}
