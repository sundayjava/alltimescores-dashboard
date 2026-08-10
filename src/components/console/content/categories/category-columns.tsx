"use client";

import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { format } from "date-fns";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Category } from "@/types/category";
import { cn } from "@/lib/utils";

// ─── Sort types ───────────────────────────────────────────────────────────────
export type SortField = "name" | "createdAt" | "contents" | "sortOrder";
export type SortDirection = "asc" | "desc";

export interface SortState {
  field: SortField | null;
  direction: SortDirection;
}

// ─── Sort button ──────────────────────────────────────────────────────────────
interface SortButtonProps {
  label: string;
  field: SortField;
  sort: SortState;
  onSort: (field: SortField) => void;
  className?: string;
}

export function SortButton({
  label,
  field,
  sort,
  onSort,
  className,
}: SortButtonProps) {
  const isActive = sort.field === field;
  return (
    <button
      onClick={() => onSort(field)}
      className={cn(
        "flex items-center gap-1 text-xs font-medium text-muted-foreground uppercase tracking-wide hover:text-foreground transition-colors",
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

// ─── Row actions ──────────────────────────────────────────────────────────────
interface RowActionsProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function RowActions({ category, onEdit, onDelete }: RowActionsProps) {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleOpen = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const menuWidth = 140;
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
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
            <div
              className="fixed z-50 min-w-35 rounded-lg border border-border bg-popover p-1 shadow-md animate-in fade-in-0 zoom-in-95 duration-100"
              style={{ top: menuPos.top, left: menuPos.left }}
            >
              <button
                onClick={() => { onEdit(category); setOpen(false); }}
                className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-popover-foreground hover:bg-muted transition-colors"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>
              <button
                onClick={() => { onDelete(category); setOpen(false); }}
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

// ─── Category name cell ───────────────────────────────────────────────────────
export function CategoryNameCell({ category }: { category: Category }) {
  return (
    <div className="flex items-center gap-2.5">
      {/* Color dot */}
      <span
        className="h-2.5 w-2.5 rounded-full shrink-0 border border-border"
        style={{ backgroundColor: category.color || "transparent" }}
      />
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {category.name}
        </p>
        {category.parent && (
          <p className="text-xs text-muted-foreground truncate">
            ↳ {category.parent.name}
          </p>
        )}
      </div>
    </div>
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

// ─── Count pill ───────────────────────────────────────────────────────────────
export function CountPill({ count, label }: { count: number; label: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium tabular-nums",
        count > 0
          ? "bg-primary/10 text-primary"
          : "bg-muted text-muted-foreground"
      )}
      title={`${count} ${label}`}
    >
      {count}
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