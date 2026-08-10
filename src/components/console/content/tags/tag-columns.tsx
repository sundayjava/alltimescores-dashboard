"use client";

import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { format } from "date-fns";
import { MoreHorizontal, Pencil, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tag } from "@/types/tag";
import { cn } from "@/lib/utils";

// ─── Sort types ──────────────────────────────────────────────────────────────
export type SortField = "name" | "createdAt" | "articles";
export type SortDirection = "asc" | "desc";

export interface SortState {
  field: SortField | null;
  direction: SortDirection;
}

// ─── Sort header button ───────────────────────────────────────────────────────
interface SortButtonProps {
  label: string;
  field: SortField;
  sort: SortState;
  onSort: (field: SortField) => void;
  className?: string;
}

export function SortButton({ label, field, sort, onSort, className }: SortButtonProps) {
  const isActive = sort.field === field;

  return (
    <button
      onClick={() => onSort(field)}
      className={cn(
        "flex items-center gap-1 text-xs font-medium text-muted-foreground uppercase tracking-wide",
        "hover:text-foreground transition-colors",
        isActive && "text-foreground",
        className
      )}
    >
      {label}
      <span className="ml-0.5">
        {isActive ? (
          sort.direction === "asc" ? (
            <ArrowUp className="h-3 w-3" />
          ) : (
            <ArrowDown className="h-3 w-3" />
          )
        ) : (
          <ArrowUpDown className="h-3 w-3 opacity-40" />
        )}
      </span>
    </button>
  );
}

// ─── Row actions dropdown ─────────────────────────────────────────────────────
interface RowActionsProps {
  tag: Tag;
  onEdit: (tag: Tag) => void;
  onDelete: (tag: Tag) => void;
  canDelete: boolean;
}

export function RowActions({ tag, onEdit, onDelete, canDelete }: RowActionsProps) {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleOpen = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const menuWidth = 140;
      const menuHeight = canDelete ? 80 : 44;
      const spaceBelow = window.innerHeight - rect.bottom;

      // Flip upward if not enough space below
      const top =
        spaceBelow < menuHeight + 8
          ? rect.top - menuHeight - 4
          : rect.bottom + 4;

      setMenuPos({
        top,
        left: rect.right - menuWidth,
      });
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
            {/* Click-away overlay */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
            <div
              className="fixed z-50 min-w-35 rounded-lg border border-border bg-popover p-1 shadow-md animate-in fade-in-0 zoom-in-95 duration-100"
              style={{ top: menuPos.top, left: menuPos.left }}
            >
              <button
                onClick={() => {
                  onEdit(tag);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-popover-foreground hover:bg-muted transition-colors"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>
              {canDelete && (
                <button
                  onClick={() => {
                    onDelete(tag);
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              )}
            </div>
          </>,
          document.body
        )}
    </div>
  );
}

// ─── Tag badge chip ───────────────────────────────────────────────────────────
export function TagBadge({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-accent/40 px-2.5 py-0.5 text-xs font-medium">
      # {name}
    </span>
  );
}

// ─── Article count pill ───────────────────────────────────────────────────────
export function ArticleCountPill({ count }: { count: number }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium tabular-nums",
        count > 0
          ? "bg-primary/10 text-primary"
          : "bg-muted text-muted-foreground"
      )}
    >
      {count}
    </span>
  );
}

// ─── Formatted date cell ──────────────────────────────────────────────────────
export function DateCell({ dateStr }: { dateStr: string }) {
  const date = new Date(dateStr);
  return (
    <span className="text-sm text-muted-foreground tabular-nums">
      {format(date, "dd MMM yyyy")}
    </span>
  );
}