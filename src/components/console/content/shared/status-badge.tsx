"use client";

import { ContentStatus } from "@/types/content";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<
  ContentStatus,
  { label: string; className: string; dot: string }
> = {
  DRAFT: {
    label: "Draft",
    className: "bg-muted text-muted-foreground",
    dot: "bg-muted-foreground",
  },
  REVIEW: {
    label: "In Review",
    className: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    dot: "bg-yellow-500",
  },
  APPROVED: {
    label: "Approved",
    className: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    dot: "bg-blue-500",
  },
  PUBLISHED: {
    label: "Published",
    className: "bg-green-500/10 text-green-600 dark:text-green-400",
    dot: "bg-green-500",
  },
  SCHEDULED: {
    label: "Scheduled",
    className: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    dot: "bg-purple-500",
  },
  ARCHIVED: {
    label: "Archived",
    className: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    dot: "bg-orange-500",
  },
};

interface StatusBadgeProps {
  status: ContentStatus;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.DRAFT;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm",
        config.className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
}