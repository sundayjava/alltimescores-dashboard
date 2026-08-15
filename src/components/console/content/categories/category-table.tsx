"use client";

import { useCallback, useState } from "react";
import {
  Search,
  FolderOpen,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Category } from "@/types/category";
import {
  SortState,
  SortField,
  SortButton,
  RowActions,
  CategoryNameCell,
  StatusBadge,
  CountPill,
  DateCell,
} from "./category-columns";
import { cn } from "@/lib/utils";

// ─── Filter tab ───────────────────────────────────────────────────────────────
type ActiveFilter = "all" | "active" | "inactive";

function FilterTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1 text-xs font-medium rounded-md transition-colors",
        active
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
      )}
    >
      {label}
    </button>
  );
}

// ─── Skeleton row ─────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="border-b border-border">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="h-2.5 w-2.5 rounded-full bg-muted animate-pulse shrink-0" />
          <div className="h-4 w-32 rounded bg-muted animate-pulse" />
        </div>
      </td>
      <td className="px-4 py-3 hidden md:table-cell">
        <div className="h-4 w-40 rounded bg-muted animate-pulse" />
      </td>
      <td className="px-4 py-3 hidden sm:table-cell">
        <div className="h-5 w-14 rounded-full bg-muted animate-pulse" />
      </td>
      <td className="px-4 py-3 hidden lg:table-cell">
        <div className="h-5 w-8 rounded-full bg-muted animate-pulse mx-auto" />
      </td>
      <td className="px-4 py-3 hidden xl:table-cell">
        <div className="h-4 w-24 rounded bg-muted animate-pulse" />
      </td>
      <td className="px-4 py-3">
        <div className="h-7 w-7 rounded bg-muted animate-pulse ml-auto" />
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
      <td colSpan={6}>
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <FolderOpen className="h-6 w-6 text-muted-foreground" />
          </div>
          {hasSearch ? (
            <>
              <p className="text-sm font-medium">No categories found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                No categories match your search.
              </p>
              <Button variant="outline" size="sm" className="mt-4" onClick={onClear}>
                Clear search
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm font-medium">No categories yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Create your first category to organise your content.
              </p>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

// ─── Main table ───────────────────────────────────────────────────────────────
interface CategoryTableProps {
  categories: Category[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  isLoading: boolean;
  isFetching: boolean;
  search: string;
  sort: SortState;
  activeFilter: ActiveFilter;
  onSearchChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onSortChange: (field: SortField) => void;
  onFilterChange: (filter: ActiveFilter) => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function CategoryTable({
  categories,
  total,
  page,
  limit,
  totalPages,
  isLoading,
  isFetching,
  search,
  sort,
  activeFilter,
  onSearchChange,
  onPageChange,
  onSortChange,
  onFilterChange,
  onEdit,
  onDelete,
}: CategoryTableProps) {
  const [localSearch, setLocalSearch] = useState(search);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") onSearchChange(localSearch);
    },
    [localSearch, onSearchChange]
  );

  const handleClear = () => {
    setLocalSearch("");
    onSearchChange("");
  };

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          {/* Active filter tabs */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-muted">
            <FilterTab
              label="All"
              active={activeFilter === "all"}
              onClick={() => onFilterChange("all")}
            />
            <FilterTab
              label="Active"
              active={activeFilter === "active"}
              onClick={() => onFilterChange("active")}
            />
            <FilterTab
              label="Inactive"
              active={activeFilter === "inactive"}
              onClick={() => onFilterChange("inactive")}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-1 justify-end">
          {/* Search */}
          <div className="relative min-w-45 max-w-xs w-full">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search categories…"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-8 pl-8 pr-8 text-sm"
            />
            {localSearch && (
              <button
                onClick={handleClear}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {isFetching && !isLoading && (
            <span className="text-xs text-muted-foreground animate-pulse shrink-0">
              Updating…
            </span>
          )}
          {total > 0 && (
            <span className="text-xs text-muted-foreground shrink-0">
              {total} {total === 1 ? "category" : "categories"}
            </span>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-3 text-left">
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
              <th className="px-4 py-3 text-left hidden sm:table-cell w-25">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Status
                </span>
              </th>
              <th className="px-4 py-3 text-center hidden lg:table-cell w-22.5">
                <SortButton
                  label="Content"
                  field="contents"
                  sort={sort}
                  onSort={onSortChange}
                  className="mx-auto"
                />
              </th>
              <th className="px-4 py-3 text-left hidden xl:table-cell w-35">
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
            ) : categories.length === 0 ? (
              <EmptyState hasSearch={!!search} onClear={handleClear} />
            ) : (
              categories.map((category) => (
                <tr
                  key={category.id}
                  className={cn(
                    "group transition-colors hover:bg-muted/30",
                    isFetching && "opacity-60"
                  )}
                >
                  <td className="px-4 py-3">
                    <CategoryNameCell category={category} />
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell max-w-70">
                    {category.description ? (
                      <span className="text-sm text-muted-foreground line-clamp-1">
                        {category.description}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground/40 italic">
                        No description
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <StatusBadge isActive={category.isActive} />
                  </td>
                  <td className="px-4 py-3 text-center hidden lg:table-cell">
                    <CountPill
                      count={category._count?.contents ?? 0}
                      label="articles"
                    />
                  </td>
                  <td className="px-4 py-3 hidden xl:table-cell">
                    <DateCell dateStr={category.createdAt} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <RowActions
                      category={category}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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