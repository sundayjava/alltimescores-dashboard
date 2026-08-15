"use client";

import { useCallback, useState } from "react";
import { Search, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ContentType } from "@/types/content-type";
import { cn } from "@/lib/utils";
import {
  SortButton,
  RowActions,
  StatusBadge,
  IconBadge,
  SlugCell,
  SortOrderPill,
  DateCell,
  SortState,
  SortField,
} from "./content-type-columns";

type ActiveFilter = "all" | "active" | "inactive";

interface ContentTypeTableProps {
  contentTypes: ContentType[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  isLoading: boolean;
  isFetching: boolean;
  search: string;
  sort: SortState;
  isActiveFilter: boolean | undefined;
  canDelete: boolean;
  onSearchChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onSortChange: (field: SortField) => void;
  onIsActiveFilterChange: (value: boolean | undefined) => void;
  onEdit: (contentType: ContentType) => void;
  onDelete: (contentType: ContentType) => void;
}

const FILTER_OPTIONS: { key: ActiveFilter; label: string; value: boolean | undefined }[] = [
  { key: "all", label: "All", value: undefined },
  { key: "active", label: "Active", value: true },
  { key: "inactive", label: "Inactive", value: false },
];

export function ContentTypeTable({
  contentTypes,
  total,
  page,
  limit,
  totalPages,
  isLoading,
  isFetching,
  search,
  sort,
  isActiveFilter,
  canDelete,
  onSearchChange,
  onPageChange,
  onSortChange,
  onIsActiveFilterChange,
  onEdit,
  onDelete,
}: ContentTypeTableProps) {
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
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search content types… (press Enter)"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="pl-9 pr-9 h-9 text-sm"
          />
          {localSearch && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Active filter */}
        <div className="flex items-center gap-1.5">
          {FILTER_OPTIONS.map(({ key, label, value }) => {
            const isSelected =
              value === undefined
                ? isActiveFilter === undefined
                : isActiveFilter === value;

            return (
              <button
                key={key}
                onClick={() => onIsActiveFilterChange(value)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                  isSelected
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div
        className={cn(
          "rounded-xl border border-border overflow-hidden",
          isFetching && !isLoading && "opacity-70 transition-opacity"
        )}
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-4 py-3 text-left">
                <SortButton label="Name" field="name" sort={sort} onSort={onSortChange} />
              </th>
              <th className="px-4 py-3 text-left hidden md:table-cell">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Icon
                </span>
              </th>
              <th className="px-4 py-3 text-left hidden sm:table-cell">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Status
                </span>
              </th>
              <th className="px-4 py-3 text-left hidden lg:table-cell">
                <SortButton label="Order" field="sortOrder" sort={sort} onSort={onSortChange} />
              </th>
              <th className="px-4 py-3 text-left hidden lg:table-cell">
                <SortButton label="Created" field="createdAt" sort={sort} onSort={onSortChange} />
              </th>
              <th className="px-4 py-3 w-10" />
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <div className="h-4 w-32 rounded bg-muted animate-pulse" />
                      <div className="h-3 w-20 rounded bg-muted animate-pulse" />
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="h-5 w-16 rounded bg-muted animate-pulse" />
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <div className="h-5 w-14 rounded bg-muted animate-pulse" />
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div className="h-5 w-8 rounded bg-muted animate-pulse" />
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div className="h-4 w-24 rounded bg-muted animate-pulse" />
                  </td>
                  <td className="px-4 py-3" />
                </tr>
              ))
            ) : contentTypes.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center">
                  <p className="text-sm text-muted-foreground">
                    {search
                      ? `No content types found for "${search}".`
                      : "No content types yet. Create one to get started."}
                  </p>
                </td>
              </tr>
            ) : (
              contentTypes.map((ct) => (
                <tr
                  key={ct.id}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="space-y-0.5">
                      <p className="font-medium text-foreground leading-tight">
                        {ct.name}
                      </p>
                      <SlugCell slug={ct.slug} />
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <IconBadge icon={ct.icon} />
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <StatusBadge isActive={ct.isActive} />
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <SortOrderPill order={ct.sortOrder} />
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <DateCell dateStr={ct.createdAt} />
                  </td>
                  <td className="px-4 py-3">
                    <RowActions
                      contentType={ct}
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
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {start}–{end} of {total} content types
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