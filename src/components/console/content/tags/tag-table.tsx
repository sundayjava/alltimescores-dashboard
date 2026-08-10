"use client";

import { useCallback, useState } from "react";
import { Search, Tag as TagIcon, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tag } from "@/types/tag";
import {
  SortState,
  SortField,
  SortButton,
  RowActions,
  TagBadge,
  ArticleCountPill,
  DateCell,
} from "./tag-columns";
import { cn } from "@/lib/utils";

// ─── Skeleton row ─────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="border-b border-border">
      <td className="px-4 py-3">
        <div className="h-5 w-28 animate-pulse rounded-full bg-muted" />
      </td>
      <td className="px-4 py-3 hidden md:table-cell">
        <div className="h-4 w-48 animate-pulse rounded bg-muted" />
      </td>
      <td className="px-4 py-3 hidden sm:table-cell">
        <div className="h-5 w-8 animate-pulse rounded-full bg-muted mx-auto" />
      </td>
      <td className="px-4 py-3 hidden lg:table-cell">
        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
      </td>
      <td className="px-4 py-3">
        <div className="h-7 w-7 animate-pulse rounded bg-muted ml-auto" />
      </td>
    </tr>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({
  hasSearch,
  onClear,
}: {
  hasSearch: boolean;
  onClear: () => void;
}) {
  return (
    <tr>
      <td colSpan={5}>
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <TagIcon className="h-6 w-6 text-muted-foreground" />
          </div>
          {hasSearch ? (
            <>
              <p className="text-sm font-medium text-foreground">No tags found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                No tags match your search. Try a different term.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={onClear}
              >
                Clear search
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-foreground">No tags yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Create your first tag to start organising content.
              </p>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

// ─── Main table component ─────────────────────────────────────────────────────
interface TagTableProps {
  tags: Tag[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  isLoading: boolean;
  isFetching: boolean;
  search: string;
  sort: SortState;
  canDelete: boolean;
  onSearchChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onSortChange: (field: SortField) => void;
  onEdit: (tag: Tag) => void;
  onDelete: (tag: Tag) => void;
}

export function TagTable({
  tags,
  total,
  page,
  limit,
  totalPages,
  isLoading,
  isFetching,
  search,
  sort,
  canDelete,
  onSearchChange,
  onPageChange,
  onSortChange,
  onEdit,
  onDelete,
}: TagTableProps) {
  const [localSearch, setLocalSearch] = useState(search);

  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        onSearchChange(localSearch);
      }
    },
    [localSearch, onSearchChange]
  );

  const handleClearSearch = () => {
    setLocalSearch("");
    onSearchChange("");
  };

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Table toolbar */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-50 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search tags… (press Enter)"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="h-8 pl-8 pr-8 text-sm"
          />
          {localSearch && (
            <button
              onClick={handleClearSearch}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Count + fetching indicator */}
        <div className="flex items-center gap-2 shrink-0">
          {isFetching && !isLoading && (
            <span className="text-xs text-muted-foreground animate-pulse">
              Updating…
            </span>
          )}
          {total > 0 && (
            <span className="text-xs text-muted-foreground">
              {total} {total === 1 ? "tag" : "tags"}
            </span>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-3 text-left w-50">
                <SortButton
                  label="Name"
                  field="name"
                  sort={sort}
                  onSort={onSortChange}
                />
              </th>
              <th className="px-4 py-3 text-left hidden md:table-cell">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Description
                </span>
              </th>
              <th className="px-4 py-3 text-center hidden sm:table-cell w-25">
                <SortButton
                  label="Articles"
                  field="articles"
                  sort={sort}
                  onSort={onSortChange}
                  className="mx-auto"
                />
              </th>
              <th className="px-4 py-3 text-left hidden lg:table-cell w-35">
                <SortButton
                  label="Created"
                  field="createdAt"
                  sort={sort}
                  onSort={onSortChange}
                />
              </th>
              <th className="px-4 py-3 w-13" aria-label="Actions" />
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : tags.length === 0 ? (
              <EmptyState
                hasSearch={!!search}
                onClear={handleClearSearch}
              />
            ) : (
              tags.map((tag) => (
                <tr
                  key={tag.id}
                  className={cn(
                    "group transition-colors hover:bg-muted/30",
                    isFetching && "opacity-60"
                  )}
                >
                  {/* Name */}
                  <td className="px-4 py-3">
                    <TagBadge name={tag.name} />
                  </td>

                  {/* Description */}
                  <td className="px-4 py-3 hidden md:table-cell max-w-75">
                    {tag.description ? (
                      <span className="text-sm text-muted-foreground line-clamp-1">
                        {tag.description}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground/40 italic">
                        No description
                      </span>
                    )}
                  </td>

                  {/* Articles count */}
                  <td className="px-4 py-3 text-center hidden sm:table-cell">
                    <ArticleCountPill count={tag._count?.contents ?? 0} />
                  </td>

                  {/* Created at */}
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <DateCell dateStr={tag.createdAt} />
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right">
                    <RowActions
                      tag={tag}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      canDelete={canDelete}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!isLoading && total > 0 && (
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <p className="text-xs text-muted-foreground">
            {start}–{end} of {total} tags
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1 || isFetching}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs text-muted-foreground tabular-nums px-1">
              {page} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages || isFetching}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}